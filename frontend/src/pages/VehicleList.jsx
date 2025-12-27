import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../services/api'
import VehicleCard from '../components/VehicleCard'
import Loading from '../components/Loading'
import Toast from '../components/Toast'

/*
  VehicleList: Displays vehicles filtered by route and date
  Calls GET /api/vehicles with optional query params
  Supports query: ?route=DelhiToUK&date=2025-12-24
  Passengers can submit ride requests from this page
*/
export default function VehicleList() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)
  const { search } = useLocation()

  // Fetch vehicles on mount and when query params change
  useEffect(() => {
    fetchVehicles()
  }, [search])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      setError(null)

      // Call backend with query params (if present)
      const response = await api.get(`/vehicles${search}`)
      
      // Filter out past vehicles (today or future only)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const futureVehicles = (response.data.vehicles || []).filter(vehicle => {
        const vehicleDate = new Date(vehicle.date)
        vehicleDate.setHours(0, 0, 0, 0)
        return vehicleDate >= today
      })
      
      setVehicles(futureVehicles)
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load vehicles'
      setError(message)
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }

  // Handle ride request submission
  const handleRequestSeats = async ({ vehicleId, requestedSeats }) => {
    // Get passenger details via prompt
    const passengerName = prompt('Enter your full name:')
    if (!passengerName) return

    const passengerPhone = prompt('Enter your phone number (10 digits):')
    if (!passengerPhone) return

    if (!/^[0-9]{10}$/.test(passengerPhone)) {
      setToastMessage({ msg: 'Invalid phone number. Please enter 10 digits.', type: 'error' })
      return
    }

    try {
      await api.post('/ride-requests', {
        vehicleId,
        requestedSeats,
        passengerName,
        passengerPhone,
      })

      setToastMessage({
        msg: `✓ Request submitted! Driver will contact you at ${passengerPhone}`,
        type: 'success',
      })

      // Refresh vehicles to show updated seat counts
      fetchVehicles()
    } catch (error) {
      setToastMessage({
        msg: error.response?.data?.message || 'Failed to submit request',
        type: 'error',
      })
    }
  }

  const params = new URLSearchParams(search)
  const dateFilter = params.get('date')
  const routeFilter = params.get('route')

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-2">Available Vehicles</h2>
      <p className="text-sm text-gray-600 mb-4">
        {routeFilter ? `Route: ${routeFilter}` : 'All routes'} 
        {dateFilter ? ` • Date: ${dateFilter}` : ''}
      </p>

      {loading && <Loading />}

      {error && !loading && (
        <Toast message={error} type="error" onClose={() => setError(null)} />
      )}

      {toastMessage && (
        <Toast
          message={toastMessage.msg}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

      {!loading && vehicles.length === 0 && (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600">No vehicles found for your search criteria</p>
          <p className="text-xs text-gray-500 mt-2">Try adjusting your filters</p>
        </div>
      )}

      <div className="flex flex-col gap-3 mt-4">
        {vehicles.map((v) => (
          <VehicleCard key={v._id} vehicle={v} onRequestSeats={handleRequestSeats} />
        ))}
      </div>
    </div>
  )
}
