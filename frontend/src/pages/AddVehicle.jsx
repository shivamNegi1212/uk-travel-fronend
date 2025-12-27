import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'

// Ultarakhand/North India cities
const UK_CITIES = ['Dehradun', 'Mussoorie', 'Nainital', 'Rishikesh', 'Rudraprayag', 'Srinagar', 'Almora', 'Auli', 'Chopta', 'Lansdowne', 'Ranikhet', 'Garhwal', 'Haldwani']

// Delhi NCR and surrounding areas
const DELHI_CITIES = ['Delhi', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad', 'Greater Noida', 'Indirapuram']

export default function AddVehicle() {
  const navigate = useNavigate()
  const { driver, user, role } = useAuth()
  const [loading, setLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // Debug: Check token on page load
  React.useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    const storedDriver = localStorage.getItem('driver')
    console.log('🔑 Auth Debug:', {
      hasToken: !!token,
      role,
      contextUser: user,
      contextDriver: driver,
      storedUser: storedUser ? 'exists' : 'missing',
      storedDriver: storedDriver ? 'exists' : 'missing',
    })
  }, [])
  const [form, setForm] = useState({
    carType: '',
    pickupLocation: '',
    dropLocation: '',
    date: '',
    time: '08:00',
    totalSeats: 4,
    availableSeats: 4,
    notes: '',
    driverName: user?.name || driver?.name || '',
    phone: user?.phone || driver?.phone || '',
  })

  const submit = async (e) => {
    e.preventDefault()

    // Comprehensive frontend validation
    const errors = []

    if (!form.carType || form.carType.trim() === '') {
      errors.push('Car type is required')
    }

    if (!form.pickupLocation || form.pickupLocation.trim() === '') {
      errors.push('Pickup location is required')
    }

    if (!form.dropLocation || form.dropLocation.trim() === '') {
      errors.push('Destination location is required')
    }

    if (!form.date || form.date.trim() === '') {
      errors.push('Date is required')
    }

    if (!form.time || form.time.trim() === '') {
      errors.push('Time is required')
    }

    if (!form.totalSeats || form.totalSeats < 1 || form.totalSeats > 8) {
      errors.push('Total seats must be 1-8')
    }

    if (form.availableSeats === undefined || form.availableSeats === null || form.availableSeats < 0 || form.availableSeats > form.totalSeats) {
      errors.push('Available seats must be 0-' + form.totalSeats)
    }

    if (errors.length > 0) {
      setToastMessage({ msg: '❌ ' + errors.join(' | '), type: 'error' })
      return
    }

    // Verify user is a driver
    if (role !== 'driver') {
      setToastMessage({ msg: 'Only drivers can add vehicles', type: 'error' })
      return
    }

    try {
      setLoading(true)

      const vehicleData = {
        carType: form.carType.trim(),
        pickupLocation: form.pickupLocation.trim(),
        dropLocation: form.dropLocation.trim(),
        date: form.date,
        time: form.time,
        totalSeats: Number(form.totalSeats),
        availableSeats: Number(form.availableSeats),
        notes: form.notes.trim(),
      }

      console.log('📤 Sending vehicle data:', vehicleData)
      const response = await api.post('/vehicles', vehicleData)

      if (response.data.success) {
        setToastMessage({ msg: 'Vehicle added successfully!', type: 'success' })
        setTimeout(() => navigate('/driver/my'), 1500)
      } else {
        setToastMessage({ msg: response.data.message || 'Failed to add vehicle', type: 'error' })
      }
    } catch (error) {
      console.error('❌ Add vehicle error:', error.response?.data || error.message)
      const message = error.response?.data?.message || error.message || 'Failed to add vehicle'
      setToastMessage({ msg: message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🚗 Add Your Ride</h1>
          <p className="text-gray-600">List your ride with flexible routes and discuss price directly with passengers</p>
        </div>

        {toastMessage && (
          <Toast
            message={toastMessage.msg}
            type={toastMessage.type}
            onClose={() => setToastMessage(null)}
          />
        )}

        {/* Form Card */}
        <form onSubmit={submit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Car Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Car Type *
            </label>
            <input
              value={form.carType}
              onChange={(e) => setForm({ ...form, carType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Toyota Innova Crysta, Mahindra Scorpio"
              required
            />
          </div>

          {/* Route - Dynamic Locations with Dropdowns */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Route Details *
            </label>
            <p className="text-xs text-gray-500 mb-3">Select pickup and destination cities</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">From (Pickup) *</label>
                <select
                  value={form.pickupLocation}
                  onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select pickup location</option>
                  <optgroup label="Delhi NCR">
                    {DELHI_CITIES.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Uttarakhand">
                    {UK_CITIES.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">To (Destination) *</label>
                <select
                  value={form.dropLocation}
                  onChange={(e) => setForm({ ...form, dropLocation: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select destination</option>
                  <optgroup label="Delhi NCR">
                    {DELHI_CITIES.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Uttarakhand">
                    {UK_CITIES.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
          </div>

          {/* Driver Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                value={form.driverName}
                onChange={(e) => setForm({ ...form, driverName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone (10 digits) *
              </label>
              <input
                value={form.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                  setForm({ ...form, phone: value })
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10-digit number"
                maxLength="10"
                required
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Seats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Total Seats *
              </label>
              <input
                type="number"
                value={form.totalSeats}
                onChange={(e) =>
                  setForm({
                    ...form,
                    totalSeats: Number(e.target.value),
                    availableSeats: Math.min(form.availableSeats, Number(e.target.value)),
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="8"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Available Seats *
              </label>
              <input
                type="number"
                value={form.availableSeats}
                onChange={(e) => setForm({ ...form, availableSeats: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max={form.totalSeats}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Notes (optional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., AC, WiFi, snacks available... (Discuss price with passengers)"
              rows="3"
              maxLength="200"
            />
          </div>

          {/* Info Alert */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Note:</strong> Price will be decided by you and the passenger during conversation. Share your contact number so passengers can call and discuss rates.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold rounded-lg transition duration-200"
          >
            {loading ? '⏳ Adding Vehicle...' : '✓ Add Vehicle'}
          </button>
        </form>
      </div>
    </div>
  )
}
