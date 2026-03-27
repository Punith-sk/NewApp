const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { buyStock, sellStock, getMyTrades } = require('../controllers/tradeController');

router.use(protect);
router.post('/buy', buyStock);
router.post('/sell', sellStock);
router.get('/my', getMyTrades);

module.exports = router;
