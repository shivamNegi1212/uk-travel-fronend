import React, { useState, useEffect } from 'react'

/**
 * Toast notification component: Shows temporary alerts at top-center
 * Auto-dismisses after 4 seconds or when close button clicked
 * Clean, simple design with proper positioning to prevent overlapping
 */
export default function Toast({ message, type = 'error', onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onClose?.()
    }, 4000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!visible) return null

  const config = {
    error: {
      bg: 'bg-red-500',
      icon: '⚠',
      textColor: 'text-white',
    },
    success: {
      bg: 'bg-green-500',
      icon: '✓',
      textColor: 'text-white',
    },
    info: {
      bg: 'bg-blue-500',
      icon: 'ⓘ',
      textColor: 'text-white',
    },
    warning: {
      bg: 'bg-amber-500',
      icon: '⚠',
      textColor: 'text-white',
    },
  }[type] || { bg: 'bg-red-500', icon: '⚠', textColor: 'text-white' }

  return (
    <div className={`${config.bg} ${config.textColor} px-5 py-4 rounded-lg shadow-lg fixed top-6 left-1/2 transform -translate-x-1/2 max-w-sm z-[9999] animate-fade-in flex items-center justify-between gap-4`}>
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold flex-shrink-0">{config.icon}</span>
        <span className="font-medium text-sm md:text-base">{message}</span>
      </div>
      <button 
        onClick={() => { setVisible(false); onClose?.() }} 
        className="flex-shrink-0 hover:opacity-70 transition text-lg leading-none"
      >
        ✕
      </button>
    </div>
  )
}
