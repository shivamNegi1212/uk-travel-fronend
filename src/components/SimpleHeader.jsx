import React from 'react'
import { Link } from 'react-router-dom'

/**
 * SimpleHeader: Minimal header for auth pages (login/register)
 * Used on pages that appear without the Navbar
 * Shows app logo and back-to-home link
 */
export default function SimpleHeader() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Link to="/" className="inline-flex items-center gap-2 hover:opacity-70 transition">
          <span className="text-3xl">🚗</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Jay Uttarakhand</h1>
            <p className="text-xs text-gray-500">Ride Sharing Made Easy</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
