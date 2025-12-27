import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Loading from '../components/Loading'
import Toast from '../components/Toast'

/*
  DriverDashboard: Dashboard for authenticated drivers
  Protected by ProtectedRoute component
  Displays driver info, ratings, reviews, and quick action links
*/
export default function DriverDashboard() {
  const { user, isInDriverMode } = useAuth()
  const [ratings, setRatings] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isInDriverMode || !user || !user._id) {
      return
    }
    fetchDriverRatings()
  }, [isInDriverMode, user])

  // Fetch driver ratings and reviews
  const fetchDriverRatings = async () => {
    // Safety check: user._id might be undefined
    if (!user || !user._id) {
      setLoading(false)
      return
    }
    
    setLoading(true)
    setError(null)
    try {
      const response = await api.get(`/ratings/driver/${user._id}`)
      const allRatings = response.data.ratings || []
      setRatings(allRatings)

      // Calculate average rating
      if (allRatings.length > 0) {
        const avg = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length
        setAverageRating(Math.round(avg * 10) / 10)
      } else {
        setAverageRating(0)
      }
    } catch (err) {
      console.error('Failed to fetch ratings:', err)
      // Don't show error toast if ratings don't exist yet
    } finally {
      setLoading(false)
    }
  }

  // Render star rating
  const renderStars = (rating) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-lg ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      )
    }
    return stars
  }

  // Get latest reviews (max 3)
  const latestReviews = ratings.slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-mobile">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Email: {user?.email} • Phone: {user?.phone}</p>
        </div>

        {error && <Toast message={error} type="error" onClose={() => setError(null)} />}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            to="/driver/add"
            className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-md transition"
          >
            <div className="text-3xl mb-2">🚗</div>
            <div className="text-lg font-semibold text-indigo-700">Add New Ride</div>
            <div className="text-sm text-indigo-600 mt-1">Create a new ride listing</div>
          </Link>

          <Link
            to="/driver/ride-requests"
            className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition"
          >
            <div className="text-3xl mb-2">📋</div>
            <div className="text-lg font-semibold text-blue-700">Ride Requests</div>
            <div className="text-sm text-blue-600 mt-1">Manage passenger bookings</div>
          </Link>

          <Link
            to="/vehicles"
            className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-200 hover:border-green-400 hover:shadow-md transition"
          >
            <div className="text-3xl mb-2">👁️</div>
            <div className="text-lg font-semibold text-green-700">Browse Rides</div>
            <div className="text-sm text-green-600 mt-1">See all available rides</div>
          </Link>
        </div>

        {/* Rating & Reviews Section */}
        {!loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rating Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Your Rating</h2>

                {ratings.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600 text-sm">No ratings yet</p>
                    <p className="text-gray-500 text-xs mt-2">
                      Ratings will appear here as passengers complete rides
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    {/* Average Rating Stars */}
                    <div className="flex justify-center gap-1 mb-3">
                      {renderStars(averageRating)}
                    </div>

                    {/* Average Score */}
                    <div className="mb-4">
                      <div className="text-4xl font-bold text-yellow-500">{averageRating}</div>
                      <div className="text-sm text-gray-600">out of 5.0</div>
                    </div>

                    {/* Review Count */}
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-700">{ratings.length}</div>
                      <div className="text-sm text-blue-600">
                        {ratings.length === 1 ? 'Review' : 'Reviews'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Latest Reviews Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Latest Reviews {ratings.length > 0 && <span className="text-sm font-normal text-gray-600">({ratings.length})</span>}
                </h2>

                {latestReviews.length === 0 ? (
                  <div className="text-center py-8">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    <p className="text-gray-600 text-sm">No reviews yet</p>
                    <p className="text-gray-500 text-xs mt-2">
                      Reviews from passengers will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {latestReviews.map((review) => (
                      <div key={review._id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                        {/* Passenger name and rating */}
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{review.passengerId?.name || 'Anonymous'}</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                          {/* Stars */}
                          <div className="flex gap-0.5">
                            {renderStars(review.rating)}
                          </div>
                        </div>

                        {/* Rating display */}
                        <div className="mb-2">
                          <span className="text-sm font-semibold text-yellow-600">{review.rating}/5 stars</span>
                        </div>

                        {/* Review text */}
                        {review.review && (
                          <p className="text-sm text-gray-700 italic bg-gray-50 p-3 rounded">
                            "{review.review}"
                          </p>
                        )}

                        {/* Sub-ratings if available */}
                        {(review.cleanlinessRating || review.behaviorRating || review.safetyRating) && (
                          <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-3 gap-2 text-xs">
                            {review.cleanlinessRating && (
                              <div>
                                <span className="text-gray-600">Cleanliness</span>
                                <div className="text-yellow-500 font-semibold">{review.cleanlinessRating}★</div>
                              </div>
                            )}
                            {review.behaviorRating && (
                              <div>
                                <span className="text-gray-600">Behavior</span>
                                <div className="text-yellow-500 font-semibold">{review.behaviorRating}★</div>
                              </div>
                            )}
                            {review.safetyRating && (
                              <div>
                                <span className="text-gray-600">Safety</span>
                                <div className="text-yellow-500 font-semibold">{review.safetyRating}★</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* View All Reviews Link */}
                    {ratings.length > 3 && (
                      <button className="w-full mt-4 px-4 py-2 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition">
                        View All {ratings.length} Reviews
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  )
}
