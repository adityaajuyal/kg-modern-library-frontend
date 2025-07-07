# Step 5: Database Setup & Migration

## After Backend Deployment:

### 1. Setup Database Schema
In your Vercel backend dashboard:
1. Go to Functions tab
2. Click on any function
3. Open terminal/console
4. Run: `npx prisma migrate deploy`
5. Run: `npx prisma generate`

### Alternative: Local Setup
```bash
# In server directory with DATABASE_URL env var
cd server
npx prisma migrate deploy
npx prisma db seed  # Optional: Add sample data
```

### 2. Verify Database Connection
Test API endpoint: `https://your-backend.vercel.app/api/books`
Should return: `{"data": [], "total": 0}`

### 3. Create Admin User (Optional)
```bash
npx prisma studio  # Opens database browser
# Or use the admin registration in your app
```

## ✅ Database Ready!
Your AdminBooksPageWithAPI.tsx can now:
- Add books to real database
- Search and filter books
- Edit book details
- Delete books
- Track book inventory

## 🎯 Test Your Full-Stack App:
1. Visit your frontend URL
2. Go to admin section
3. Add your first book
4. Watch it persist in the database!
