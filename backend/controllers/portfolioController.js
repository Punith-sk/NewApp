const Portfolio = require('../models/Portfolio');

const PRICES = {
  AAPL: 175, GOOGL: 2800, MSFT: 380, TSLA: 250,
  AMZN: 185, RELIANCE: 2500, TCS: 3700, INFY: 1500,
  HDFC: 1650, WIPRO: 450
};

const getPortfolio = async (req, res) => {
  try {
    const holdings = await Portfolio.find({ user: req.user });

    let totalInvestment = 0;
    let totalCurrentValue = 0;

    const enriched = holdings.map((h) => {
      const currentPrice = PRICES[h.symbol] || 0;
      const investment = h.avgPrice * h.quantity;
      const currentValue = currentPrice * h.quantity;
      const pnl = currentValue - investment;

      totalInvestment += investment;
      totalCurrentValue += currentValue;

      return {
        symbol: h.symbol,
        quantity: h.quantity,
        avgPrice: h.avgPrice,
        currentPrice,
        investment,
        currentValue,
        pnl
      };
    });

    res.json({
      holdings: enriched,
      totalInvestment,
      totalCurrentValue,
      totalPnL: totalCurrentValue - totalInvestment
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPortfolio };
