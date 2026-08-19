const express = require('express');
const Activity = require('../models/Activity');
const AIAnalyzer = require('../services/aiAnalyzer');
const PushService = require('../services/pushService');
const auth = require('../middleware/auth');
const router = express.Router();

// Add activity
router.post('/add', auth, async (req, res) => {
  try {
    const { name, duration, startTime, wakeTime, category, quality, notes } = req.body;
    
    const activity = new Activity({
      user: req.userId,
      name,
      duration: parseInt(duration),
      startTime: startTime || new Date().toTimeString().slice(0, 5),
      wakeTime: wakeTime || req.user.wakeTime || '07:00',
      category: category || 'other',
      quality: quality || 5,
      notes: notes || ''
    });
    
    // Calculate end time
    const start = new Date(`1970-01-01T${activity.startTime}`);
    const end = new Date(start.getTime() + activity.duration * 60000);
    activity.endTime = end.toTimeString().slice(0, 5);
    
    await activity.save();
    
    // Send push notification for productivity alert
    const analysis = await AIAnalyzer.analyzeProductivity(req.userId);
    await PushService.sendProductivityAlert(req.userId, analysis.productivity);
    
    res.status(201).json({
      success: true,
      activity,
      analysis
    });
  } catch (error) {
    console.error('Add activity error:', error);
    res.status(500).json({ error: 'Failed to add activity' });
  }
});

// Get today's activities
router.get('/today', auth, async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const activities = await Activity.find({
      user: req.userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ startTime: 1 });
    
    res.json({ activities });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// Delete activity
router.delete('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    res.json({ success: true, activity });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

// Get activities by date range
router.get('/range', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    const activities = await Activity.find({
      user: req.userId,
      date: { $gte: start, $lte: end }
    }).sort({ date: -1, startTime: 1 });
    
    res.json({ activities });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities range' });
  }
});

module.exports = router;