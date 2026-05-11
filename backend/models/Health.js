const mongoose = require('mongoose');

const HealthSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    // Typically normalized to midnight (00:00:00) to ensure one record per day
  },
  dailyCalorieGoal: {
    type: Number,
    default: 2000,
  },
  caloriesConsumed: {
    type: Number,
    default: 0,
  },
  caloriesBurned: {
    type: Number,
    default: 0,
  },
  totalSteps: {
    type: Number,
    default: 0,
  },
  dailyStepGoal: {
    type: Number,
    default: 10000,
  },
  workoutDuration: {
    type: Number,
    default: 0, // in minutes
  },
  weight: {
    type: Number,
    // Optional, user might not log weight every day
  }
}, { timestamps: true });

// Ensure only one health record exists per user per day
HealthSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Health', HealthSchema);
