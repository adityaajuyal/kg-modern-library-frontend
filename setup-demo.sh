#!/bin/bash

echo "🚀 LibraryOS Demo Setup"
echo "======================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up LibraryOS - Modern Library Management System${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed. Please install Node.js v18+ first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}⚠️  npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js and npm detected${NC}"

# Install frontend dependencies
echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
npm install

# Install backend dependencies
echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
cd server
npm install
cd ..

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo -e "${BLUE}To start the application:${NC}"
echo ""
echo -e "${YELLOW}1. Start the backend server:${NC}"
echo "   cd server"
echo "   npm run dev"
echo ""
echo -e "${YELLOW}2. In a new terminal, start the frontend:${NC}"
echo "   npm run dev"
echo ""
echo -e "${BLUE}The application will be available at:${NC}"
echo "   Frontend: http://localhost:5174"
echo "   Backend:  http://localhost:5000"
echo ""
echo -e "${GREEN}Demo Accounts:${NC}"
echo "   User:  demo@library.com / password123"
echo "   Admin: admin@library.com / admin123"
echo ""
echo -e "${BLUE}Enjoy exploring LibraryOS! 📚✨${NC}"
