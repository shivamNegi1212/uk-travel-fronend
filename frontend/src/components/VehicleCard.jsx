import React, { useState } from 'react'

/*
  VehicleCard: Displays vehicle listing with seat status, request button, and call option
  Shows available seats, prevents requests when FULL, displays FULL badge
*/
export default function VehicleCard({ vehicle, onRequestSeats }) {
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestSeats, setRequestSeats] = useState(1)
  const [requesting, setRequesting] = useState(false)

  const { driverName, phone, carType, route, date, time, totalSeats, availableSeats, price, notes } = vehicle

  // Format date for display
  const dateObj = new Date(date)
  const formattedDate = dateObj.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })

  // Check seat status
  const isFull = availableSeats === 0
  const seatStatus = isFull ? 'FULL' : `${availableSeats} seats`

  // Open phone dialer
  const callDriver = () => {
    window.location.href = `tel:${phone}`
  }

  // Handle seat request submission
  const handleRequestSeats = async () => {
    if (!onRequestSeats) {
      alert('Request feature not available')
      return
    }

    setRequesting(true)
    try {
      await onRequestSeats({
        vehicleId: vehicle._id,
        requestedSeats: requestSeats,
      })
      setShowRequestForm(false)
      setRequestSeats(1)
    } catch (error) {
      console.error('Request failed:', error)
    } finally {
      setRequesting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{carType}</h3>
            {/* FULL badge - shown prominently when no seats available */}
            {isFull && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                🔴 FULL
              </span>
            )}
            {!isFull && availableSeats <= 2 && (
              <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                ⚠️ Limited
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
            <div>
              <span className="text-xs text-gray-500">Route</span>
              <div className="font-medium text-gray-700">{route === 'DelhiToUK' ? '🚗 Delhi → UK' : '🚗 UK → Delhi'}</div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Date & Time</span>
              <div className="font-medium text-gray-700">{formattedDate} • {time}</div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Driver</span>
              <div className="font-medium text-gray-700">{driverName}</div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Available Seats</span>
              <div className={`font-medium ${isFull ? 'text-red-600' : 'text-green-600'}`}>
                {seatStatus} / {totalSeats}
              </div>
            </div>
          </div>

          <div className="mt-3">
            <span className="text-xs text-gray-500">Route & Time</span>
            <div className="font-medium text-gray-700">{route === 'DelhiToUK' ? '🚗 Delhi → UK' : '🚗 UK → Delhi'} • {time}</div>
          </div>

          {notes && (
            <p className="text-sm text-gray-500 mt-2 italic">💬 {notes}</p>
          )}
        </div>

        {/* Action buttons section */}
        <div className="flex flex-col gap-2 sm:ml-4">
          {/* Show request form if clicked */}
          {showRequestForm ? (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Request Seats
              </label>
              <select
                value={requestSeats}
                onChange={(e) => setRequestSeats(parseInt(e.target.value))}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-2"
                disabled={requesting}
              >
                {[...Array(availableSeats)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} seat{i + 1 > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleRequestSeats}
                  disabled={requesting}
                  className="flex-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded font-medium text-sm transition"
                >
                  {requesting ? 'Requesting...' : 'Request'}
                </button>
                <button
                  onClick={() => setShowRequestForm(false)}
                  disabled={requesting}
                  className="flex-1 px-3 py-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-400 text-gray-700 rounded font-medium text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Request button - disabled if FULL */}
              <button
                onClick={() => setShowRequestForm(true)}
                disabled={isFull}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  isFull
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                📋 Request Seats
              </button>

              {/* Call button */}
              <button
                onClick={callDriver}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition whitespace-nowrap"
              >
                ☎️ Call Driver
              </button>

              <a
                href={`tel:${phone}`}
                className="text-xs text-green-600 hover:underline text-center"
              >
                {phone}
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
