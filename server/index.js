require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowed =
      !origin ||
      origin === 'http://localhost:3000' ||
      /^chrome-extension:\/\//.test(origin) ||
      /^moz-extension:\/\//.test(origin);

    if (allowed) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth',  require('./routes/authRoutes'));
app.use('/api/vault', require('./routes/vaultRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SafeVault API is running' });
});

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`SafeVault server running on port ${PORT}`)))
  .catch((err) => { console.error('DB connection failed:', err); process.exit(1); });
