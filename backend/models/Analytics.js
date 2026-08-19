const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  dailyStats: [{
    date: Date,
    productivity: Number, // 0-100
    restScore: Number, // 0-100
    sleepQuality: Number, // 0-100
    stressLevel: Number, // 0-100
    totalActiveMinutes: Number,
    totalRestMinutes: Number,
    activitiesCount: Number,
    averageDuration: Number,
    categories: {
      work: Number,
      exercise: Number,
      leisure: Number,
      selfcare: Number,
      social: Number,
      education: Number
    }
  }],
  weeklyStats: [{
    weekStart: Date,
    weekEnd: Date,
    averageProductivity: Number,
    averageRest: Number,
    averageSleep: Number,
    totalActivities: Number,
    trends: {
      productivity: Number, // percentage change
      rest: Number,
      sleep: Number
    },
    bestDay: Date,
    worstDay: Date
  }],
  monthlyStats: [{
    month: String, // YYYY-MM
    averageProductivity: Number,
    averageRest: Number,
    averageSleep: Number,
    totalActivities: Number,
    consistency: Number // 0-100
  }],
  aiInsights: [{
    date: Date,
    type: String, // 'productivity', 'sleep', 'stress', 'recommendation'
    title: String,
    description: String,
    recommendation: String,
    priority: Number // 1-5
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);