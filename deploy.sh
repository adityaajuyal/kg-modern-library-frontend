#!/bin/bash

# KG Modern Library - Full Stack Deployment Script
echo "🚀 Starting Full Stack Deployment for KG Modern Library..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Deployment Checklist:${NC}"
echo "1. Database setup (Railway/Supabase)"
echo "2. Backend deployment (Railway/Render)"
echo "3. Frontend deployment (Netlify/Vercel)"
echo "4. Environment configuration"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI not found. Installing...${NC}"
    echo "Please install Railway CLI manually:"
    echo "npm install -g @railway/cli"
    echo "Then run: railway login"
    exit 1
fi

# Backend deployment
echo -e "${YELLOW}🔧 Deploying Backend...${NC}"
cd server

echo "Building backend..."
npm run build

echo "Deploying to Railway..."
railway up

echo -e "${GREEN}✅ Backend deployment initiated!${NC}"
echo ""

# Frontend build
echo -e "${YELLOW}🎨 Building Frontend...${NC}"
cd ..
npm run build

echo -e "${GREEN}✅ Frontend built successfully!${NC}"
echo -e "${YELLOW}📤 Upload the 'dist' folder to Netlify or Vercel${NC}"
echo ""

echo -e "${GREEN}🎉 Deployment process completed!${NC}"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "1. Update CORS_ORIGIN in backend with your frontend URL"
echo "2. Update VITE_API_URL in frontend with your backend URL"
echo "3. Test all API endpoints"
echo "4. Verify database connection"
echo ""
echo -e "${GREEN}🔗 Your app will be available at:${NC}"
echo "Frontend: https://your-app-name.netlify.app"
echo "Backend: https://your-backend-url.railway.app"
echo "Database: Check Railway dashboard"
