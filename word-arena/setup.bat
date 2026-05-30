@echo off
REM Word Arena Setup Script for Windows
REM This script helps you set up and run the Word Arena game

echo.
echo ===================================
echo   Word Arena - Setup Script
echo ===================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js v18 or higher.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js version:
node -v
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed.
    pause
    exit /b 1
)

echo [OK] npm version:
npm -v
echo.

REM Install root dependencies
echo [INFO] Installing root dependencies...
call npm install --legacy-peer-deps
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install root dependencies
    pause
    exit /b 1
)
echo.

REM Install API dependencies
echo [INFO] Installing API dependencies...
cd apps\api
call npm install --legacy-peer-deps
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install API dependencies
    cd ..\..
    pause
    exit /b 1
)
cd ..\..
echo.

REM Install Web dependencies
echo [INFO] Installing Web dependencies...
cd apps\web
call npm install --legacy-peer-deps
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install Web dependencies
    cd ..\..
    pause
    exit /b 1
)
cd ..\..
echo.

REM Create .env files if they don't exist
if not exist apps\api\.env (
    echo [INFO] Creating API .env file...
    copy apps\api\.env.example apps\api\.env
    echo    [WARNING] Please update DATABASE_URL in apps\api\.env with your PostgreSQL credentials
)

if not exist apps\web\.env (
    echo [INFO] Creating Web .env file...
    copy apps\web\.env.example apps\web\.env
)

echo.
echo ===================================
echo   Setup Complete!
echo ===================================
echo.
echo Next Steps:
echo.
echo 1. Update your PostgreSQL connection string in apps\api\.env:
echo    DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/wordarena"
echo.
echo 2. Create the database ^(if using PostgreSQL^):
echo    createdb wordarena
echo    OR use pgAdmin to create a database named 'wordarena'
echo.
echo 3. Run Prisma migrations:
echo    cd apps\api
echo    npx prisma generate
echo    npx prisma migrate dev --name init
echo.
echo 4. Start the development servers:
echo.
echo    Option A - Both together:
echo      npm run dev
echo.
echo    Option B - Separately:
echo      Terminal 1: cd apps\api ^&^& npm run dev
echo      Terminal 2: cd apps\web ^&^& npm run dev
echo.
echo 5. Open your browser to: http://localhost:3000
echo.
echo Enjoy playing Word Arena!
echo.
pause
