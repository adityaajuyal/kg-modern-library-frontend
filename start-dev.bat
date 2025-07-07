@echo off
setlocal

echo.
echo 🚀 Starting KG Modern Library Management System
echo ===============================================
echo.

:: Start backend server
echo 🔧 Starting backend server...
cd server
start "Backend Server" cmd /k "npm run dev"
echo ✅ Backend server started
cd ..

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: Start frontend server
echo 🎨 Starting frontend server...
start "Frontend Server" cmd /k "npm run dev"
echo ✅ Frontend server started

echo.
echo 🎉 Both servers are running!
echo 📋 Access URLs:
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
echo.
echo 🔐 Login Credentials:
echo Admin: admin@library.com / admin123
echo User: john.doe@example.com / user123
echo.
echo Close the terminal windows to stop the servers.
echo.
pause
