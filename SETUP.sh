#!/bin/bash
# Repido Booking System - Setup & Run Script

echo "================================================"
echo "  Repido Ride-Sharing App - Booking System"
echo "  Setup & Quick Start Guide"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}1. Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js not found. Please install from https://nodejs.org${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found: $(node -v)${NC}"
echo ""

# Check MongoDB
echo -e "${BLUE}2. Checking MongoDB...${NC}"
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}MongoDB not running locally. Using MongoDB Atlas? Configure .env${NC}"
else
    echo -e "${GREEN}✓ MongoDB found${NC}"
fi
echo ""

# Backend setup
echo -e "${BLUE}3. Setting up Backend...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Backend already installed${NC}"
fi

# Check .env
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file (use .env.sample as template)${NC}"
    cp .env.sample .env 2>/dev/null || echo "Edit .env manually with:"
    echo "  MONGODB_URI=mongodb://localhost:27017/repido"
    echo "  JWT_SECRET=your_secret_key_here"
    echo "  PORT=5000"
fi
echo ""

# Frontend setup
echo -e "${BLUE}4. Setting up Frontend...${NC}"
cd ..
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Frontend already installed${NC}"
fi
echo ""

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}Setup Complete! ✓${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""

echo -e "${BLUE}📋 Next Steps:${NC}"
echo ""
echo "1. Terminal 1 - Start Backend:"
echo -e "   ${YELLOW}cd backend && npm run dev${NC}"
echo ""
echo "2. Terminal 2 - Start Frontend:"
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo "3. Open Browser:"
echo -e "   ${YELLOW}http://localhost:5173${NC}"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "   - BOOKING_SUMMARY.md      - Overview of new features"
echo "   - BOOKING_SYSTEM.md       - Technical documentation"
echo "   - BOOKING_TEST_GUIDE.md   - Testing scenarios"
echo "   - README.md               - Full project documentation"
echo ""
echo -e "${BLUE}🧪 Quick Test Flow:${NC}"
echo "   1. Search for rides (no login needed)"
echo "   2. Request seats as guest"
echo "   3. Register as driver"
echo "   4. Add vehicle with seats"
echo "   5. View ride requests"
echo "   6. Accept/Reject requests"
echo ""
echo -e "${YELLOW}Note: Update .env with your MongoDB_URI if using Atlas${NC}"
echo ""
