#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 KG Modern Library Management System Setup${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed or not in PATH${NC}"
    echo -e "${YELLOW}Please install PostgreSQL first:${NC}"
    echo -e "${YELLOW}  - On Windows: Download from https://www.postgresql.org/download/windows/${NC}"
    echo -e "${YELLOW}  - On macOS: brew install postgresql${NC}"
    echo -e "${YELLOW}  - On Ubuntu: sudo apt-get install postgresql${NC}"
    exit 1
fi

echo -e "${GREEN}✅ PostgreSQL is installed${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo -e "${YELLOW}Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js is installed${NC}"

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
echo ""

# Install frontend dependencies
echo -e "${BLUE}Installing frontend dependencies...${NC}"
npm install

# Install backend dependencies
echo -e "${BLUE}Installing backend dependencies...${NC}"
cd server
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created. Please update the database credentials.${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

echo ""
echo -e "${YELLOW}🗄️  Database Setup${NC}"
echo -e "${YELLOW}==================${NC}"
echo ""

# Ask for database credentials
echo -e "${BLUE}Please provide your PostgreSQL database credentials:${NC}"
read -p "Database host (default: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Database port (default: 5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}

read -p "Database name (default: kg_modern_db): " DB_NAME
DB_NAME=${DB_NAME:-kg_modern_db}

read -p "Database username (default: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -s -p "Database password: " DB_PASSWORD
echo ""

# Update .env file with database credentials
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

echo -e "${YELLOW}📝 Updating .env file with database credentials...${NC}"
sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"${DATABASE_URL}\"|g" .env
echo -e "${GREEN}✅ Database credentials updated${NC}"

# Test database connection
echo -e "${YELLOW}🔍 Testing database connection...${NC}"
if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "postgres" -c "SELECT 1;" &> /dev/null; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    echo -e "${YELLOW}Please check your database credentials and make sure PostgreSQL is running.${NC}"
    exit 1
fi

# Create database if it doesn't exist
echo -e "${YELLOW}🏗️  Creating database if it doesn't exist...${NC}"
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "postgres" -c "CREATE DATABASE ${DB_NAME};" 2>/dev/null || echo -e "${YELLOW}Database ${DB_NAME} already exists${NC}"

# Generate Prisma client
echo -e "${YELLOW}🔧 Generating Prisma client...${NC}"
npx prisma generate

# Push database schema
echo -e "${YELLOW}📊 Pushing database schema...${NC}"
npx prisma db push

# Seed database
echo -e "${YELLOW}🌱 Seeding database with sample data...${NC}"
npm run prisma:seed

echo ""
echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo -e "${BLUE}1. Start the backend server: ${YELLOW}cd server && npm run dev${NC}"
echo -e "${BLUE}2. Start the frontend server: ${YELLOW}cd .. && npm run dev${NC}"
echo -e "${BLUE}3. Open your browser and go to: ${YELLOW}http://localhost:5173${NC}"
echo ""
echo -e "${BLUE}🔐 Login Credentials:${NC}"
echo -e "${BLUE}Admin: ${YELLOW}admin@library.com${NC} / ${YELLOW}admin123${NC}"
echo -e "${BLUE}User: ${YELLOW}john.doe@example.com${NC} / ${YELLOW}user123${NC}"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
