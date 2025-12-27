/**
 * StarRating Component: Displays interactive 5-star rating selector
 * Props:
 *   - rating: Current rating (1-5)
 *   - onRate: Callback when user selects a rating
 *   - readOnly: If true, just displays the rating (no interaction)
 *   - size: 'small', 'medium', or 'large'
 */
import React, { useState } from 'react'

export default function StarRating({ rating = 0, onRate, readOnly = false, size = 'medium' }) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  }

  const containerClasses = {
    small: 'gap-1',
    medium: 'gap-2',
    large: 'gap-2',
  }

  const handleStarClick = (value) => {
    if (!readOnly && onRate) {
      onRate(value)
    }
  }

  const handleStarHover = (value) => {
    if (!readOnly) {
      setHoverRating(value)
    }
  }

  const displayRating = hoverRating || rating

  return (
    <div className={`flex ${containerClasses[size]} items-center`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          onMouseLeave={() => setHoverRating(0)}
          className={`${sizeClasses[size]} ${
            readOnly ? 'cursor-default' : 'cursor-pointer'
          } transition-transform hover:scale-110`}
          disabled={readOnly}
        >
          {star <= displayRating ? (
            <svg
              className="w-full h-full text-yellow-400 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ) : (
            <svg
              className="w-full h-full text-gray-300 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          )}
        </button>
      ))}
      {rating > 0 && (
        <span className="ml-2 text-sm font-semibold text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
