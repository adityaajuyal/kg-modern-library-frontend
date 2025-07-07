@echo off
echo 🚀 LibraryOS Demo Setup
echo =======================
echo.

echo Setting up LibraryOS - Modern Library Management System
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Node.js is not installed. Please install Node.js v18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm detected
echo.

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend dependency installation failed
    pause
    exit /b 1
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend dependency installation failed
    pause
    exit /b 1
)
cd ..

echo.
echo 🎉 Setup complete!
echo.
echo To start the application:
echo.
echo 1. Start the backend server:
echo    cd server
echo    npm run dev
echo.
echo 2. In a new terminal, start the frontend:
echo    npm run dev
echo.
echo The application will be available at:
echo    Frontend: http://localhost:5174
echo    Backend:  http://localhost:5000
echo.
echo Demo Accounts:
echo    User:  demo@library.com / password123
echo    Admin: admin@library.com / admin123
echo.
echo Enjoy exploring LibraryOS! 📚✨
echo.
pause
