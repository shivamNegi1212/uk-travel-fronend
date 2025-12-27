import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Toast from '../components/Toast'
import Loading from '../components/Loading'

/*
  DriverRideRequests: Shows all ride requests for logged-in driver
  Driver can accept/reject pending requests, view status of all requests
*/
export default function DriverRideRequests() {
  const { isAuthenticated } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState(null)
  const [filterStatus, setFilterStatus] = useState('pending')
  const [processingId, setProcessingId] = useState(null)

  // Fetch ride requests on mount
  useEffect(() => {
    if (!isAuthenticated) return
    fetchRequests()
  }, [isAuthenticated, filterStatus])

  // Get all requests for the driver
  const fetchRequests = async () => {
    setLoading(true)
    try {
      const params = filterStatus ? { status: filterStatus } : {}
      const response = await api.get('/ride-requests/driver/pending', { params })
      setRequests(response.data.requests || [])
    } catch (error) {
      setToastMessage({
        msg: error.response?.data?.message || 'Failed to fetch requests',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  // Accept a ride request
  const handleAcceptRequest = async (requestId) => {
    setProcessingId(requestId)
    try {
      const response = await api.put(`/ride-requests/${requestId}/accept`)
      setToastMessage({
        msg: 'Ride request accepted successfully! ✓',
        type: 'success',
      })
      // Refresh requests
      fetchRequests()
    } catch (error) {
      setToastMessage({
        msg: error.response?.data?.message || 'Failed to accept request',
        type: 'error',
      })
    } finally {
      setProcessingId(null)
    }
  }

  // Reject a ride request
  const handleRejectRequest = async (requestId) => {
    const reason = prompt('Enter rejection reason (optional):')
    if (reason === null) return // User cancelled

    setProcessingId(requestId)
    try {
      await api.put(`/ride-requests/${requestId}/reject`, {
        rejectionReason: reason || undefined,
      })
      setToastMessage({
        msg: 'Ride request rejected',
        type: 'success',
      })
      fetchRequests()
    } catch (error) {
      setToastMessage({
        msg: error.response?.data?.message || 'Failed to reject request',
        type: 'error',
      })
    } finally {
      setProcessingId(null)
    }
  }

  // Get status badge color
  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      accepted: 'bg-green-100 text-green-800 border border-green-300',
      rejected: 'bg-red-100 text-red-800 border border-red-300',
      cancelled: 'bg-gray-100 text-gray-800 border border-gray-300',
    }
    return badges[status] || badges.pending
  }

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) return <Loading />

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Ride Requests</h1>
          <p className="text-gray-600 mt-1">Manage passenger booking requests</p>
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
          {['pending', 'accepted', 'rejected', 'all'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status === 'all' ? '' : status)}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                (status === 'all' ? filterStatus === '' : filterStatus === status)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status === 'pending' && `⏳ Pending (${requests.filter(r => r.status === 'pending').length})`}
              {status === 'accepted' && `✅ Accepted (${requests.filter(r => r.status === 'accepted').length})`}
              {status === 'rejected' && `❌ Rejected (${requests.filter(r => r.status === 'rejected').length})`}
              {status === 'all' && `📊 All (${requests.length})`}
            </button>
          ))}
        </div>

        {/* Requests list */}
        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg">
              {filterStatus ? `No ${filterStatus} requests yet` : 'No ride requests yet'}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Share your vehicle listings to receive booking requests from passengers
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Request details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.passengerName}
                      </h3>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${getStatusBadge(
                          request.status
                        )}`}
                      >
                        {request.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-3">
                      <div>
                        <span className="text-gray-500 text-xs">Phone</span>
                        <a
                          href={`tel:${request.passengerPhone}`}
                          className="font-medium text-indigo-600 hover:underline block"
                        >
                          {request.passengerPhone}
                        </a>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Requested Seats</span>
                        <div className="font-medium text-gray-700">
                          🪑 {request.requestedSeats} seat{request.requestedSeats > 1 ? 's' : ''}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Vehicle</span>
                        <div className="font-medium text-gray-700">
                          {request.vehicleId?.carType || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Requested on</span>
                        <div className="font-medium text-gray-700">{formatDate(request.createdAt)}</div>
                      </div>
                    </div>

                    {/* Vehicle details */}
                    {request.vehicleId && (
                      <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Ride:</span>{' '}
                          {request.vehicleId.route === 'DelhiToUK' ? '🚗 Delhi → UK' : '🚗 UK → Delhi'} •{' '}
                          {new Date(request.vehicleId.date).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          • {request.vehicleId.time}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Availability:</span> {request.vehicleId.availableSeats}/
                          {request.vehicleId.totalSeats} seats available
                        </p>
                      </div>
                    )}

                    {/* Rejection reason */}
                    {request.rejectionReason && (
                      <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                        <p className="text-sm text-red-700">
                          <span className="font-medium">Reason:</span> {request.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  {request.status === 'pending' && (
                    <div className="flex gap-2 md:flex-col">
                      <button
                        onClick={() => handleAcceptRequest(request._id)}
                        disabled={processingId === request._id}
                        className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
                      >
                        {processingId === request._id ? '...' : '✅ Accept'}
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request._id)}
                        disabled={processingId === request._id}
                        className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
                      >
                        {processingId === request._id ? '...' : '❌ Reject'}
                      </button>
                    </div>
                  )}

                  {request.status === 'accepted' && (
                    <div className="flex items-center justify-center px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-sm font-medium text-green-700">✓ Booking Confirmed</span>
                    </div>
                  )}

                  {request.status === 'rejected' && (
                    <div className="flex items-center justify-center px-4 py-2 bg-red-50 rounded-lg border border-red-200">
                      <span className="text-sm font-medium text-red-700">✗ Request Rejected</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
