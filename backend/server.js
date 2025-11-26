// File: backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load config
dotenv.config();

const app = express();

// Middleware (Allows us to read JSON and talk to React)
app.use(express.json());
app.use(cors());

// Import Model
const Transaction = require('./models/Transaction');

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

// --- API ROUTES (The Endpoints) ---

// 1. GET all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 }); // Newest first
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// 2. ADD a transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;
    
    const transaction = await Transaction.create({
      title,
      amount,
      type,
      category,
      date
    });

    res.status(201).json(transaction);
  } catch (err) {
    if(err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ error: messages });
    }
    res.status(500).json({ error: 'Server Error' });
  }
});

// 3. DELETE a transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ error: 'No transaction found' });
    }

    await transaction.deleteOne();

    res.status(200).json({ success: true, message: 'Transaction removed' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;

// Connect to DB then start listening
connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});