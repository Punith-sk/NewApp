const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  type: { type: String, enum: ['buy', 'sell'], required: true },
  status: { type: String, default: 'completed' }
}, { timestamps: true });

module.exports = mongoose.model('Trade', tradeSchema);
