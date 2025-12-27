#!/bin/bash

# 🚗 UK Travel App - Quick Startup Script
# This script starts both frontend and backend servers

echo "================================"
echo "🚗 UK Travel App - Quick Start"
echo "================================"
echo ""

# Check if MongoDB is running
echo "Checking MongoDB..."
if ! pgrep -x "mongod" > /dev/null && ! pgrep -x "mongo" > /dev/null; then
    echo "⚠️  MongoDB doesn't appear to be running!"
    echo "   macOS: brew services start mongodb-community"
    echo "   Or start MongoDB manually before running this script"
    echo ""
fi

# Start Backend
echo "📦 Starting Backend Server..."
cd backend
npm start &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"
echo "   Running on http://localhost:5000"
echo ""

# Wait a moment for backend to start
sleep 3

# Start Frontend
echo "🎨 Starting Frontend Server..."
cd ..
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo "   Running on http://localhost:5173"
echo ""

echo "================================"
echo "✨ App is ready!"
echo "================================"
echo ""
echo "📱 Open: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Keep script running
wait $BACKEND_PID $FRONTEND_PID
