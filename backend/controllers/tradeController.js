const User = require('../models/User');
const Trade = require('../models/Trade');
const Portfolio = require('../models/Portfolio');

const PRICES = {
  AAPL: 175, GOOGL: 2800, MSFT: 380, TSLA: 250,
  AMZN: 185, RELIANCE: 2500, TCS: 3700, INFY: 1500,
  HDFC: 1650, WIPRO: 450
};

const buyStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    const qty = Number(quantity);

    if (!symbol || !qty || qty <= 0) {
      return res.status(400).json({ message: 'Valid symbol and quantity are required' });
    }

    const price = PRICES[symbol];
    if (!price) {
      return res.status(400).json({ message: 'Invalid stock symbol' });
    }

    const user = await User.findById(req.user);
    const cost = price * qty;

    if (user.balance < cost) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    let holding = await Portfolio.findOne({ user: req.user, symbol });
    if (holding) {
      const newAvgPrice = (holding.quantity * holding.avgPrice + qty * price) / (holding.quantity + qty);
      holding.quantity += qty;
      holding.avgPrice = newAvgPrice;
    } else {
      holding = new Portfolio({ user: req.user, symbol, quantity: qty, avgPrice: price });
    }
    await holding.save();

    user.balance -= cost;
    await user.save();

    const trade = await Trade.create({ user: req.user, symbol, price, quantity: qty, type: 'buy' });

    res.json({ message: 'Buy order executed', trade, balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const sellStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    const qty = Number(quantity);

    if (!symbol || !qty || qty <= 0) {
      return res.status(400).json({ message: 'Valid symbol and quantity are required' });
    }

    const price = PRICES[symbol];
    if (!price) {
      return res.status(400).json({ message: 'Invalid stock symbol' });
    }

    const holding = await Portfolio.findOne({ user: req.user, symbol });
    if (!holding || holding.quantity < qty) {
      return res.status(400).json({ message: 'Insufficient shares to sell' });
    }

    const proceeds = price * qty;

    holding.quantity -= qty;
    if (holding.quantity === 0) {
      await holding.deleteOne();
    } else {
      await holding.save();
    }

    const user = await User.findById(req.user);
    user.balance += proceeds;
    await user.save();

    const trade = await Trade.create({ user: req.user, symbol, price, quantity: qty, type: 'sell' });

    res.json({ message: 'Sell order executed', trade, balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyTrades = async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(trades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { buyStock, sellStock, getMyTrades };
