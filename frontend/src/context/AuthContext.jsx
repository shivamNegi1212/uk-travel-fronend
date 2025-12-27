/**
 * Auth Context: Manages authentication state for both drivers and passengers
 * Handles: Login, register, logout, role selection, token management
 * Stores: User info, token, role, and authentication state
 */
import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null) // 'driver' or 'passenger'
  const [currentRole, setCurrentRole] = useState(null) // For drivers switching between modes
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    const storedRole = localStorage.getItem('role')
    const storedCurrentRole = localStorage.getItem('currentRole')

    if (token && storedUser && storedRole) {
      setUser(JSON.parse(storedUser))
      setRole(storedRole)
      setCurrentRole(storedCurrentRole || storedRole)
    }
  }, [])

  /**
   * Register new driver
   * Stores token and user info in localStorage
   */
  const registerDriver = async (name, email, phone, password, passwordConfirm) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/auth/driver/register', {
        name,
        email,
        phone,
        password,
        passwordConfirm,
      })

      const { token, driver } = res.data

      // Store auth data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(driver))
      localStorage.setItem('role', 'driver')
      localStorage.setItem('currentRole', driver.currentRole || 'driver')

      setUser(driver)
      setRole('driver')
      setCurrentRole(driver.currentRole || 'driver')

      return driver
    } catch (err) {
      const message = err.response?.data?.message || err.message
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Login driver
   * Stores token and user info in localStorage
   */
  const loginDriver = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/auth/driver/login', { email, password })

      const { token, driver } = res.data

      // Store auth data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(driver))
      localStorage.setItem('role', 'driver')
      localStorage.setItem('currentRole', driver.currentRole || 'driver')

      setUser(driver)
      setRole('driver')
      setCurrentRole(driver.currentRole || 'driver')

      return driver
    } catch (err) {
      let message = 'Login failed. Please try again.'
      
      if (err.response?.data?.message) {
        message = err.response.data.message
      } else if (err.response?.status === 404) {
        message = 'Invalid email or password'
      } else if (err.response?.status === 401) {
        message = 'Invalid email or password'
      } else if (err.code === 'ECONNABORTED') {
        message = 'Request timeout. Check your connection.'
      } else if (!err.response) {
        message = 'Network error. Please check your internet connection.'
      }
      
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Register new passenger
   * Stores token and user info in localStorage
   */
  const registerPassenger = async (name, email, phone, password, passwordConfirm) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/auth/passenger/register', {
        name,
        email,
        phone,
        password,
        passwordConfirm,
      })

      const { token, passenger } = res.data

      // Store auth data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(passenger))
      localStorage.setItem('role', 'passenger')
      localStorage.setItem('currentRole', 'passenger')

      setUser(passenger)
      setRole('passenger')
      setCurrentRole('passenger')

      return passenger
    } catch (err) {
      const message = err.response?.data?.message || err.message
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Login passenger
   * Stores token and user info in localStorage
   */
  const loginPassenger = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/auth/passenger/login', { email, password })

      const { token, passenger } = res.data

      // Store auth data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(passenger))
      localStorage.setItem('role', 'passenger')
      localStorage.setItem('currentRole', 'passenger')

      setUser(passenger)
      setRole('passenger')
      setCurrentRole('passenger')

      return passenger
    } catch (err) {
      let message = 'Login failed. Please try again.'
      
      if (err.response?.data?.message) {
        message = err.response.data.message
      } else if (err.response?.status === 404) {
        message = 'Invalid email or password'
      } else if (err.response?.status === 401) {
        message = 'Invalid email or password'
      } else if (err.code === 'ECONNABORTED') {
        message = 'Request timeout. Check your connection.'
      } else if (!err.response) {
        message = 'Network error. Please check your internet connection.'
      }
      
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Switch current role (for drivers who can act as both driver and passenger)
   * Route: POST /api/auth/set-role
   */
  const switchRole = async (newRole) => {
    setLoading(true)
    setError(null)
    try {
      if (role !== 'driver') {
        throw new Error('Only drivers can switch roles')
      }

      if (!['driver', 'passenger'].includes(newRole)) {
        throw new Error('Invalid role')
      }

      const res = await api.post('/auth/set-role', { role: newRole })

      // Update localStorage and state
      localStorage.setItem('currentRole', newRole)
      setCurrentRole(newRole)

      return res.data
    } catch (err) {
      const message = err.response?.data?.message || err.message
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Logout: Clear token and user info
   */
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    localStorage.removeItem('currentRole')
    setUser(null)
    setRole(null)
    setCurrentRole(null)
    setError(null)
  }

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = Boolean(user && localStorage.getItem('token'))

  /**
   * Check if user is a driver
   */
  const isDriver = role === 'driver'

  /**
   * Check if user is a passenger
   */
  const isPassenger = role === 'passenger'

  /**
   * Check if driver is currently in driver mode
   */
  const isInDriverMode = currentRole === 'driver'

  /**
   * Check if driver is currently in passenger mode
   */
  const isInPassengerMode = currentRole === 'passenger'

  const value = {
    user,
    role,
    currentRole,
    loading,
    error,
    isAuthenticated,
    isDriver,
    isPassenger,
    isInDriverMode,
    isInPassengerMode,
    registerDriver,
    loginDriver,
    registerPassenger,
    loginPassenger,
    switchRole,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
