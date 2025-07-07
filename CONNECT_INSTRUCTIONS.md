# Step 4: Connect Frontend to Backend

## After Both Deployments:

### 1. Get Your Backend URL
- From Vercel dashboard: `https://your-backend-name.vercel.app`

### 2. Update Frontend API URL
Edit `src/services/apiService.ts`:

```typescript
// Change this line:
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://your-backend-url.railway.app/api');

// To this:
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://your-backend-name.vercel.app/api');
```

### 3. Rebuild Frontend
```bash
npm run build
```

### 4. Redeploy Frontend
Upload the new `dist` folder to Vercel.

## ✅ Test Your AdminBooksPageWithAPI.tsx:
1. Go to `https://your-frontend.vercel.app/admin/books`
2. Try adding a book
3. Test search functionality
4. Verify edit/delete works

## 🎉 Your Library Management System is Live!
- Full database functionality ✅
- Admin book management ✅  
- User authentication ✅
- Modern responsive design ✅
