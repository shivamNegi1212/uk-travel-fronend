import React, { createContext, useContext, useState } from 'react'
import { dummyVehicles } from '../data/dummyVehicles'

// VehicleContext provides vehicles and simple CRUD-like helpers for demo usage
const VehicleContext = createContext(null)

export const useVehicles = () => useContext(VehicleContext)

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState(dummyVehicles)

  // Add vehicle (mock)
  const addVehicle = (vehicle) => {
    setVehicles((prev) => [{ id: Date.now().toString(), ...vehicle }, ...prev])
  }

  // Remove vehicle (mock) by id
  const removeVehicle = (id) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id))
  }

  return (
    <VehicleContext.Provider value={{ vehicles, addVehicle, removeVehicle }}>
      {children}
    </VehicleContext.Provider>
  )
}
