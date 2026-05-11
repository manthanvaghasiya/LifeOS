const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assetName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    default: 'Other'
  },
  currentValue: {
    type: Number,
    required: true,
    default: 0
  },
  targetPurchasePrice: {
    type: Number,
    default: null
  },
  quantity: {
    type: Number,
    default: 1
  },
  priceHistory: [
    {
      date: {
        type: Date,
        required: true,
        default: Date.now
      },
      recordedPrice: {
        type: Number,
        required: true
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Asset', AssetSchema);
