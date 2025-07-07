@echo off
setlocal enabledelayedexpansion

echo.
echo 🚀 KG Modern Library Management System Setup
echo ============================================
echo.

:: Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed

:: Check if PostgreSQL is installed
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL is not installed or not in PATH
    echo Please install PostgreSQL first:
    echo   - Download from https://www.postgresql.org/download/windows/
    echo   - Make sure to add PostgreSQL to your PATH during installation
    pause
    exit /b 1
)

echo ✅ PostgreSQL is installed

:: Install dependencies
echo.
echo 📦 Installing dependencies...
echo.

:: Install frontend dependencies
echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend dependency installation failed
    pause
    exit /b 1
)

:: Install backend dependencies
echo Installing backend dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend dependency installation failed
    pause
    exit /b 1
)

:: Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env >nul
    echo ✅ .env file created. Please update the database credentials.
) else (
    echo ✅ .env file already exists
)

echo.
echo 🗄️  Database Setup
echo ==================
echo.

:: Ask for database credentials
echo Please provide your PostgreSQL database credentials:
set /p DB_HOST=Database host (default: localhost): 
if "%DB_HOST%"=="" set DB_HOST=localhost

set /p DB_PORT=Database port (default: 5432): 
if "%DB_PORT%"=="" set DB_PORT=5432

set /p DB_NAME=Database name (default: kg_modern_db): 
if "%DB_NAME%"=="" set DB_NAME=kg_modern_db

set /p DB_USER=Database username (default: postgres): 
if "%DB_USER%"=="" set DB_USER=postgres

:: Get password securely (note: this will show the password, but it's the best we can do in batch)
set /p DB_PASSWORD=Database password: 

:: Update .env file with database credentials
set DATABASE_URL=postgresql://%DB_USER%:%DB_PASSWORD%@%DB_HOST%:%DB_PORT%/%DB_NAME%

echo 📝 Updating .env file with database credentials...
powershell -Command "(Get-Content .env) -replace 'DATABASE_URL=.*', 'DATABASE_URL=\"%DATABASE_URL%\"' | Set-Content .env"
echo ✅ Database credentials updated

:: Test database connection
echo 🔍 Testing database connection...
set PGPASSWORD=%DB_PASSWORD%
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d postgres -c "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Database connection failed
    echo Please check your database credentials and make sure PostgreSQL is running.
    pause
    exit /b 1
)

echo ✅ Database connection successful

:: Create database if it doesn't exist
echo 🏗️  Creating database if it doesn't exist...
set PGPASSWORD=%DB_PASSWORD%
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d postgres -c "CREATE DATABASE %DB_NAME%;" 2>nul
if %errorlevel% neq 0 (
    echo Database %DB_NAME% already exists or creation failed
)

:: Generate Prisma client
echo 🔧 Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Prisma client generation failed
    pause
    exit /b 1
)

:: Push database schema
echo 📊 Pushing database schema...
call npx prisma db push
if %errorlevel% neq 0 (
    echo ❌ Database schema push failed
    pause
    exit /b 1
)

:: Seed database
echo 🌱 Seeding database with sample data...
call npm run prisma:seed
if %errorlevel% neq 0 (
    echo ❌ Database seeding failed
    pause
    exit /b 1
)

echo.
echo 🎉 Setup completed successfully!
echo ================================
echo.
echo 📋 Next Steps:
echo 1. Start the backend server: cd server && npm run dev
echo 2. Start the frontend server: cd .. && npm run dev
echo 3. Open your browser and go to: http://localhost:5173
echo.
echo 🔐 Login Credentials:
echo Admin: admin@library.com / admin123
echo User: john.doe@example.com / user123
echo.
echo Happy coding! 🚀
echo.
pause
