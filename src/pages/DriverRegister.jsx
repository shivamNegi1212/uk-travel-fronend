import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'
import SimpleHeader from '../components/SimpleHeader'

export default function DriverRegister() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', passwordConfirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { registerDriver, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/driver/dashboard')
    }
  }, [isAuthenticated, navigate])

  const submit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!form.name || !form.email || !form.phone || !form.password || !form.passwordConfirm) {
      setError('Please fill all fields')
      return
    }

    if (form.password !== form.passwordConfirm) {
      setError('Passwords do not match')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (form.phone.length < 10) {
      setError('Please enter a valid phone number')
      return
    }

    setLoading(true)
    try {
      await registerDriver(form.name, form.email, form.phone, form.password, form.passwordConfirm)
      navigate('/driver/dashboard')
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Registration failed'
      setError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <SimpleHeader />

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4 py-8">
        {error && <Toast message={error} type="error" onClose={() => setError(null)} />}

        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">🚙</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Create Driver Account</h2>
          <p className="text-center text-gray-600 text-sm mb-6">Start earning today</p>

          {/* Form */}
          <form onSubmit={submit} className="space-y-3">
            {/* Name */}
            <div>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email address"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Phone */}
            <div>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone number"
                maxLength="10"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Password (min 6 chars)"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                value={form.passwordConfirm}
                onChange={(e) => setForm({ ...form, passwordConfirm: e.target.value })}
                placeholder="Confirm password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:cursor-not-allowed text-sm mt-4"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-xs text-gray-500">Have account?</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Login Link */}
          <Link
            to="/driver/login"
            className="block w-full text-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-lg transition text-sm"
          >
            Login
          </Link>

          {/* Footer Links */}
          <div className="mt-6 space-y-2 text-center text-sm">
            <Link to="/" className="block text-blue-600 hover:text-blue-700 font-medium">
              Back to Home
            </Link>
            <p className="text-gray-600">
              Want to ride?{' '}
              <Link to="/passenger/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
