# 🚀 Quick Start Guide - Word Arena

## For Windows Users (Your Current System)

Based on your error messages, here's how to fix and run the project:

### Step 1: Install Dependencies

Open PowerShell in the `word-arena` folder and run:

```powershell
# Install root dependencies
npm install

# Install API dependencies  
cd apps\api
npm install

# Install Web dependencies
cd ..\web
npm install

# Go back to root
cd ..\..
```

### Step 2: Create .env Files

**In `apps/api` folder**, create a file named `.env`:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/wordarena"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

**In `apps/web` folder**, create a file named `.env`:
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### Step 3: Set Up PostgreSQL Database

#### Option A: Using pgAdmin (Recommended for Windows)
1. Open pgAdmin (installed with PostgreSQL)
2. Right-click "Databases" → Create → Database
3. Name it: `wordarena`
4. Save

#### Option B: Using Command Line
```powershell
# Open PowerShell as Administrator
createdb -U postgres wordarena
```

### Step 4: Run Prisma Migrations

```powershell
cd apps\api
npx prisma generate
npx prisma migrate dev --name init
cd ..\..
```

### Step 5: Run the Application

#### Option A: Run Both Together (Recommended)
```powershell
npm run dev
```

This starts:
- Backend on http://localhost:3001
- Frontend on http://localhost:3000

#### Option B: Run Separately

**Terminal 1 (Backend):**
```powershell
cd apps\api
npm run dev
```

**Terminal 2 (Frontend):**
```powershell
cd apps\web
npm run dev
```

### Step 6: Play!

Open your browser to: **http://localhost:3000**

---

## Common Errors & Solutions

### Error: "'next' is not recognized"
**Solution:** You need to install dependencies first:
```powershell
cd apps\web
npm install
```

### Error: "Cannot find module 'dist/main'"
**Solution:** The backend hasn't been built yet. Run:
```powershell
cd apps\api
npm run dev
```
(This automatically builds and runs)

### Error: Database connection failed
**Solution:** 
1. Make sure PostgreSQL is running
2. Check your `.env` file has correct credentials
3. Verify database exists: `psql -U postgres -l`

### Error: Port already in use
**Solution:** Change the port in `.env`:
```env
PORT=3002
```

---

## Alternative: Use Setup Script

Instead of manual steps, you can run:

```powershell
.\setup.bat
```

This automated script will:
- Install all dependencies
- Create .env files
- Show you next steps

---

## Project Structure Overview

```
word-arena/
├── apps/
│   ├── api/          ← Backend (NestJS + Socket.IO)
│   │   ├── src/
│   │   └── .env      ← Database config here
│   │
│   └── web/          ← Frontend (Next.js)
│       ├── pages/    ← Game pages
│       └── .env      ← API URL config here
│
└── package.json      ← Root config
```

---

## Testing Without Database (Quick Test)

If you want to test the frontend quickly without setting up PostgreSQL:

1. Install dependencies:
```powershell
cd apps\web
npm install
npm run dev
```

2. Open http://localhost:3000

The home page and leaderboard will work. The lobby and match features need the backend running with a database.

---

## Need Help?

Check the full README.md for detailed documentation.

**Enjoy Word Arena! 🎮**
