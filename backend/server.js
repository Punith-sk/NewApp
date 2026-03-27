const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/trades', require('./routes/trades'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/posts', require('./routes/posts'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
