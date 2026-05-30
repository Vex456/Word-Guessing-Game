# Word Arena - Multiplayer Web-Based Word Game

A production-quality multiplayer web game where players battle with words in real-time!

## 🎮 Features

- **Virtual Lobby**: Walk around, chat with other players, and join matches
- **Turn-Based Word Game**: Submit words starting with a random letter
- **Real-Time Multiplayer**: Socket.IO powered real-time communication
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Leaderboard**: Global rankings based on points
- **Player Profiles**: Track your stats and match history
- **Emoji Support**: Express yourself with emojis in chat

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

Open your terminal in the project root directory and run:

```bash
cd word-arena
npm install
```

This will install dependencies for both the frontend and backend.

### Step 2: Set Up PostgreSQL Database

Create a PostgreSQL database named `wordarena`:

```bash
# Using psql command line
createdb wordarena

# Or using pgAdmin/phpPgAdmin
# Create a new database called 'wordarena'
```

### Step 3: Configure Environment Variables

Create a `.env` file in the `apps/api` directory:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/wordarena"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

Create a `.env` file in the `apps/web` directory:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### Step 4: Set Up Database Schema

Navigate to the API directory and run Prisma migrations:

```bash
cd apps/api
npx prisma generate
npx prisma migrate dev --name init
```

### Step 5: Seed the Database (Optional)

Add some initial data:

```bash
npm run seed
```

### Step 6: Run the Application

#### Option A: Run Both Frontend and Backend Together

From the project root:

```bash
npm run dev
```

This will start:
- Backend API on http://localhost:3001
- Frontend Web App on http://localhost:3000

#### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
cd apps/api
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd apps/web
npm run dev
```

### Step 7: Play the Game!

Open your browser and navigate to:
- **http://localhost:3000**

Enter your name, choose an avatar, and start playing!

## 📁 Project Structure

```
word-arena/
├── apps/
│   ├── api/              # NestJS Backend
│   │   ├── src/
│   │   │   ├── game/     # WebSocket gateway
│   │   │   ├── lobby/    # Lobby management
│   │   │   ├── match/    # Match logic
│   │   │   ├── player/   # Player management
│   │   │   └── main.ts   # Entry point
│   │   └── prisma/       # Database schema
│   │
│   └── web/              # Next.js Frontend
│       ├── pages/        # React pages
│       ├── styles/       # CSS/Tailwind
│       └── public/       # Static assets
│
├── packages/             # Shared packages
├── docker-compose.yml    # Docker configuration
└── package.json          # Root package.json
```

## 🎯 How to Play

1. **Enter Name & Choose Avatar**: Select your display name and avatar
2. **Join Lobby**: Enter the virtual lobby with other players
3. **Ready Up**: Click "Ready" when you're ready to play
4. **Match Starts**: When 2+ players are ready, the match begins
5. **Submit Words**: Take turns entering words that start with the given letter
6. **Stay in the Game**: Don't run out of time or submit invalid words
7. **Win**: Be the last player standing!

## ⏱️ Timer System

- Round 1: 10 seconds
- Round 2: 9 seconds
- Round 3: 8 seconds
- ...
- Round 8+: 3 seconds (minimum)

## 🏆 Scoring System

- **Win**: +50 points
- **2nd Place**: +25 points
- **3rd Place**: +15 points
- **Participation**: +5 points
- **Valid Word**: +1 point each

## 🔧 Development Commands

### Root Directory
```bash
npm run dev          # Run both frontend and backend
npm run build        # Build both projects
npm run db:migrate   # Run database migrations
npm run db:generate  # Generate Prisma client
```

### API Directory (`apps/api`)
```bash
npm run dev          # Start backend in watch mode
npm run build        # Build backend
npm run start        # Start production server
npm run seed         # Seed database
```

### Web Directory (`apps/web`)
```bash
npm run dev          # Start frontend dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🐳 Docker Deployment

If you prefer using Docker:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Socket.IO Client

**Backend:**
- NestJS 10
- Node.js
- TypeScript
- Socket.IO
- Prisma ORM

**Database:**
- PostgreSQL 14

## 🌐 API Endpoints

### Player Management
- `POST /api/players` - Create a new player
- `GET /api/players/:id` - Get player details
- `PUT /api/players/:id` - Update player

### Lobby Management
- `POST /api/lobbies` - Create a lobby
- `GET /api/lobbies/:id` - Get lobby state
- `POST /api/lobbies/:id/join` - Join a lobby

### Match Management
- `POST /api/matches` - Create a match
- `GET /api/matches/:id` - Get match state

### Leaderboard
- `GET /api/leaderboard` - Get global leaderboard

## 🔌 WebSocket Events

### Client → Server
- `joinLobby` - Join a lobby
- `setReady` - Toggle ready status
- `submitWord` - Submit a word
- `sendChatMessage` - Send chat message

### Server → Client
- `lobbyUpdate` - Lobby state updated
- `matchStarted` - Match has started
- `matchUpdate` - Match state updated
- `chatMessage` - New chat message
- `timerUpdate` - Timer countdown

## 📝 Game Rules

1. Words must start with the current round's letter
2. Words must exist in the dictionary
3. Words cannot be repeated within the same match
4. Players are eliminated if they:
   - Fail to submit before timer expires
   - Submit an invalid word
   - Submit a duplicate word
5. Last player remaining wins!

## 🎨 Customization

### Adding New Avatars
Edit the avatars array in `apps/web/pages/index.tsx`:

```typescript
const avatars = [
  { id: 'new-avatar', name: 'New Avatar', color: 'bg-red-500' },
  // ... more avatars
];
```

### Modifying Letter Distribution
Edit `apps/api/src/dictionary/dictionary.service.ts`:

```typescript
private commonLetters = ['A', 'B', 'C', /* ... */];
private rareLetters = ['Q', 'X', 'Z'];
```

### Adjusting Timer Settings
Edit `apps/api/src/match/match.service.ts`:

```typescript
calculateTimerForRound(round: number): number {
  const timer = 10 - (round - 1);
  return Math.max(3, timer);
}
```

## 🐛 Troubleshooting

### "next is not recognized"
Make sure you've installed dependencies:
```bash
cd apps/web
npm install
```

### Database Connection Error
Check your `.env` file and ensure PostgreSQL is running:
```bash
# Check PostgreSQL status
pg_isready

# Restart PostgreSQL (Windows)
net stop postgresql-x64-14
net start postgresql-x64-14
```

### Port Already in Use
Change the port in `.env` files:
```env
PORT=3002  # For API
```

### Prisma Errors
Regenerate Prisma client:
```bash
cd apps/api
npx prisma generate
npx prisma migrate dev
```

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Enjoy playing Word Arena! 🎉**
