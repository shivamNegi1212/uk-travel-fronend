import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Loading from '../components/Loading'
import Toast from '../components/Toast'

/*
  MyVehicles: Shows vehicles created by current logged-in driver
  Calls GET /api/vehicles/driver/my-vehicles
  Allows editing and deletion (protected)
*/
export default function MyVehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  useEffect(() => {
    fetchMyVehicles()
  }, [])

  const fetchMyVehicles = async () => {
    try {
      setLoading(true)
      const response = await api.get('/vehicles/driver/my-vehicles')
      setVehicles(response.data.vehicles)
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load your vehicles'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return

    try {
      await api.delete(`/vehicles/${vehicleId}`)
      setToastMessage({ msg: 'Vehicle deleted successfully', type: 'success' })
      fetchMyVehicles()
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete vehicle'
      setToastMessage({ msg: message, type: 'error' })
    }
  }

  if (loading) return <Loading />

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <Toast message={error} type="error" onClose={() => setError(null)} />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Vehicles</h2>

      {vehicles.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600 mb-2">You haven't listed any vehicles yet</p>
          <Link to="/driver/add" className="text-indigo-600 hover:underline">Add your first vehicle →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {vehicles.map((v) => {
            const dateObj = new Date(v.date)
            const formattedDate = dateObj.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })

            return (
              <div key={v._id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-lg">{v.carType}</h3>
                    <p className="text-sm text-gray-600">
                      {v.route === 'DelhiToUK' ? '🚗 Delhi → UK' : '🚗 UK → Delhi'} • {formattedDate} • {v.time}
                    </p>
                    <p className="text-sm text-gray-600">
                      Seats: {v.seats}
                    </p>
                    {v.notes && <p className="text-xs text-gray-500 mt-1">💬 {v.notes}</p>}
                    <p className="text-xs text-blue-600 mt-1 font-medium">💬 Discuss price with passengers</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(v._id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {toastMessage && (
        <Toast
          message={toastMessage.msg}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  )
}
