import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'

/*
  Navbar: Navigation bar with conditional driver and passenger actions
  Shows different links based on authentication state
  Responsive design for mobile and desktop
*/
export default function Navbar() {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated, role } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    navigate('/')
  }

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-white font-bold text-xl md:text-2xl flex items-center gap-2">
            <img src={logo} alt="Jay Uttarakhand Logo" className="w-32 md:w-44" style={{height: 'auto'}} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/vehicles" 
              className="text-white hover:text-gray-200 font-medium flex items-center gap-1 transition"
            >
              🔍 Browse Rides
            </Link>

            {isAuthenticated ? (
              <>
                {role === 'passenger' && (
                  <Link 
                    to="/passenger/bookings" 
                    className="text-white hover:text-gray-200 font-medium flex items-center gap-1 transition"
                  >
                    📋 My Bookings
                  </Link>
                )}

                {role === 'driver' && (
                  <>
                    <Link 
                      to="/driver/dashboard" 
                      className="text-white hover:text-gray-200 font-medium transition"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/driver/ride-requests"
                      className="text-white hover:text-gray-200 font-medium flex items-center gap-1 transition"
                    >
                      📬 Ride Requests
                    </Link>
                    <Link
                      to="/driver/my"
                      className="text-white hover:text-gray-200 font-medium transition"
                    >
                      My Vehicles
                    </Link>
                  </>
                )}

                <span className="text-gray-200">|</span>
                <span className="text-white font-medium">{user?.name || 'User'}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/driver/login" 
                  className="text-white hover:text-gray-200 font-medium transition"
                >
                  Driver Login
                </Link>
                <Link 
                  to="/driver/register" 
                  className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white text-2xl"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-indigo-700 border-t border-indigo-500 py-4 px-4 space-y-3">
            <Link 
              to="/vehicles" 
              className="block text-white hover:text-gray-200 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              🔍 Browse Rides
            </Link>

            {isAuthenticated ? (
              <>
                {role === 'passenger' && (
                  <Link 
                    to="/passenger/bookings" 
                    className="block text-white hover:text-gray-200 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    📋 My Bookings
                  </Link>
                )}

                {role === 'driver' && (
                  <>
                    <Link 
                      to="/driver/dashboard" 
                      className="block text-white hover:text-gray-200 font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/driver/ride-requests"
                      className="block text-white hover:text-gray-200 font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      📬 Ride Requests
                    </Link>
                    <Link
                      to="/driver/my"
                      className="block text-white hover:text-gray-200 font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Vehicles
                    </Link>
                  </>
                )}

                <div className="pt-2 border-t border-indigo-500">
                  <div className="text-white font-medium mb-2">Hello, {user?.name || 'User'}</div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/driver/login" 
                  className="block text-white hover:text-gray-200 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Driver Login
                </Link>
                <Link 
                  to="/driver/register" 
                  className="block bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
