const User = require('../models/User');
const Portfolio = require('../models/Portfolio');

const PRICES = {
  AAPL: 175, GOOGL: 2800, MSFT: 380, TSLA: 250,
  AMZN: 185, RELIANCE: 2500, TCS: 3700, INFY: 1500,
  HDFC: 1650, WIPRO: 450
};

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({}, 'name balance initialBalance');

    const leaderboard = await Promise.all(
      users.map(async (user) => {
        const holdings = await Portfolio.find({ user: user._id });
        const portfolioValue = holdings.reduce((sum, h) => {
          const price = PRICES[h.symbol] || 0;
          return sum + price * h.quantity;
        }, 0);

        const totalValue = user.balance + portfolioValue;
        const profitPct = ((totalValue - user.initialBalance) / user.initialBalance) * 100;

        return {
          id: user._id,
          name: user.name,
          balance: user.balance,
          portfolioValue,
          totalValue,
          profitPct: parseFloat(profitPct.toFixed(2))
        };
      })
    );

    leaderboard.sort((a, b) => b.profitPct - a.profitPct);

    res.json(leaderboard.slice(0, 20));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getLeaderboard };
