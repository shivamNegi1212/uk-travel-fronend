import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/*
  ProtectedRoute: Wrapper that checks if driver is authenticated via JWT token
  If authenticated, renders children. Otherwise redirects to login.
*/
export default function ProtectedRoute({ children, redirectTo = '/driver/login' }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />
  }

  return children
}
