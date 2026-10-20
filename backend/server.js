const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from backend/.env first, then fallback to root .env if present
dotenv.config({ path: path.resolve(__dirname, '.env') });
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

// --- MongoDB Serverless Connection Management ---
let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return mongoose.connection;

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing. Please set MONGO_URI in your environment variables.');
  }

  if (!cachedPromise) {
    cachedPromise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      })
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
      })
      .catch((error) => {
        cachedPromise = null;
        console.error(`MongoDB connection failed: ${error.message}`);
        throw error;
      });
  }

  return cachedPromise;
};

// Initiate connection eagerly
connectDB().catch(() => {});

// Middleware to ensure DB connection is ready before servicing API requests
app.use(async (req, res, next) => {
  // Allow health checks and ping to run without blocking on DB connection
  if (req.path === '/ping' || req.path === '/api/health') {
    return next();
  }

  try {
    await connectDB();
    next();
  } catch (error) {
    return res.status(503).json({
      message:
        'Database connection unavailable. ' +
        (process.env.MONGO_URI
          ? 'Could not connect to MongoDB Atlas. Ensure 0.0.0.0/0 is allowed in Atlas Network Access.'
          : 'MONGO_URI environment variable is not configured.'),
    });
  }
});

// ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));
app.use('/api/health', require('./routes/health'));
app.use('/api/assets', require('./routes/assets'));

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;