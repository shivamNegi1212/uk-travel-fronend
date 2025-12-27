import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 py-5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🚗</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Jay Uttarakhand</h1>
              <p className="text-xs text-gray-500">Ride Sharing Made Easy</p>
            </div>
          </div>
          <p className="hidden md:block text-sm text-gray-600">Safe • Affordable • Reliable</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-[calc(100vh-80px)] grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* DRIVER SECTION */}
        <div className="bg-blue-50 p-8 md:p-12 flex flex-col justify-between">
          {/* Driver Header */}
          <div className="mb-10">
            <div className="text-6xl mb-6">🚙</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Be a Driver</h2>
            <p className="text-gray-600">Earn money by sharing your rides</p>
          </div>

          {/* Features List */}
          <div className="space-y-3 mb-10">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚗</span>
              <div>
                <h4 className="font-semibold text-gray-900">Create Rides</h4>
                <p className="text-sm text-gray-600">List your rides and find passengers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-semibold text-gray-900">Manage Bookings</h4>
                <p className="text-sm text-gray-600">Accept/reject ride requests easily</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⭐</span>
              <div>
                <h4 className="font-semibold text-gray-900">Build Your Rating</h4>
                <p className="text-sm text-gray-600">Get reviews from passengers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <h4 className="font-semibold text-gray-900">Earn Money</h4>
                <p className="text-sm text-gray-600">Get paid for every ride</p>
              </div>
            </div>
          </div>

          {/* Driver Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => navigate('/driver/login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/driver/register')}
              className="w-full bg-white border-2 border-blue-600 hover:bg-blue-50 text-blue-600 font-bold py-3 px-6 rounded-lg transition"
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* PASSENGER SECTION */}
        <div className="bg-purple-50 p-8 md:p-12 flex flex-col justify-between">
          {/* Passenger Header */}
          <div className="mb-10">
            <div className="text-6xl mb-6">👤</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Be a Passenger</h2>
            <p className="text-gray-600">Save money by sharing rides</p>
          </div>

          {/* Features List */}
          <div className="space-y-3 mb-10">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔍</span>
              <div>
                <h4 className="font-semibold text-gray-900">Browse Rides</h4>
                <p className="text-sm text-gray-600">Find rides matching your route</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎫</span>
              <div>
                <h4 className="font-semibold text-gray-900">Book Seats</h4>
                <p className="text-sm text-gray-600">Reserve seats in seconds</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💸</span>
              <div>
                <h4 className="font-semibold text-gray-900">Save Money</h4>
                <p className="text-sm text-gray-600">Split costs with others</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌟</span>
              <div>
                <h4 className="font-semibold text-gray-900">Rate Drivers</h4>
                <p className="text-sm text-gray-600">Share your experience safely</p>
              </div>
            </div>
          </div>

          {/* Passenger Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => navigate('/passenger/login')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/passenger/register')}
              className="w-full bg-white border-2 border-purple-600 hover:bg-purple-50 text-purple-600 font-bold py-3 px-6 rounded-lg transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <div className="bg-gray-100 border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2025 Jay Uttarakhand - UK Travel App</p>
        </div>
      </div>
    </div>
  )
}
