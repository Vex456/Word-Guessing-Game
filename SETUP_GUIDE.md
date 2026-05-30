# Word Arena - Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed (or use Docker)
- npm or yarn package manager

## Quick Start (Local Development)

### Option 1: Using Docker (Recommended)

1. **Make sure Docker is installed**
   ```bash
   docker --version
   docker-compose --version
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Run database migrations**
   ```bash
   docker-compose exec api npx prisma migrate dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3001
   - PostgreSQL: localhost:5432

5. **Stop services**
   ```bash
   docker-compose down
   ```

### Option 2: Local Development (Without Docker)

#### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install API dependencies
cd apps/api
npm install

# Install Web dependencies
cd ../web
npm install
cd ../..
```

#### Step 2: Setup PostgreSQL Database

Create a database named `wordarena`:

```bash
# Using psql
psql -U postgres
CREATE DATABASE wordarena;
\q

# Or using createdb
createdb wordarena
```

#### Step 3: Configure Environment Variables

Create `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/wordarena?schema=public"

# API
PORT=3001
FRONTEND_URL=http://localhost:3000

# Web
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Create `.env` file in `apps/api/`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/wordarena?schema=public"
PORT=3001
FRONTEND_URL=http://localhost:3000
```

Create `.env.local` file in `apps/web/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### Step 4: Generate Prisma Client

```bash
cd apps/api
npx prisma generate
npx prisma migrate dev --name init
cd ../..
```

#### Step 5: Seed the Database (Optional)

```bash
cd apps/api
npx prisma db seed
cd ../..
```

#### Step 6: Start Development Servers

**Option A: Start both servers simultaneously**
```bash
npm run dev
```

**Option B: Start servers separately (in different terminals)**

Terminal 1 - API Server:
```bash
cd apps/api
npm run start:dev
```

Terminal 2 - Web Server:
```bash
cd apps/web
npm run dev
```

#### Step 7: Access the Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **Prisma Studio** (Database GUI): `cd apps/api && npx prisma studio`

---

## Production Build

### Using Docker

```bash
docker-compose -f docker-compose.yml build
docker-compose up -d
```

### Manual Build

```bash
# Build API
cd apps/api
npm run build
npm run start:prod

# Build Web (in another terminal)
cd apps/web
npm run build
npm run start
```

---

## Testing

### Run API Tests
```bash
cd apps/api
npm test
```

### Run E2E Tests
```bash
cd apps/api
npm run test:e2e
```

---

## Common Issues & Solutions

### Issue: Port already in use
```bash
# Find process using port 3000 or 3001
lsof -i :3000
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### Issue: Database connection failed
```bash
# Check if PostgreSQL is running
# macOS
brew services list | grep postgres

# Linux
systemctl status postgresql

# Start PostgreSQL
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Issue: Prisma client not generated
```bash
cd apps/api
npx prisma generate
```

### Issue: Migration errors
```bash
cd apps/api
npx prisma migrate reset
npx prisma migrate dev
```

---

## Project Structure

```
word-arena/
├── apps/
│   ├── api/                 # NestJS Backend
│   │   ├── src/
│   │   │   ├── app.module.ts
│   │   │   ├── app.controller.ts
│   │   │   ├── app.service.ts
│   │   │   ├── main.ts
│   │   │   ├── game/
│   │   │   │   └── game.gateway.ts
│   │   │   ├── match/
│   │   │   │   └── match.service.ts
│   │   │   ├── lobby/
│   │   │   │   └── lobby.service.ts
│   │   │   ├── dictionary/
│   │   │   │   └── dictionary.service.ts
│   │   │   └── prisma/
│   │   │       └── prisma.service.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   └── web/                 # Next.js Frontend
│       ├── pages/
│       │   ├── index.tsx
│       │   ├── lobby.tsx
│       │   ├── leaderboard.tsx
│       │   └── match/
│       │       ├── [id].tsx
│       │       └── [id]/results.tsx
│       ├── public/
│       ├── styles/
│       │   └── globals.css
│       ├── package.json
│       ├── next.config.js
│       ├── tailwind.config.js
│       ├── postcss.config.js
│       ├── tsconfig.json
│       └── Dockerfile
│
├── prisma/                  # Shared Prisma schemas
├── docker-compose.yml
├── package.json
├── .env
└── README.md
```

---

## Available Scripts

### Root Level
```bash
npm run dev          # Start both API and Web in development mode
npm run build        # Build both applications
npm run start        # Start both applications in production mode
```

### API (apps/api)
```bash
npm run start:dev    # Development mode with watch
npm run build        # Build for production
npm run start:prod   # Production mode
npm run prisma:generate   # Generate Prisma client
npm run prisma:migrate    # Run migrations
npm run prisma:studio     # Open Prisma Studio
```

### Web (apps/web)
```bash
npm run dev          # Development mode
npm run build        # Build for production
npm run start        # Production mode
npm run lint         # Run ESLint
```

---

## Multiplayer Testing

To test multiplayer functionality:

1. Open multiple browser windows/tabs
2. Visit http://localhost:3000 in each
3. Enter different player names
4. Join the same lobby
5. All players click "Ready Up"
6. Match will start automatically when minimum players (2) are ready

---

## Next Steps

After getting the basic setup working:

1. **Add more words to the dictionary** - Edit `apps/api/src/dictionary/dictionary.service.ts`
2. **Customize avatars** - Add avatar images to `apps/web/public/avatars/`
3. **Configure production database** - Update `DATABASE_URL` in `.env`
4. **Deploy to cloud** - Use the provided Dockerfiles with your preferred hosting

---

## Support

If you encounter any issues:

1. Check the console logs in both terminal windows
2. Verify all environment variables are set correctly
3. Ensure PostgreSQL is running and accessible
4. Check that ports 3000 and 3001 are not blocked by firewall

For more help, check the official documentation:
- NestJS: https://docs.nestjs.com
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Socket.IO: https://socket.io/docs/v4/
