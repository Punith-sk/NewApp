# TradersHub — Paper Trading Platform

A full-stack paper trading platform where users start with ₹1,00,000 virtual cash and can trade stocks, track their portfolio, compete on a leaderboard, and share ideas in the community.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Auth
- **Frontend**: React 18, Vite, React Router v6, Axios

## Features

- 🔐 JWT-based authentication (register / login)
- 📈 Buy & sell 10 popular stocks (US & Indian markets)
- 💼 Portfolio tracker with P&L per holding
- 🏆 Leaderboard ranked by profit %
- 💬 Community feed for sharing trading insights

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB running locally (or a MongoDB Atlas URI)

### Backend

```bash
cd backend
cp .env.example .env          # fill in MONGO_URI & JWT_SECRET
npm install
npm run dev                   # starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                   # starts on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Create account |
| POST | /api/auth/login | — | Login |
| GET | /api/trades/my | ✅ | My trade history |
| POST | /api/trades/buy | ✅ | Buy a stock |
| POST | /api/trades/sell | ✅ | Sell a stock |
| GET | /api/portfolio | ✅ | Portfolio with P&L |
| GET | /api/leaderboard | — | Top 20 traders |
| GET | /api/posts | ✅ | Community posts |
| POST | /api/posts | ✅ | Create post |

## Available Stocks

AAPL · GOOGL · MSFT · TSLA · AMZN · RELIANCE · TCS · INFY · HDFC · WIPRO