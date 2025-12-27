/**
 * PassengerBookings: Manage passenger ride bookings with rating functionality
 * Features:
 * - View all passenger bookings (pending/accepted/completed/cancelled)
 * - Rate completed rides (1-5 stars + optional review)
 * - Cancel pending bookings
 * - Track booking status
 */
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Toast from '../components/Toast'
import Loading from '../components/Loading'
import StarRating from '../components/StarRating'

export default function PassengerBookings() {
  const { user, isInPassengerMode } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [processingId, setProcessingId] = useState(null)

  // Rating modal state
  const [ratingModal, setRatingModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [submittingRating, setSubmittingRating] = useState(false)

  useEffect(() => {
    if (!isInPassengerMode) {
      return
    }
    fetchBookings()
  }, [isInPassengerMode])

  // Fetch all passenger bookings
  const fetchBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch bookings from the new Ride model endpoint
      const response = await api.get('/ride-requests/passenger/my-bookings')
      let data = response.data.bookings || response.data || []
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        data = []
      }

      // Filter by status if needed
      if (filterStatus) {
        data = data.filter((b) => b.status === filterStatus)
      }

      setBookings(data)
      if (data.length === 0 && !filterStatus) {
        setError(null) // No error, just no bookings yet
      }
    } catch (err) {
      console.error('Fetch bookings error:', err)
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load bookings'
      // Don't show error if user is not logged in - just show empty state
      if (err.response?.status !== 401) {
        setError(errorMsg)
      }
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  // Refetch when filter changes
  useEffect(() => {
    if (bookings.length > 0) {
      fetchBookings()
    }
  }, [filterStatus])

  // Cancel pending booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    setProcessingId(bookingId)
    setError(null)
    try {
      await api.put(`/ride-requests/${bookingId}/cancel`)
      setError(null)
      await fetchBookings()
    } catch (err) {
      console.error('Cancel booking error:', err)
      const errorMsg = err.response?.data?.message || err.message || 'Failed to cancel booking'
      setError(errorMsg)
    } finally {
      setProcessingId(null)
    }
  }

  // Open rating modal for completed ride
  const openRatingModal = (booking) => {
    setSelectedBooking(booking)
    setRating(0)
    setReview('')
    setRatingModal(true)
  }

  // Submit rating to backend
  const handleSubmitRating = async () => {
    if (!selectedBooking || rating === 0) {
      setError('Please select a rating')
      return
    }

    setSubmittingRating(true)
    setError(null)

    try {
      // Create rating payload
      const ratingPayload = {
        driverId: selectedBooking.driverId?._id || selectedBooking.driverId,
        passengerId: user._id,
        rideId: selectedBooking.rideId?._id || selectedBooking.rideId,
        rating,
        review: review.trim() || undefined,
      }

      const response = await api.post('/ratings', ratingPayload)

      if (response.data.success) {
        // Close modal and refresh bookings
        setRatingModal(false)
        setSelectedBooking(null)
        setRating(0)
        setReview('')
        await fetchBookings()
      }
    } catch (err) {
      console.error('Submit rating error:', err)
      const errorMsg = err.response?.data?.message || err.message || 'Failed to submit rating'
      setError(errorMsg)
    } finally {
      setSubmittingRating(false)
    }
  }

  // Get status badge with color
  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳' },
      accepted: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '✅' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', icon: '🎉' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: '❌' },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', icon: '🚫' },
    }
    return badges[status] || badges.pending
  }

  // Format date and time
  const formatDateTime = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) return <Loading />

  const allBookings = bookings
  const statusCounts = {
    '': allBookings.length,
    pending: allBookings.filter((b) => b.status === 'pending').length,
    accepted: allBookings.filter((b) => b.status === 'accepted').length,
    completed: allBookings.filter((b) => b.status === 'completed').length,
    cancelled: allBookings.filter((b) => b.status === 'cancelled').length,
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-mobile">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">Track your ride bookings and rate completed rides</p>
        </div>

        {error && <Toast message={error} type="error" onClose={() => setError(null)} />}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['', 'pending', 'accepted', 'completed', 'cancelled'].map((status) => (
            <button
              key={status || 'all'}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                (status === '' && filterStatus === '') || filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status === '' && `📊 All (${statusCounts['']})`}
              {status === 'pending' && `⏳ Pending (${statusCounts.pending})`}
              {status === 'accepted' && `✅ Accepted (${statusCounts.accepted})`}
              {status === 'completed' && `🎉 Completed (${statusCounts.completed})`}
              {status === 'cancelled' && `🚫 Cancelled (${statusCounts.cancelled})`}
            </button>
          ))}
        </div>

        {/* Bookings list */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
            <p className="text-gray-600 text-lg">
              {filterStatus ? `No ${filterStatus} bookings` : 'No bookings yet'}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Browse available rides and book your seat to get started
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const badge = getStatusBadge(booking.status)
              const isCompleted = booking.status === 'completed'
              const hasRating = booking.rating

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                >
                  <div className="p-6">
                    {/* Header with status */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {booking.rideId?.vehicleType || 'Ride'}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {booking.rideId?.vehicleNumber}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full w-fit ${badge.bg} ${badge.text}`}>
                        {badge.icon} {booking.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Ride details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                      {/* Route */}
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Route</p>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">
                            {booking.rideId?.pickupLocation}
                          </span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          <span className="font-semibold text-gray-800">
                            {booking.rideId?.dropLocation}
                          </span>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Date & Time</p>
                        <p className="font-semibold text-gray-800">
                          {formatDateTime(booking.rideId?.rideDate)} at {booking.rideId?.rideTime}
                        </p>
                      </div>

                      {/* Seats & Price */}
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Booking Details</p>
                        <p className="font-semibold text-gray-800">
                          {booking.requestedSeats} seat(s) • ₹{booking.totalPrice || 'N/A'}
                        </p>
                      </div>

                      {/* Driver Info */}
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Driver</p>
                        <p className="font-semibold text-gray-800">
                          {booking.driverId?.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          📞 {booking.driverId?.phone}
                        </p>
                      </div>
                    </div>

                    {/* Rating Section - Only for completed rides */}
                    {isCompleted && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        {hasRating ? (
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm font-semibold text-blue-900 mb-2">✓ You rated this ride</p>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={i < booking.rating ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}>
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-sm font-semibold text-blue-800">{booking.rating}/5</span>
                            </div>
                            {booking.review && (
                              <p className="text-sm text-blue-800 italic">"{booking.review}"</p>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-gray-900 mb-1">How was your ride?</p>
                              <p className="text-sm text-gray-600">Share your experience to help other passengers</p>
                            </div>
                            <button
                              onClick={() => openRatingModal(booking)}
                              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
                            >
                              ⭐ Rate Ride
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={processingId === booking._id}
                          className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
                        >
                          {processingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                      )}

                      {booking.status === 'accepted' && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm font-semibold text-green-800">
                            ✓ Booking Confirmed! Contact the driver to complete arrangement.
                          </p>
                        </div>
                      )}

                      {booking.status === 'completed' && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm font-semibold text-green-800">
                            🎉 Ride Completed! We hope you enjoyed the journey.
                          </p>
                        </div>
                      )}

                      {booking.status === 'rejected' && (
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-sm font-semibold text-red-800">
                            ✗ Booking Rejected by Driver
                          </p>
                        </div>
                      )}

                      {booking.status === 'cancelled' && (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm font-semibold text-gray-800">
                            🚫 Booking Cancelled
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {ratingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Rate Your Ride</h2>
            <p className="text-gray-600 text-sm mb-6">
              {selectedBooking.driverId?.name} • {selectedBooking.rideId?.vehicleNumber}
            </p>

            {/* Star rating */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Rating</p>
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition transform hover:scale-125"
                  >
                    <span
                      className={`text-4xl ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Review textarea */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Review (Optional)</p>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience... (e.g., Driver was polite, comfortable ride, etc.)"
                maxLength={500}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{review.length}/500</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setRatingModal(false)}
                disabled={submittingRating}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition disabled:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={submittingRating || rating === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {submittingRating ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
