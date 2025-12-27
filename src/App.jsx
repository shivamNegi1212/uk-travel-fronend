import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Home from './pages/Home'
import VehicleList from './pages/VehicleList'
import DriverLogin from './pages/DriverLogin'
import DriverRegister from './pages/DriverRegister'
import PassengerLogin from './pages/PassengerLogin'
import PassengerRegister from './pages/PassengerRegister'
import DriverDashboard from './pages/DriverDashboard'
import DriverRideRequests from './pages/DriverRideRequests'
import PassengerRequests from './pages/PassengerRequests'
import PassengerBookings from './pages/PassengerBookings'
import AddVehicle from './pages/AddVehicle'
import MyVehicles from './pages/MyVehicles'
import RoleSelection from './pages/RoleSelection'
import PassengerHome from './pages/PassengerHome'
import PassengerDashboard from './pages/PassengerDashboard'
import RoleBasedNavbar from './components/RoleBasedNavbar'
import ProtectedRoute from './components/ProtectedRoute'

/*
  App-level routing setup with beautiful split landing page
  
  PUBLIC ROUTES (No authentication):
  - /                           -> LandingPage (split Driver/Passenger chooser with login/register)
  - /browse                     -> Home (legacy browse page)
  - /vehicles                   -> VehicleList (all available rides)
  - /driver/login               -> DriverLogin (driver authentication)
  - /driver/register            -> DriverRegister (driver registration)
  
  DRIVER ROUTES (protected):
  - /driver/dashboard           -> DriverDashboard (ratings, reviews, quick actions)
  - /driver/ride-requests       -> DriverRideRequests (manage bookings)
  - /driver/add                 -> AddVehicle (create new ride)
  - /driver/my                  -> MyVehicles (manage driver's rides)
  
  PASSENGER ROUTES (protected):
  - /passenger/home             -> PassengerHome (browse & book rides)
  - /passenger/dashboard        -> PassengerDashboard (alias for home)
  - /passenger/bookings         -> PassengerBookings (manage bookings & rate)
  - /passenger/requests         -> PassengerRequests (legacy bookings page)
  
  LEGACY ROUTES:
  - /select-role                -> RoleSelection (for authenticated users)
  - *                           -> Navigate to / (fallback)
*/
  
 
export default function App() {
  const location = useLocation()
  
  // Hide Navbar on landing page and auth pages
  const authPages = [
    '/',
    '/driver/login',
    '/driver/register',
    '/passenger/login',
    '/passenger/register',
  ]
  const showNavbar = !authPages.includes(location.pathname)

  return (
    <div className="min-h-screen">
      {showNavbar && <RoleBasedNavbar />}
      <main className={showNavbar ? 'container-mobile py-6' : ''}>
        <Routes>
          {/* 
            LANDING PAGE - Beautiful split layout
            Shows two side-by-side sections: Driver and Passenger
            Each with their own Login and Register buttons
            No Navbar shown on this page (handled by LandingPage)
          */}
          <Route path="/" element={<LandingPage />} />

          {/* 
            LEGACY HOME PAGE
            Browse available rides without authentication
          */}
          <Route path="/browse" element={<Home />} />

          {/* 
            PUBLIC ROUTES - No authentication required
          */}
          <Route path="/vehicles" element={<VehicleList />} />
          <Route path="/driver/login" element={<DriverLogin />} />
          <Route path="/driver/register" element={<DriverRegister />} />
          <Route path="/passenger/login" element={<PassengerLogin />} />
          <Route path="/passenger/register" element={<PassengerRegister />} />

          {/* 
            LEGACY ROLE SELECTION ROUTE
            Kept for backward compatibility - now redirects to /
          */}
          <Route
            path="/select-role"
            element={<ProtectedRoute redirectTo="/driver/login"><RoleSelection /></ProtectedRoute>}
          />

          {/* 
            DRIVER ROUTES (Protected)
            Only accessible to authenticated drivers
          */}
          <Route
            path="/driver/dashboard"
            element={<ProtectedRoute redirectTo="/driver/login"><DriverDashboard /></ProtectedRoute>}
          />
          <Route
            path="/driver/ride-requests"
            element={<ProtectedRoute redirectTo="/driver/login"><DriverRideRequests /></ProtectedRoute>}
          />
          <Route
            path="/driver/add"
            element={<ProtectedRoute redirectTo="/driver/login"><AddVehicle /></ProtectedRoute>}
          />
          <Route
            path="/driver/my"
            element={<ProtectedRoute redirectTo="/driver/login"><MyVehicles /></ProtectedRoute>}
          />

          {/* 
            PASSENGER ROUTES (Protected)
            Only accessible to authenticated passengers
          */}
          <Route
            path="/passenger/home"
            element={<ProtectedRoute redirectTo="/driver/login"><PassengerHome /></ProtectedRoute>}
          />
          <Route
            path="/passenger/dashboard"
            element={<ProtectedRoute redirectTo="/driver/login"><PassengerDashboard /></ProtectedRoute>}
          />
          <Route
            path="/passenger/bookings"
            element={<ProtectedRoute redirectTo="/driver/login"><PassengerBookings /></ProtectedRoute>}
          />
          <Route
            path="/passenger/requests"
            element={<ProtectedRoute redirectTo="/driver/login"><PassengerRequests /></ProtectedRoute>}
          />

          {/* 
            FALLBACK ROUTE
            Any unknown routes redirect to home (/)
            This ensures users never see a 404 page
          */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}
