const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/tasks');

dotenv.config();
const app = express();

// Trust the hosting proxy (Render/Vercel) so rate limiting sees the real client IP
app.set('trust proxy', 1);

// Security HTTP headers
app.use(helmet());

app.use(express.json({ limit: '1mb' }));

// --- CORS: only allow our own frontend(s) ---
// Set CLIENT_URL in .env, comma-separated for multiple origins.
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients, allowedOrigins, or any Vercel preview/production domain
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('vercel.app')) {
        return callback(null, true);
      }
      // If not allowed, just pass false so it fails standard CORS, instead of throwing a 500 error
      return callback(null, false);
    },
    credentials: true,
  })
);

// --- Rate limiting ---
// General limiter for the whole API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Stricter limiter for auth routes (brute-force / signup-spam protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', authLimiter);

// Keep Alive Route
app.get('/ping', (req, res) => {
  res.send('Pong! Server is awake.');
});

// ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/habits', require('./routes/habits')); // <--- CHECK THIS LINE
app.use('/api/goals', require('./routes/goals'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/tasks', taskRoutes);
app.use('/api/users', require('./routes/users'));
app.use('/api/health', require('./routes/health'));
app.use('/api/assets', require('./routes/assets'));

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

connectDB();

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

// Force update for Goals feature