# KG Modern Library - Render Deployment

## Frontend (React/Vite)
- Build Command: `npm run build`
- Publish Directory: `dist`
- Environment: Node.js

## Backend (Node.js/Express)
- Build Command: `cd server && npm install && npm run build`
- Start Command: `cd server && npm start`
- Environment: Node.js

## Database
- PostgreSQL Database on Render
- Connection string will be provided by Render

## Environment Variables for Backend
- `NODE_ENV=production`
- `PORT=10000` (Render default)
- `DATABASE_URL=<provided_by_render_database>`
- `JWT_SECRET=your-secret-key`
- `CORS_ORIGIN=https://your-frontend-domain.onrender.com`
