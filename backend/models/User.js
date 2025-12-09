const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // --- GAMIFICATION STATS ---
  level: { type: Number, default: 1 },
  currentXP: { type: Number, default: 0 },
  requiredXP: { type: Number, default: 100 }, // XP needed for Level 2
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);