const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Allows parsing JSON body
app.use(cors()); // Allows Frontend to talk to Backend

// --- ROUTE HANDLERS ---
// 1. Authentication (Login/Signup)
app.use('/api/auth', require('./routes/auth'));

// 2. Transactions (Dashboard Finance)
app.use('/api/transactions', require('./routes/transactions'));

// 3. Habits (Daily Tracker)
app.use('/api/habits', require('./routes/habits'));

// 4. Goals (Long Term/Short Term) - CRITICAL FIX ✅
app.use('/api/goals', require('./routes/goals'));


// --- DATABASE CONNECTION ---
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// --- START SERVER ---
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});