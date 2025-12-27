/**
 * RoleSelection Page: Default landing page for authenticated users
 * Shows two options to choose between driver and passenger modes
 * Features:
 * - Auto-redirects if user already has a selected role
 * - Handles drivers (who can switch modes) and passengers (single mode)
 * - Saves role selection to localStorage and session
 * - Beautiful gradient UI with smooth animations
 */
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'

export default function RoleSelection() {
  const navigate = useNavigate()
  const { user, role, currentRole, switchRole, isAuthenticated, error } = useAuth()

  useEffect(() => {
    // Auto-redirect if user already has a role selected
    if (isAuthenticated && currentRole === 'driver') {
      navigate('/driver/dashboard')
    } else if (isAuthenticated && currentRole === 'passenger') {
      navigate('/passenger/home')
    }
  }, [currentRole, navigate, isAuthenticated])

  const handleSelectDriver = async () => {
    try {
      if (role === 'driver') {
        await switchRole('driver')
        navigate('/driver/dashboard')
      } else {
        // Non-drivers can't select driver mode
        navigate('/driver/login')
      }
    } catch (err) {
      console.error('Error switching to driver mode:', err)
    }
  }

  const handleSelectPassenger = async () => {
    try {
      if (role === 'driver') {
        // Driver switching to passenger mode
        await switchRole('passenger')
        navigate('/passenger/home')
      } else if (role === 'passenger') {
        // Passenger logging in for first time
        navigate('/passenger/home')
      } else {
        // Not authenticated - redirect to login
        navigate('/driver/login')
      }
    } catch (err) {
      console.error('Error switching to passenger mode:', err)
    }
  }

  // If user is authenticated and has currentRole set, they'll auto-redirect via useEffect
  // This prevents flickering by not rendering while redirect happens
  if (isAuthenticated && currentRole) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {error && <Toast message={error} type="error" />}

      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h-2m0 0h-2m2 0v-2m0 2v2M7 20h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v13a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isAuthenticated ? `Welcome back, ${user?.name}!` : 'Welcome to UK Travel App'}
            </h1>
            <p className="text-gray-600 text-sm mt-2">
              {isAuthenticated
                ? 'How would you like to continue?'
                : 'Choose your role to get started'}
            </p>
          </div>

          {/* Options Container */}
          <div className="space-y-4">
            {/* Continue as Driver (if driver) */}
            {isAuthenticated && role === 'driver' && (
              <button
                onClick={handleSelectDriver}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <div className="flex items-center justify-center space-x-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-lg">Continue as Driver</p>
                    <p className="text-xs opacity-90">Manage rides & earnings</p>
                  </div>
                </div>
              </button>
            )}

            {/* Continue as Passenger */}
            <button
              onClick={handleSelectPassenger}
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              <div className="flex items-center justify-center space-x-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-lg">Continue as Passenger</p>
                  <p className="text-xs opacity-90">Book rides & save money</p>
                </div>
              </div>
            </button>
          </div>

          {/* Info Card */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              {isAuthenticated && role === 'driver'
                ? 'You can switch between driver and passenger modes anytime.'
                : !isAuthenticated
                  ? 'Log in or register to start your journey'
                  : 'Already a driver? Log in with your driver account.'}
            </p>
          </div>

          {/* Login/Register Link (for unauthenticated users) */}
          {!isAuthenticated && (
            <div className="mt-6 pt-6 border-t border-gray-200 text-sm">
              <p className="text-gray-600 mb-3">Don't have an account?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/driver/login')}
                  className="flex-1 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/driver/register')}
                  className="flex-1 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
                >
                  Register
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
