# 🚀 KG Modern Library - Full Stack Deployment Guide

## Prerequisites
- Node.js installed
- Git repository (GitHub/GitLab)
- Railway account (for backend + database)
- Netlify account (for frontend)

## Step-by-Step Deployment

### 🗄️ Step 1: Database Setup (Railway)

1. **Go to [Railway](https://railway.app)**
2. **Create new project**
3. **Add PostgreSQL database**
4. **Copy the DATABASE_URL** from Railway dashboard
5. **Save it** - you'll need it for backend

### 🔧 Step 2: Backend Deployment (Railway)

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Deploy Backend**
   ```bash
   cd server
   railway init
   railway up
   ```

4. **Set Environment Variables** in Railway Dashboard:
   - `NODE_ENV=production`
   - `DATABASE_URL=your-postgresql-url-from-step-1`
   - `JWT_SECRET=your-super-secret-jwt-key`
   - `CORS_ORIGIN=https://your-frontend-url.netlify.app`
   - `ADMIN_EMAIL=admin@kgmodern.edu`
   - `ADMIN_PASSWORD=admin123456`

5. **Get your backend URL** from Railway dashboard

### 🎨 Step 3: Frontend Deployment (Netlify)

1. **Update API URL**
   - Edit `.env.production` 
   - Set `VITE_API_URL=https://your-backend-url.railway.app/api`

2. **Build Frontend**
   ```bash
   npm run build
   ```

3. **Deploy to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Drag & drop the `dist` folder
   - Or connect your GitHub repository

4. **Set Environment Variables** in Netlify:
   - `VITE_API_URL=https://your-backend-url.railway.app/api`

### 🔗 Step 4: Connect Frontend & Backend

1. **Update CORS in Backend**
   - Go to Railway dashboard
   - Update `CORS_ORIGIN` to your Netlify URL

2. **Update API URL in Frontend**
   - Edit `src/services/apiService.ts`
   - Replace `your-backend-url.railway.app` with actual URL

### 🧪 Step 5: Test Your Deployment

1. **Test API Endpoints**
   - Visit `https://your-backend-url.railway.app/api/health`
   - Should return `{"status": "healthy"}`

2. **Test Frontend**
   - Visit your Netlify URL
   - Try adding a book in admin panel
   - Check if data persists

3. **Test Database**
   - Check Railway dashboard for database connections
   - Verify books are saved in database

## 🎯 Alternative: Quick Deploy with One-Click

### Option A: Render (Alternative to Railway)
1. Go to [Render](https://render.com)
2. Create PostgreSQL database
3. Deploy backend as Web Service
4. Set environment variables

### Option B: Supabase + Vercel
1. Create database at [Supabase](https://supabase.com)
2. Deploy backend to Vercel
3. Deploy frontend to Vercel
4. Configure environment variables

## � Environment Variables Cheatsheet

### Backend (Railway/Render)
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://your-frontend-url.netlify.app
ADMIN_EMAIL=admin@kgmodern.edu
ADMIN_PASSWORD=admin123456
```

### Frontend (Netlify/Vercel)
```env
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_APP_NAME=KG Modern Library
VITE_APP_VERSION=1.0.0
```

## 🔥 Quick Commands

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy backend
cd server && railway up

# Build frontend
npm run build

# Check deployment status
railway status
```

## 🎉 Success Checklist

- [ ] Database running on Railway
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] API endpoints working
- [ ] Admin panel functional
- [ ] Books can be added/edited/deleted
- [ ] Data persists between sessions
- [ ] Mobile responsive design working

## 🆘 Troubleshooting

### Database Connection Issues
- Check DATABASE_URL format
- Verify database is running
- Check network connectivity

### API Errors
- Verify CORS configuration
- Check API URL in frontend
- Verify environment variables

### Build Errors
- Check Node.js version
- Verify all dependencies installed
- Check build logs

## � Useful Links

- [Railway Documentation](https://docs.railway.app)
- [Netlify Documentation](https://docs.netlify.com)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

**Your Full Stack App URLs:**
- 🌐 Frontend: `https://your-app-name.netlify.app`
- 🔧 Backend: `https://your-backend-url.railway.app`
- 🗄️ Database: Railway Dashboard
- 👨‍💼 Admin: `https://your-app-name.netlify.app/admin/login`
