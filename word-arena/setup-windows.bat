@echo off
echo ========================================
echo   Word Arena - Windows Setup Script
echo ========================================
echo.

echo Step 1: Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Installing API dependencies...
cd apps\api
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install API dependencies
    pause
    exit /b 1
)

echo.
echo Step 3: Installing Web dependencies...
cd ..\web
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Web dependencies
    pause
    exit /b 1
)

echo.
echo Step 4: Creating .env files...

REM Create API .env file
cd ..\api
(
    echo DATABASE_URL="postgresql://neondb_owner:npg_3BrnShXVwq1E@ep-square-night-apv467k0.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
    echo PORT=3001
    echo FRONTEND_URL=http://localhost:3000
) > .env
echo Created apps/api/.env

REM Create Web .env file
cd ..\web
(
    echo NEXT_PUBLIC_API_URL=http://localhost:3001
) > .env
echo Created apps/web/.env

echo.
echo Step 5: Setting up database with Prisma...
cd ..\api
call npx prisma generate
call npx prisma db push --accept-data-loss

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo To run the game, execute:
echo   npm run dev
echo.
echo Then open http://localhost:3000 in your browser
echo.
pause
