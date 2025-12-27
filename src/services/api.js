import axios from 'axios'

// Axios instance configured for backend API
// Base URL from environment variable or defaults to live backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://uk-travel-backend.onrender.com/api'

console.log('🌐 API Base URL:', API_BASE_URL)

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor: Add JWT token to all requests
 * Reads token from localStorage and sets Authorization header
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Response interceptor: Handle errors globally
 * If token expires (401), clear localStorage and redirect to login
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        error.message = 'Request timeout. Please check your internet connection.'
      } else if (error.message === 'Network Error') {
        error.message = 'Network error. Please check your internet connection.'
      }
    }

    // Handle 401 unauthorized
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('driver')
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      window.location.href = '/driver/login'
    }

    return Promise.reject(error)
  }
)

export default api