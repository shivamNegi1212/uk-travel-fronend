import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'
import SimpleHeader from '../components/SimpleHeader'

export default function PassengerLogin() {
  const navigate = useNavigate()
  const { loginPassenger, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/passenger/home')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Please fill all fields')
      return
    }

    setLoading(true)
    try {
      await loginPassenger(email, password)
      navigate('/passenger/home')
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Login failed. Check your credentials.'
      setError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <SimpleHeader />

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        {error && <Toast message={error} type="error" onClose={() => setError(null)} />}

        <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Welcome Back</h2>
          <p className="text-center text-gray-600 text-sm mb-6">Login to book your next ride</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-xs text-gray-500">New here?</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Register Link */}
          <Link
            to="/passenger/register"
            className="block w-full text-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-lg transition text-sm"
          >
            Create Account
          </Link>

          {/* Footer Links */}
          <div className="mt-6 space-y-2 text-center text-sm">
            <Link to="/" className="block text-indigo-600 hover:text-indigo-700 font-medium">
              Back to Home
            </Link>
            <p className="text-gray-600">
              Driver?{' '}
              <Link to="/driver/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
