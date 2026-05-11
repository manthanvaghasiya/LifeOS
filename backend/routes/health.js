const express = require('express');
const router = express.Router();
const Health = require('../models/Health');
const { protect } = require('../middleware/authMiddleware');

// Utility to get today's midnight UTC
const getTodayMidnight = () => {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    return d;
};

// @route   GET /api/health/today
// @desc    Get user's health data for today
// @access  Private
router.get('/today', protect, async (req, res) => {
    try {
        const today = getTodayMidnight();
        
        let healthData = await Health.findOne({
            user: req.user._id,
            date: today
        });

        if (!healthData) {
            // Return default structure if no data exists for today
            healthData = {
                dailyCalorieGoal: 2000,
                caloriesConsumed: 0,
                caloriesBurned: 0,
                totalSteps: 0,
                dailyStepGoal: 10000,
                workoutDuration: 0,
                weight: null
            };
        }

        res.json(healthData);
    } catch (err) {
        console.error('Error fetching today health:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/health/history
// @desc    Get user's health history (last 30 days)
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setUTCHours(0, 0, 0, 0);

        const history = await Health.find({
            user: req.user._id,
            date: { $gte: thirtyDaysAgo }
        }).sort({ date: 1 }); // Oldest to newest

        res.json(history);
    } catch (err) {
        console.error('Error fetching health history:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/health/today
// @desc    Create or update today's health metrics
// @access  Private
router.post('/today', protect, async (req, res) => {
    try {
        const today = getTodayMidnight();
        
        // Destructure safe fields to prevent mass assignment vulnerabilities
        const {
            dailyCalorieGoal,
            caloriesConsumed,
            caloriesBurned,
            totalSteps,
            dailyStepGoal,
            workoutDuration,
            weight
        } = req.body;

        const updateData = {};
        if (dailyCalorieGoal !== undefined) updateData.dailyCalorieGoal = dailyCalorieGoal;
        if (caloriesConsumed !== undefined) updateData.caloriesConsumed = caloriesConsumed;
        if (caloriesBurned !== undefined) updateData.caloriesBurned = caloriesBurned;
        if (totalSteps !== undefined) updateData.totalSteps = totalSteps;
        if (dailyStepGoal !== undefined) updateData.dailyStepGoal = dailyStepGoal;
        if (workoutDuration !== undefined) updateData.workoutDuration = workoutDuration;
        if (weight !== undefined) updateData.weight = weight;

        // Upsert logic: Update if exists for today, otherwise create new
        const healthData = await Health.findOneAndUpdate(
            { user: req.user._id, date: today },
            { $set: updateData },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(healthData);
    } catch (err) {
        console.error('Error updating health data:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
