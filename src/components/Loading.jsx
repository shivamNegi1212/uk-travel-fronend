import React from 'react'

/**
 * Loading spinner component: Shows while data is being fetched
 */
export default function Loading() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  )
}
