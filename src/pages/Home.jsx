import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [date, setDate] = useState('')
  const [route, setRoute] = useState('')
  const navigate = useNavigate()

  const search = () => {
    // Build query string from selected filters
    const params = new URLSearchParams()
    if (date) params.append('date', date)
    if (route) params.append('route', route)

    navigate(`/vehicles?${params.toString()}`)
  }

  const viewAll = () => {
    navigate('/vehicles')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Find a Ride</h1>
        <p className="text-gray-600">Delhi ↔ Uttarakhand • Private Vehicles</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Search Rides</h2>

        <div className="space-y-4">
          {/* Route Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Route</label>
            <select
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All routes</option>
              <option value="DelhiToUK">Delhi → Uttarakhand</option>
              <option value="UKToDelhi">Uttarakhand → Delhi</option>
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Travel Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={search}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
            >
              Search Rides
            </button>
            <button
              onClick={viewAll}
              className="flex-1 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition"
            >
              View All
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 pt-6 border-t space-y-3">
          <h3 className="font-semibold text-gray-900">How it works:</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Search for available rides by route and date</li>
            <li>✓ View driver details and vehicle information</li>
            <li>✓ Call the driver directly to confirm your booking</li>
            <li>✓ Drivers: Register and list your vehicles for free</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
