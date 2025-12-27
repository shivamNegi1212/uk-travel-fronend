/**
 * PassengerHome Page: Lists available rides from drivers
 * Features:
 * - Filter rides by pickup/drop locations, date
 * - View driver ratings and reviews
 * - Send booking request for a ride
 * - Track booking status
 */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Toast from '../components/Toast'
import Loading from '../components/Loading'
import StarRating from '../components/StarRating'

// Sample rides data for demo
const SAMPLE_RIDES = [
  {
    _id: '1',
    vehicleType: 'SUV',
    vehicleNumber: 'DL-01-AB-1234',
    driverName: 'Rajesh Kumar',
    driverRating: 4.8,
    totalRatings: 145,
    pickupLocation: 'Delhi Airport',
    dropLocation: 'Agra City Center',
    rideDate: new Date().toISOString(),
    rideTime: '06:00 AM',
    availableSeats: 3,
    pricePerSeat: 450,
    totalSeats: 4,
    description: 'Comfortable SUV with AC and good road condition'
  },
  {
    _id: '2',
    vehicleType: 'Sedan',
    vehicleNumber: 'UP-02-CD-5678',
    driverName: 'Priya Singh',
    driverRating: 4.9,
    totalRatings: 203,
    pickupLocation: 'Noida',
    dropLocation: 'Varanasi',
    rideDate: new Date().toISOString(),
    rideTime: '05:30 AM',
    availableSeats: 2,
    pricePerSeat: 500,
    totalSeats: 4,
    description: 'Clean sedan with experienced driver'
  },
  {
    _id: '3',
    vehicleType: 'Innova',
    vehicleNumber: 'UT-03-EF-9012',
    driverName: 'Arjun Patel',
    driverRating: 4.6,
    totalRatings: 98,
    pickupLocation: 'Gurgaon',
    dropLocation: 'Rishikesh',
    rideDate: new Date().toISOString(),
    rideTime: '07:00 AM',
    availableSeats: 4,
    pricePerSeat: 350,
    totalSeats: 5,
    description: 'Spacious Innova with comfortable seating'
  },
  {
    _id: '4',
    vehicleType: 'Hatchback',
    vehicleNumber: 'HR-04-GH-3456',
    driverName: 'Vikram Das',
    driverRating: 4.7,
    totalRatings: 167,
    pickupLocation: 'Delhi',
    dropLocation: 'Jaipur',
    rideDate: new Date().toISOString(),
    rideTime: '06:30 AM',
    availableSeats: 2,
    pricePerSeat: 400,
    totalSeats: 4,
    description: 'Quick hatchback for faster travel'
  },
  {
    _id: '5',
    vehicleType: 'SUV',
    vehicleNumber: 'MP-05-IJ-7890',
    driverName: 'Neha Gupta',
    driverRating: 4.9,
    totalRatings: 212,
    pickupLocation: 'Lucknow',
    dropLocation: 'Ayodhya',
    rideDate: new Date().toISOString(),
    rideTime: '05:00 AM',
    availableSeats: 3,
    pricePerSeat: 280,
    totalSeats: 4,
    description: 'Luxury SUV with premium interiors'
  },
]

export default function PassengerHome() {
  const navigate = useNavigate()
  const { user, isInPassengerMode } = useAuth()
  const [rides, setRides] = useState([])
  const [filteredRides, setFilteredRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRide, setSelectedRide] = useState(null)
  const [bookingSeats, setBookingSeats] = useState(1)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)

  // Filter states
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropLocation, setDropLocation] = useState('')
  const [travelDate, setTravelDate] = useState('')

  useEffect(() => {
    if (!isInPassengerMode) {
      navigate('/role-selection')
      return
    }
    fetchAvailableRides()
  }, [isInPassengerMode, navigate])

  // Fetch available rides from database
  const fetchAvailableRides = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch rides from both new Ride model and legacy Vehicle model
      let allRides = []
      
      try {
        // Try fetching from new Ride model
        const rideResponse = await api.get('/rides?status=scheduled')
        if (rideResponse.data.rides && rideResponse.data.rides.length > 0) {
          // Filter out past rides (only keep today and future rides)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          
          const futureRides = rideResponse.data.rides.filter(ride => {
            const rideDate = new Date(ride.rideDate)
            rideDate.setHours(0, 0, 0, 0)
            return rideDate >= today
          })
          
          allRides = [...allRides, ...futureRides]
        }
      } catch (err) {
        console.log('No rides from Ride model:', err.message)
      }
      
      try {
        // Also fetch from legacy Vehicle model to show available vehicles
        const vehicleResponse = await api.get('/vehicles')
        if (vehicleResponse.data.vehicles && vehicleResponse.data.vehicles.length > 0) {
          // Filter out past vehicles
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          
          const futureVehicles = vehicleResponse.data.vehicles.filter(vehicle => {
            const vehicleDate = new Date(vehicle.date)
            vehicleDate.setHours(0, 0, 0, 0)
            return vehicleDate >= today
          })
          
          allRides = [...allRides, ...futureVehicles]
        }
      } catch (err) {
        console.log('No vehicles from Vehicle model:', err.message)
      }
      
      if (allRides.length === 0) {
        setRides([])
        setFilteredRides([])
        setError('No rides available right now. Check back soon!')
      } else {
        setRides(allRides)
        setFilteredRides(allRides)
      }
    } catch (err) {
      console.error('Error fetching rides:', err)
      setRides([])
      setFilteredRides([])
      setError('Failed to load rides. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Apply filters
  const applyFilters = () => {
    let filtered = rides

    if (pickupLocation) {
      filtered = filtered.filter((ride) =>
        ride.pickupLocation.toLowerCase().includes(pickupLocation.toLowerCase())
      )
    }

    if (dropLocation) {
      filtered = filtered.filter((ride) =>
        ride.dropLocation.toLowerCase().includes(dropLocation.toLowerCase())
      )
    }

    if (travelDate) {
      const filterDate = new Date(travelDate).toDateString()
      filtered = filtered.filter((ride) => {
        const rideDate = ride.rideDate || ride.date
        return new Date(rideDate).toDateString() === filterDate
      })
    }

    setFilteredRides(filtered)
  }

  const handleBookingClick = (ride) => {
    // Check if ride is valid and has available seats
    if (!ride._id) {
      setError('Invalid ride')
      return
    }
    if (ride.availableSeats <= 0) {
      setError('Sorry, no seats available for this ride')
      return
    }
    setSelectedRide(ride)
    setBookingSeats(1)
    setShowBookingModal(true)
  }

  const handleConfirmBooking = async () => {
    if (!selectedRide) return

    setBookingLoading(true)
    setError(null)
    try {
      // Use logged-in user data if available, otherwise use ride details
      let passengerName = user?.name
      let passengerPhone = user?.phone

      // If not logged in, prompt for details
      if (!passengerName) {
        passengerName = prompt('Enter your full name:')
        if (!passengerName) {
          setBookingLoading(false)
          return
        }
      }

      if (!passengerPhone) {
        passengerPhone = prompt('Enter your phone number (10 digits):')
        if (!passengerPhone) {
          setBookingLoading(false)
          return
        }
      }

      if (!/^[0-9]{10}$/.test(passengerPhone)) {
        setError('Please enter a valid 10-digit phone number')
        setBookingLoading(false)
        return
      }

      // Build booking payload - support both new Ride model and legacy Vehicle model
      const bookingPayload = {
        requestedSeats: bookingSeats,
        passengerName: passengerName.trim(),
        passengerPhone: passengerPhone.trim(),
      }

      // Check if this is a Ride model or Vehicle model
      if (selectedRide.rideId) {
        // New Ride model
        bookingPayload.rideId = selectedRide._id
      } else if (selectedRide.driverId?._id) {
        // Ride model with populated driverId
        bookingPayload.rideId = selectedRide._id
      } else {
        // Legacy Vehicle model
        bookingPayload.vehicleId = selectedRide._id
      }

      const response = await api.post('/ride-requests', bookingPayload)

      if (response.data.success) {
        setShowBookingModal(false)
        setError(null)
        setSelectedRide(null)
        // Show success toast
        alert(`✓ Booking request sent!\n\nWaiting for driver approval.\n\nDriver: ${selectedRide.driverName || selectedRide.driverId?.name}\nSeats: ${bookingSeats}\nTotal Price: ₹${(selectedRide.pricePerSeat || 0) * bookingSeats}`)
        // Refresh rides
        await fetchAvailableRides()
      }
    } catch (err) {
      console.error('Booking error:', err)
      const errorMsg = err.response?.data?.message || err.message || 'Failed to book ride. Please try again.'
      setError(errorMsg)
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🚗 Find Your Ride</h1>
          <p className="text-gray-600 text-lg">Browse available rides and book your perfect journey</p>
        </div>

        {error && <Toast message={error} type="error" onClose={() => setError(null)} />}

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">From</label>
              <input
                type="text"
                placeholder="Pickup location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">To</label>
              <input
                type="text"
                placeholder="Drop location"
                value={dropLocation}
                onChange={(e) => setDropLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={applyFilters}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
              >
                Search
              </button>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setPickupLocation('')
                  setDropLocation('')
                  setTravelDate('')
                  setFilteredRides(rides)
                }}
                className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Rides Grid */}
        {filteredRides.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Rides Found</h3>
            <p className="text-gray-600 text-lg">Try adjusting your search filters to find more rides</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRides.map((ride) => {
              // Handle both Ride model (with driverId object) and Vehicle model (with createdBy)
              const driverName = ride.driverId?.name || ride.driverName || 'Unknown Driver'
              const driverPhone = ride.driverId?.phone || ride.driverPhone || 'N/A'
              const driverRating = ride.driverId?.averageRating || ride.driverRating || 0
              const totalRatings = ride.driverId?.totalRatings || ride.totalRatings || 0
              const vehicleType = ride.vehicleType || ride.carType || 'Unknown'
              const vehicleNumber = ride.vehicleNumber || ride.vehicleModel || 'N/A'
              const rideTime = ride.rideTime || ride.time || '00:00'
              const availableSeats = ride.availableSeats || 0
              const totalSeats = ride.totalSeats || 4
              const pricePerSeat = ride.pricePerSeat || ride.price || 0
              const pickupLocation = ride.pickupLocation || 'N/A'
              const dropLocation = ride.dropLocation || 'N/A'
              // Handle both rideDate (Ride model) and date (Vehicle model)
              const rideDate = ride.rideDate || ride.date || new Date().toISOString()
              
              return (
              <div
                key={ride._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Header - Vehicle Type */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-5 text-white">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-2xl font-bold capitalize">{vehicleType}</h3>
                      <p className="text-indigo-100 text-sm">📝 {vehicleNumber}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1 justify-end">
                        <span className="text-yellow-300">★</span>
                        <span className="font-bold text-lg">{driverRating || 'N/A'}</span>
                      </div>
                      <p className="text-xs text-indigo-100">({totalRatings} reviews)</p>
                    </div>
                  </div>
                  <p className="text-sm text-indigo-100 font-semibold">👤 {driverName}</p>
                  {driverPhone && driverPhone !== 'N/A' && (
                    <p className="text-xs text-indigo-200">📱 {driverPhone}</p>
                  )}
                </div>

                {/* Body */}
                <div className="p-5">
                  {/* Route */}
                  <div className="mb-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-2xl">📍</div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-semibold">FROM</p>
                        <p className="font-bold text-gray-800 text-sm">{pickupLocation}</p>
                      </div>
                    </div>
                    <div className="h-8 flex justify-center ml-4">
                      <div className="w-0.5 bg-indigo-300"></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">📍</div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-semibold">TO</p>
                        <p className="font-bold text-gray-800 text-sm">{dropLocation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">DATE</p>
                      <p className="text-lg font-bold text-indigo-600">📅 {new Date(rideDate).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">TIME</p>
                      <p className="text-lg font-bold text-orange-600">🕐 {rideTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">AVAILABLE SEATS</p>
                      <p className="text-lg font-bold text-green-600">🪑 {availableSeats}/{totalSeats}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">PRICE</p>
                      <p className="text-lg font-bold text-purple-600">💰 {pricePerSeat > 0 ? `₹${pricePerSeat}` : 'Discuss'}</p>
                    </div>
                  </div>

                  {/* Description */}
                  {ride.description && (
                    <p className="text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded text-center italic border border-blue-200">
                      💬 "{ride.description}"
                    </p>
                  )}

                  {/* Book Button */}
                  <button
                    onClick={() => handleBookingClick(ride)}
                    disabled={availableSeats === 0}
                    className={`w-full font-bold py-3 rounded-lg transition duration-200 transform ${
                      availableSeats > 0
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white hover:scale-105 active:scale-95'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {availableSeats > 0 ? '🎟️ Book Now' : '❌ No Seats'}
                  </button>
                </div>
              </div>
              )
            })}
          </div>
        )}
        {showBookingModal && selectedRide && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-6 text-white">
                <h2 className="text-2xl font-bold">Confirm Booking</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Vehicle</p>
                  <p className="text-xl font-bold text-gray-900">
                    {(selectedRide.vehicleType || selectedRide.carType)} - {(selectedRide.vehicleNumber || selectedRide.vehicleModel || 'N/A')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Driver</p>
                  <p className="text-lg font-bold text-gray-900">
                    {typeof selectedRide.driverId === 'object' 
                      ? (selectedRide.driverId?.name || 'Unknown') 
                      : (selectedRide.driverName || 'Unknown')}
                  </p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 font-semibold mb-2">Number of Seats</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setBookingSeats(Math.max(1, bookingSeats - 1))}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                      −
                    </button>
                    <span className="text-2xl font-bold text-indigo-600">{bookingSeats}</span>
                    <button
                      onClick={() =>
                        setBookingSeats(
                          Math.min(selectedRide.availableSeats, bookingSeats + 1)
                        )
                      }
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 font-semibold">💬 Price Discussion</p>
                  <p className="text-xs text-blue-700 mt-1">Contact driver to discuss price for {bookingSeats} seat(s)</p>
                </div>
              </div>
              <div className="p-6 flex gap-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={bookingLoading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-lg transition"
                >
                  {bookingLoading ? '⏳ Processing...' : '✓ Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
