#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting KG Modern Library Management System${NC}"
echo -e "${BLUE}===============================================${NC}"
echo ""

# Function to start backend
start_backend() {
    echo -e "${YELLOW}🔧 Starting backend server...${NC}"
    cd server
    npm run dev &
    BACKEND_PID=$!
    echo -e "${GREEN}✅ Backend server started (PID: $BACKEND_PID)${NC}"
    cd ..
}

# Function to start frontend
start_frontend() {
    echo -e "${YELLOW}🎨 Starting frontend server...${NC}"
    npm run dev &
    FRONTEND_PID=$!
    echo -e "${GREEN}✅ Frontend server started (PID: $FRONTEND_PID)${NC}"
}

# Function to handle cleanup
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping servers...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

# Set up trap for cleanup
trap cleanup SIGINT SIGTERM

# Start both servers
start_backend
sleep 2
start_frontend

echo ""
echo -e "${GREEN}🎉 Both servers are running!${NC}"
echo -e "${BLUE}📋 Access URLs:${NC}"
echo -e "${BLUE}Frontend: ${YELLOW}http://localhost:5173${NC}"
echo -e "${BLUE}Backend: ${YELLOW}http://localhost:5000${NC}"
echo ""
echo -e "${BLUE}🔐 Login Credentials:${NC}"
echo -e "${BLUE}Admin: ${YELLOW}admin@library.com${NC} / ${YELLOW}admin123${NC}"
echo -e "${BLUE}User: ${YELLOW}john.doe@example.com${NC} / ${YELLOW}user123${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"

# Wait for both processes
wait
