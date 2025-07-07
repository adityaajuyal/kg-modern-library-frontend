# KG Modern Library Management System

A modern, full-stack library management system built with React, Node.js, and PostgreSQL.

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication with access and refresh tokens
- Role-based access control (User, Admin, Librarian)
- Secure password hashing with bcrypt
- Protected routes and middleware

### 📚 Book Management
- Complete CRUD operations for books
- Advanced search and filtering
- Category management
- Book availability tracking
- Cover image support

### 📝 Issue Management
- Book issuing and returning system
- Request approval workflow
- Due date tracking
- Overdue notifications

### 💰 Fine Management
- Automated fine calculation
- Payment tracking
- Fine status management
- Payment history

### 👥 User Management
- Admin panel for user management
- User profile management
- Activity tracking
- Role assignment

### 📱 Modern UI/UX
- Mobile-responsive design
- Dark/light theme support
- Intuitive navigation
- Real-time updates

### 🔍 Advanced Features
- Search and filter capabilities
- Pagination and sorting
- Export functionality
- Analytics and reporting

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Query** for state management
- **React Router** for routing
- **React Hook Form** for form handling
- **Zod** for validation
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Prisma ORM** for database operations
- **PostgreSQL** for database
- **JWT** for authentication
- **bcrypt** for password hashing
- **Zod** for request validation
- **Helmet** for security
- **CORS** for cross-origin requests

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kg-modern
   ```

2. **Run the full setup script**
   ```bash
   # On Windows
   ./setup-full.bat
   
   # On Linux/macOS
   chmod +x setup-full.sh
   ./setup-full.sh
   ```

3. **Start the development servers**
   ```bash
   # On Windows
   ./start-dev.bat
   
   # On Linux/macOS
   chmod +x start-dev.sh
   ./start-dev.sh
   ```

### Manual Setup

1. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp server/.env.example server/.env
   ```
   
   Update the database connection string in `server/.env`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/kg_modern_db"
   ```

5. **Set up the database**
   
   Create a PostgreSQL database:
   ```sql
   CREATE DATABASE kg_modern_db;
   ```
   
   Run the database migrations:
   ```bash
   cd server
   npx prisma migrate dev
   ```

6. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

7. **Start the development servers**
   
   Start the backend server:
   ```bash
   cd server
   npm run dev
   ```
   
   Start the frontend server (in a new terminal):
   ```bash
   npm run dev
   ```

8. **Access the application**
   
   Open your browser and go to: `http://localhost:5173`

## 🔐 Default Login Credentials

After seeding the database, you can use these credentials:

### Admin Account
- **Email**: admin@library.com
- **Password**: admin123

### User Account
- **Email**: john.doe@example.com
- **Password**: user123

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create new book (Admin only)
- `PUT /api/books/:id` - Update book (Admin only)
- `DELETE /api/books/:id` - Delete book (Admin only)

### Issues
- `GET /api/issues` - Get all issues
- `GET /api/issues/user/:userId` - Get user's issues
- `POST /api/issues` - Create new issue
- `PUT /api/issues/:id` - Update issue status
- `DELETE /api/issues/:id` - Delete issue

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-activity` - Get recent activity

## 📁 Project Structure

```
kg-modern/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   │   ├── auth/               # Authentication components
│   │   └── ui/                 # UI components
│   ├── pages/                  # Page components
│   │   ├── admin/              # Admin pages
│   │   ├── auth/               # Auth pages
│   │   └── user/               # User pages
│   ├── layouts/                # Layout components
│   ├── services/               # API services
│   └── utils/                  # Utility functions
├── server/                      # Backend source code
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Express middleware
│   │   ├── routes/             # API routes
│   │   ├── utils/              # Utility functions
│   │   └── lib/                # Libraries and configs
│   ├── prisma/                 # Database schema and migrations
│   ├── scripts/                # Utility scripts
│   └── docs/                   # API documentation
├── shared/                      # Shared types and utilities
└── scripts/                     # Project scripts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/kg-modern/issues) page
2. Create a new issue with detailed information
3. Join our community for support

## 🚀 Deployment

### Using Docker

1. Build the Docker images:
   ```bash
   docker-compose build
   ```

2. Start the services:
   ```bash
   docker-compose up -d
   ```

### Manual Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Build the backend:
   ```bash
   cd server
   npm run build
   ```

3. Set up production environment variables

4. Start the production server:
   ```bash
   npm start
   ```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kg_modern_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-jwt-key"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_EXPIRES_IN="30d"

# Server
PORT=5000
NODE_ENV="production"
CORS_ORIGIN="http://localhost:3000"

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📊 Performance

- **Frontend**: Optimized with code splitting and lazy loading
- **Backend**: Efficient database queries with Prisma
- **Database**: Indexed for fast searches
- **Caching**: Redis for session management (optional)

## 🔒 Security

- **Authentication**: JWT with refresh token rotation
- **Authorization**: Role-based access control
- **Input Validation**: Zod schema validation
- **Security Headers**: Helmet.js
- **Rate Limiting**: Express rate limit
- **CORS**: Configured for production

---

Made with ❤️ by the KG Modern Team
