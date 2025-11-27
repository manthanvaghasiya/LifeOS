const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Please add a goal title']
  },
  type: {
    type: String,
    enum: ['Long Term', 'Short Term'],
    default: 'Long Term'
  },
  // Amounts are now OPTIONAL (Only for Long Term)
  targetAmount: {
    type: Number,
    default: 0
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  // Deadline is crucial for Short Term
  deadline: {
    type: Date,
    required: false
  },
  color: {
    type: String,
    default: '#4F46E5'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Goal', GoalSchema);