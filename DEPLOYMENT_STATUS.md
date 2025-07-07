# 🚀 Quick Deployment Guide - Vercel + Supabase

## Step 1: Database Setup (Supabase)
1. Go to https://supabase.com and sign up
2. Create a new project
3. Go to Settings > Database
4. Copy the Connection String (URI format)
5. Go to SQL Editor and run your schema (if needed)

## Step 2: Backend Deployment (Vercel)
1. Go to https://vercel.com and sign up
2. Import your GitHub repository
3. Set Root Directory to `server`
4. Set Build Command to `npm run build`
5. Set Output Directory to `dist`
6. Add Environment Variables:
   - `DATABASE_URL=your-supabase-connection-string`
   - `JWT_SECRET=your-secret-key`
   - `NODE_ENV=production`
   - `CORS_ORIGIN=*` (or specific domain)

## Step 3: Frontend Deployment (Vercel)
1. Create another Vercel project
2. Import same GitHub repository
3. Set Root Directory to `/` (root)
4. Set Build Command to `npm run build`
5. Set Output Directory to `dist`
6. Add Environment Variables:
   - `VITE_API_URL=https://your-backend-domain.vercel.app`

## Step 4: Update Frontend API URL
Update `src/services/apiService.ts` with your backend URL

## Alternative: Netlify + Railway
- Frontend: Netlify
- Backend: Railway
- Database: Railway PostgreSQL

## Current Status
✅ Railway project created
✅ PostgreSQL database added
❌ Backend deployment failed (configuration issue)

## Next Steps
1. Choose deployment method
2. Set up database
3. Deploy backend
4. Deploy frontend
5. Test everything works
