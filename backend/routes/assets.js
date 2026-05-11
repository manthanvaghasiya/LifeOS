const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/assets
// @desc    Get all assets for a user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const assets = await Asset.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(assets);
    } catch (err) {
        console.error('Error fetching assets:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/assets
// @desc    Create a new asset tracker
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { assetName, category, currentValue, targetPurchasePrice, quantity } = req.body;

        const newAsset = new Asset({
            user: req.user._id,
            assetName,
            category: category || 'Other',
            currentValue: currentValue || 0,
            targetPurchasePrice: targetPurchasePrice || null,
            quantity: quantity || 1,
            priceHistory: [
                {
                    date: new Date(),
                    recordedPrice: currentValue || 0
                }
            ]
        });

        const asset = await newAsset.save();
        res.json(asset);
    } catch (err) {
        console.error('Error creating asset:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/assets/:id/price
// @desc    Update the current value of an asset and record history
// @access  Private
router.put('/:id/price', protect, async (req, res) => {
    try {
        const { newPrice } = req.body;

        if (newPrice === undefined) {
             return res.status(400).json({ message: 'New price is required' });
        }

        const asset = await Asset.findOne({ _id: req.params.id, user: req.user._id });

        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        // Update current value
        asset.currentValue = newPrice;

        // Ensure we don't spam multiple entries on the same day if they update twice
        // We'll just push a new entry for now to maintain a granular timeline,
        // or we could replace today's entry. Let's push to keep it simple and accurate.
        asset.priceHistory.push({
            date: new Date(),
            recordedPrice: newPrice
        });

        await asset.save();
        res.json(asset);
    } catch (err) {
        console.error('Error updating asset price:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/assets/:id
// @desc    Delete an asset tracker
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const asset = await Asset.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }
        res.json({ message: 'Asset removed' });
    } catch (err) {
        console.error('Error deleting asset:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
