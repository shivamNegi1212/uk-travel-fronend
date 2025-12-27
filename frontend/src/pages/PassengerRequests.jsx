import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Toast from '../components/Toast'
import Loading from '../components/Loading'

/*
  PassengerRequests: Shows ride requests submitted by logged-in passenger
  Displays status, vehicle details, can cancel pending requests
*/
export default function PassengerRequests() {
  const { isAuthenticated } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [processingId, setProcessingId] = useState(null)

  // Fetch passenger requests on mount
  useEffect(() => {
    if (!isAuthenticated) return
    fetchRequests()
  }, [isAuthenticated, filterStatus])

  // Get all requests for the passenger
  const fetchRequests = async () => {
    setLoading(true)
    try {
      const response = await api.get('/ride-requests/passenger/my-requests')
      let data = response.data.requests || []
      
      // Filter by status if needed
      if (filterStatus) {
        data = data.filter(r => r.status === filterStatus)
      }
      
      setRequests(data)
    } catch (error) {
      setToastMessage({
        msg: error.response?.data?.message || 'Failed to fetch your requests',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  // Cancel a pending request
  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) {
      return
    }

    setProcessingId(requestId)
    try {
      await api.put(`/ride-requests/${requestId}/cancel`)
      setToastMessage({
        msg: 'Request cancelled successfully',
        type: 'success',
      })
      fetchRequests()
    } catch (error) {
      setToastMessage({
        msg: error.response?.data?.message || 'Failed to cancel request',
        type: 'error',
      })
    } finally {
      setProcessingId(null)
    }
  }

  // Get status badge with color
  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳' },
      accepted: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: '❌' },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', icon: '🚫' },
    }
    const badge = badges[status] || badges.pending
    return badge
  }

  // Format date and time
  const formatDateTime = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) return <Loading />

  const allRequests = requests

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Ride Requests</h1>
          <p className="text-gray-600 mt-1">Track your booking requests and their status</p>
        </div>

        {/* Toast notification */}
        {toastMessage && (
          <Toast
            message={toastMessage.msg}
            type={toastMessage.type}
            onClose={() => setToastMessage(null)}
          />
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['', 'pending', 'accepted', 'rejected', 'cancelled'].map((status) => {
            const counts = {
              '': allRequests.length,
              pending: allRequests.filter(r => r.status === 'pending').length,
              accepted: allRequests.filter(r => r.status === 'accepted').length,
              rejected: allRequests.filter(r => r.status === 'rejected').length,
              cancelled: allRequests.filter(r => r.status === 'cancelled').length,
            }
            return (
              <button
                key={status || 'all'}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  (status === '' && filterStatus === '') || filterStatus === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {status === '' && `📊 All (${counts['']})`}
                {status === 'pending' && `⏳ Pending (${counts.pending})`}
                {status === 'accepted' && `✅ Accepted (${counts.accepted})`}
                {status === 'rejected' && `❌ Rejected (${counts.rejected})`}
                {status === 'cancelled' && `🚫 Cancelled (${counts.cancelled})`}
              </button>
            )
          })}
        </div>

        {/* Requests list */}
        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg">
              {filterStatus ? `No ${filterStatus} requests` : 'No ride requests yet'}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Search for rides and submit requests to book with drivers
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const badge = getStatusBadge(request.status)
              return (
                <div
                  key={request._id}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Request details */}
                    <div className="flex-1">
                      {/* Header with status */}
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.vehicleId?.carType || 'Vehicle'}
                        </h3>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded border ${badge.bg} ${badge.text}`}
                        >
                          {badge.icon} {request.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Ride details */}
                      {request.vehicleId && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-3">
                          <div>
                            <span className="text-gray-500 text-xs">Route</span>
                            <div className="font-medium text-gray-700">
                              {request.vehicleId.route === 'DelhiToUK'
                                ? '🚗 Delhi → UK'
                                : '🚗 UK → Delhi'}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">Date & Time</span>
                            <div className="font-medium text-gray-700">
                              {new Date(request.vehicleId.date).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                              })}{' '}
                              • {request.vehicleId.time}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">Driver Phone</span>
                            <a
                              href={`tel:${request.vehicleId.phone}`}
                              className="font-medium text-indigo-600 hover:underline"
                            >
                              {request.vehicleId.phone}
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Request details */}
                      <div className="p-3 bg-blue-50 rounded border border-blue-200">
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600 text-xs">Requested Seats</span>
                            <div className="font-semibold text-blue-700">
                              🪑 {request.requestedSeats}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600 text-xs">Requested on</span>
                            <div className="font-semibold text-blue-700">
                              {formatDateTime(request.createdAt)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600 text-xs">Price / Seat</span>
                            <div className="font-semibold text-blue-700">
                              ₹{request.vehicleId?.price || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status specific info */}
                      {request.status === 'accepted' && (
                        <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
                          <p className="text-sm text-green-700">
                            <span className="font-semibold">✓ Booking Confirmed!</span> The driver has accepted your
                            request. Contact them to complete the booking.
                          </p>
                        </div>
                      )}

                      {request.status === 'rejected' && (
                        <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                          <p className="text-sm text-red-700">
                            <span className="font-semibold">✗ Request Rejected</span>
                          </p>
                          {request.rejectionReason && (
                            <p className="text-sm text-red-600 mt-1">{request.rejectionReason}</p>
                          )}
                        </div>
                      )}

                      {request.status === 'pending' && (
                        <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                          <p className="text-sm text-yellow-700">
                            ⏳ Waiting for driver to respond to your request...
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCancelRequest(request._id)}
                          disabled={processingId === request._id}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
                        >
                          {processingId === request._id ? 'Cancelling...' : 'Cancel Request'}
                        </button>
                      </div>
                    )}

                    {request.status === 'accepted' && (
                      <div className="flex items-center justify-center px-4 py-2 bg-green-100 rounded-lg border border-green-300">
                        <span className="text-sm font-semibold text-green-700">✓ Confirmed</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
