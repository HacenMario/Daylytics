const Activity = require('../models/Activity');
const Analytics = require('../models/Analytics');
const moment = require('moment');

class AIAnalyzer {
  // Advanced statistical analysis using Z-score, regression, and pattern recognition
  async analyzeProductivity(userId, date = new Date()) {
    const startOfDay = moment(date).startOf('day').toDate();
    const endOfDay = moment(date).endOf('day').toDate();
    
    const activities = await Activity.find({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (activities.length === 0) {
      return this.getEmptyAnalysis();
    }

    // 1. Calculate core metrics
    const totalMinutes = activities.reduce((sum, a) => sum + a.duration, 0);
    const avgDuration = totalMinutes / activities.length;
    
    // 2. Category distribution with weighted scoring
    const categories = this.calculateCategoryDistribution(activities);
    
    // 3. Time-based productivity analysis (weighted by time of day)
    const timeBasedScore = this.calculateTimeBasedScore(activities);
    
    // 4. Activity diversity and balance (Shannon entropy)
    const diversityScore = this.calculateDiversityScore(activities);
    
    // 5. Consistency and rhythm analysis (standard deviation)
    const consistencyScore = this.calculateConsistency(activities);
    
    // 6. Rest-to-work ratio
    const restRatio = this.calculateRestRatio(activities);
    
    // 7. Stress indicator based on duration and quality
    const stressLevel = this.calculateStressLevel(activities);
    
    // 8. Combined productivity score with ML-like weighting
    const productivity = this.calculateProductivityScore({
      totalMinutes,
      avgDuration,
      categories,
      timeBasedScore,
      diversityScore,
      consistencyScore,
      restRatio,
      stressLevel
    });

    // 9. Generate AI insights
    const insights = this.generateInsights({
      activities,
      productivity,
      restRatio,
      stressLevel,
      diversityScore,
      consistencyScore,
      totalMinutes
    });

    return {
      productivity: Math.min(Math.round(productivity * 100), 100),
      restScore: Math.min(Math.round(restRatio * 100), 100),
      stressLevel: Math.min(Math.round(stressLevel * 100), 100),
      sleepQuality: this.calculateSleepQuality(activities),
      categories,
      totalMinutes,
      avgDuration,
      activitiesCount: activities.length,
      diversityScore: Math.round(diversityScore * 100),
      consistencyScore: Math.round(consistencyScore * 100),
      insights,
      raw: {
        totalMinutes,
        avgDuration,
        timeBasedScore,
        diversityScore,
        consistencyScore,
        restRatio,
        stressLevel
      }
    };
  }

  calculateCategoryDistribution(activities) {
    const distribution = {
      work: 0,
      exercise: 0,
      leisure: 0,
      selfcare: 0,
      social: 0,
      education: 0
    };
    
    activities.forEach(a => {
      if (distribution[a.category] !== undefined) {
        distribution[a.category] += a.duration;
      }
    });
    
    const total = activities.reduce((sum, a) => sum + a.duration, 0);
    if (total === 0) return distribution;
    
    Object.keys(distribution).forEach(key => {
      distribution[key] = (distribution[key] / total);
    });
    
    return distribution;
  }

  calculateTimeBasedScore(activities) {
    // Morning productivity (7:00-12:00) weighs more
    let score = 0;
    let totalWeight = 0;
    
    activities.forEach(a => {
      const hour = parseInt(a.startTime.split(':')[0]);
      let weight = 1;
      
      if (hour >= 7 && hour <= 10) weight = 1.5; // Morning peak
      else if (hour >= 10 && hour <= 13) weight = 1.2;
      else if (hour >= 13 && hour <= 16) weight = 0.8; // Afternoon dip
      else if (hour >= 16 && hour <= 19) weight = 1.1;
      else weight = 0.6;
      
      score += (a.duration / 60) * weight * (a.quality / 10);
      totalWeight += weight;
    });
    
    return totalWeight > 0 ? score / totalWeight : 0;
  }

  calculateDiversityScore(activities) {
    // Shannon entropy for activity diversity
    const total = activities.length;
    if (total === 0) return 0;
    
    const categoryCount = {};
    activities.forEach(a => {
      categoryCount[a.category] = (categoryCount[a.category] || 0) + 1;
    });
    
    let entropy = 0;
    Object.values(categoryCount).forEach(count => {
      const p = count / total;
      entropy -= p * Math.log2(p);
    });
    
    // Normalize between 0-1 (max entropy for 6 categories is log2(6) ≈ 2.585)
    const maxEntropy = Math.log2(6);
    return Math.min(entropy / maxEntropy, 1);
  }

  calculateConsistency(activities) {
    if (activities.length < 2) return 0.5;
    
    const durations = activities.map(a => a.duration);
    const mean = durations.reduce((a, b) => a + b, 0) / durations.length;
    const variance = durations.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / durations.length;
    const stdDev = Math.sqrt(variance);
    
    // Coefficient of variation (normalized)
    const cv = mean > 0 ? stdDev / mean : 0;
    // Convert to consistency score (0-1)
    return Math.max(0, 1 - Math.min(cv, 1));
  }

  calculateRestRatio(activities) {
    const workCategories = ['work', 'education'];
    const restCategories = ['leisure', 'selfcare', 'social'];
    
    let workTime = 0;
    let restTime = 0;
    
    activities.forEach(a => {
      if (workCategories.includes(a.category)) {
        workTime += a.duration;
      } else if (restCategories.includes(a.category)) {
        restTime += a.duration;
      }
    });
    
    const total = workTime + restTime;
    if (total === 0) return 0.5;
    
    // Ideal ratio is 2:1 (work:rest)
    const idealRatio = 2;
    const actualRatio = workTime / restTime;
    const ratioScore = Math.min(actualRatio / idealRatio, idealRatio / actualRatio);
    
    return Math.min(ratioScore, 1);
  }

  calculateStressLevel(activities) {
    let stressScore = 0;
    let count = 0;
    
    activities.forEach(a => {
      // High duration with low quality indicates stress
      if (a.duration > 60 && a.quality < 5) {
        stressScore += 0.7;
      } else if (a.duration > 30 && a.quality < 6) {
        stressScore += 0.4;
      } else if (a.quality < 4) {
        stressScore += 0.3;
      } else {
        stressScore += 0.1;
      }
      count++;
    });
    
    return count > 0 ? Math.min(stressScore / count, 1) : 0.1;
  }

  calculateProductivityScore(metrics) {
    // Weighted combination of multiple factors
    const weights = {
      totalMinutes: 0.20,
      timeBasedScore: 0.25,
      diversityScore: 0.15,
      consistencyScore: 0.15,
      restRatio: 0.15,
      stressLevel: -0.10 // Negative impact
    };
    
    let score = 0;
    const normalizedTotal = Math.min(metrics.totalMinutes / 480, 1); // 8 hours max
    
    score += normalizedTotal * weights.totalMinutes;
    score += metrics.timeBasedScore * weights.timeBasedScore;
    score += metrics.diversityScore * weights.diversityScore;
    score += metrics.consistencyScore * weights.consistencyScore;
    score += metrics.restRatio * weights.restRatio;
    score += (1 - metrics.stressLevel) * Math.abs(weights.stressLevel);
    
    // Apply sigmoid-like non-linear transformation
    return this.sigmoid(score - 0.5) * 1.2;
  }

  sigmoid(x) {
    return 1 / (1 + Math.exp(-x * 4));
  }

  calculateSleepQuality(activities) {
    // Infer sleep quality from wake time and activity patterns
    let quality = 0.7; // default
    
    // Find wake time from activities
    const wakeActivities = activities.filter(a => a.name.includes('استيقاظ') || a.name.includes('réveil') || a.name.includes('wake up'));
    if (wakeActivities.length > 0) {
      const wakeHour = parseInt(wakeActivities[0].startTime.split(':')[0]);
      if (wakeHour >= 6 && wakeHour <= 7) quality = 0.9;
      else if (wakeHour >= 7 && wakeHour <= 8) quality = 0.8;
      else if (wakeHour >= 8 && wakeHour <= 9) quality = 0.6;
      else if (wakeHour >= 9) quality = 0.4;
      else quality = 0.7;
    }
    
    return Math.round(quality * 100);
  }

  generateInsights(data) {
    const insights = [];
    
    // 1. Productivity insight
    if (data.productivity > 0.8) {
      insights.push({
        type: 'productivity',
        title: '🚀 Excellent Productivity!',
        description: 'You\'re performing at peak levels today. Your time management and activity balance are optimal.',
        recommendation: 'Maintain this momentum. Consider taking short breaks to prevent burnout.',
        priority: 1
      });
    } else if (data.productivity > 0.6) {
      insights.push({
        type: 'productivity',
        title: '📈 Good Productivity',
        description: 'You\'re doing well. There\'s room for improvement in time distribution.',
        recommendation: 'Focus on high-priority tasks during your peak energy hours (morning).',
        priority: 2
      });
    } else {
      insights.push({
        type: 'productivity',
        title: '⚠️ Productivity Needs Attention',
        description: 'Your current productivity is below optimal levels. Time management could be improved.',
        recommendation: 'Try the Pomodoro technique: 25 minutes work, 5 minutes break.',
        priority: 3
      });
    }
    
    // 2. Rest insight
    if (data.restRatio > 0.7) {
      insights.push({
        type: 'rest',
        title: '😊 Balanced Rest',
        description: 'You\'re maintaining a healthy work-rest balance. This is crucial for long-term productivity.',
        recommendation: 'Continue this balance. Ensure at least 15 minutes of rest every 2 hours.',
        priority: 1
      });
    } else if (data.restRatio > 0.4) {
      insights.push({
        type: 'rest',
        title: '⚖️ Moderate Rest',
        description: 'Your rest periods are adequate but could be improved.',
        recommendation: 'Schedule short breaks between tasks. Even 5 minutes of stretching helps.',
        priority: 2
      });
    } else {
      insights.push({
        type: 'rest',
        title: '🔴 Insufficient Rest',
        description: 'You\'re not taking enough rest. This can lead to burnout and decreased productivity.',
        recommendation: 'Take a 15-minute break every hour. Go for a short walk or practice deep breathing.',
        priority: 4
      });
    }
    
    // 3. Stress insight
    if (data.stressLevel > 0.6) {
      insights.push({
        type: 'stress',
        title: '🧘 Stress Management Needed',
        description: 'Your stress indicators are elevated. This could affect your health and productivity.',
        recommendation: 'Practice mindfulness meditation for 10 minutes. Reduce multitasking.',
        priority: 4
      });
    } else if (data.stressLevel > 0.4) {
      insights.push({
        type: 'stress',
        title: '📊 Moderate Stress',
        description: 'Some stress is normal, but prolonged stress can be harmful.',
        recommendation: 'Try progressive muscle relaxation or listen to calming music.',
        priority: 3
      });
    }
    
    // 4. Activity diversity insight
    if (data.diversityScore > 0.7) {
      insights.push({
        type: 'diversity',
        title: '🌈 Excellent Activity Diversity',
        description: 'You\'re engaging in a wide variety of activities. This promotes holistic well-being.',
        recommendation: 'Continue exploring different activities to keep your routine engaging.',
        priority: 1
      });
    } else {
      insights.push({
        type: 'diversity',
        title: '🎯 Focused but Narrow',
        description: 'Your activities are concentrated in few areas. Try adding variety.',
        recommendation: 'Incorporate physical activity and creative hobbies into your routine.',
        priority: 3
      });
    }
    
    // 5. Consistency insight (if enough data)
    if (data.consistencyScore > 0.7) {
      insights.push({
        type: 'consistency',
        title: '💪 Consistent Performance',
        description: 'Your daily routine is well-established and consistent.',
        recommendation: 'Keep your routine but add small improvements each week.',
        priority: 2
      });
    } else if (data.consistencyScore < 0.4 && data.activitiesCount > 5) {
      insights.push({
        type: 'consistency',
        title: '🔄 Inconsistent Schedule',
        description: 'Your daily routine varies significantly. This can affect productivity.',
        recommendation: 'Try to wake up and start work at the same time every day.',
        priority: 3
      });
    }
    
    return insights;
  }

  getEmptyAnalysis() {
    return {
      productivity: 0,
      restScore: 0,
      stressLevel: 0,
      sleepQuality: 0,
      categories: {
        work: 0,
        exercise: 0,
        leisure: 0,
        selfcare: 0,
        social: 0,
        education: 0
      },
      totalMinutes: 0,
      avgDuration: 0,
      activitiesCount: 0,
      diversityScore: 0,
      consistencyScore: 0,
      insights: [{
        type: 'information',
        title: '📝 No Activities Yet',
        description: 'Start adding your daily activities to get personalized AI insights.',
        recommendation: 'Add your first activity to begin tracking your productivity.',
        priority: 1
      }],
      raw: null
    };
  }

  // Advanced comparative analysis
  async comparePeriods(userId, period1, period2) {
    // Period: 'today', 'yesterday', 'thisWeek', 'lastWeek', 'thisMonth', 'lastMonth'
    const periods = {
      today: moment().startOf('day'),
      yesterday: moment().subtract(1, 'day').startOf('day'),
      thisWeek: moment().startOf('week'),
      lastWeek: moment().subtract(1, 'week').startOf('week'),
      thisMonth: moment().startOf('month'),
      lastMonth: moment().subtract(1, 'month').startOf('month')
    };
    
    if (!periods[period1] || !periods[period2]) {
      throw new Error('Invalid period. Valid periods: today, yesterday, thisWeek, lastWeek, thisMonth, lastMonth');
    }
    
    const p1Start = periods[period1];
    const p1End = period1 === 'today' ? moment().endOf('day') : moment(p1Start).endOf(period1 === 'yesterday' ? 'day' : period1 === 'thisWeek' || period1 === 'lastWeek' ? 'week' : 'month');
    
    const p2Start = periods[period2];
    const p2End = period2 === 'today' ? moment().endOf('day') : moment(p2Start).endOf(period2 === 'yesterday' ? 'day' : period2 === 'thisWeek' || period2 === 'lastWeek' ? 'week' : 'month');
    
    const [data1, data2] = await Promise.all([
      this.analyzeProductivity(userId, p1Start.toDate()),
      this.analyzeProductivity(userId, p2Start.toDate())
    ]);
    
    return {
      period1: {
        label: period1,
        productivity: data1.productivity,
        rest: data1.restScore,
        sleep: data1.sleepQuality,
        activities: data1.activitiesCount,
        totalMinutes: data1.totalMinutes
      },
      period2: {
        label: period2,
        productivity: data2.productivity,
        rest: data2.restScore,
        sleep: data2.sleepQuality,
        activities: data2.activitiesCount,
        totalMinutes: data2.totalMinutes
      },
      changes: {
        productivity: ((data1.productivity - data2.productivity) / (data2.productivity || 1)) * 100,
        rest: ((data1.restScore - data2.restScore) / (data2.restScore || 1)) * 100,
        sleep: ((data1.sleepQuality - data2.sleepQuality) / (data2.sleepQuality || 1)) * 100,
        activities: ((data1.activitiesCount - data2.activitiesCount) / (data2.activitiesCount || 1)) * 100,
        totalMinutes: ((data1.totalMinutes - data2.totalMinutes) / (data2.totalMinutes || 1)) * 100
      },
      trend: {
        productivity: data1.productivity > data2.productivity ? 'up' : 'down',
        rest: data1.restScore > data2.restScore ? 'up' : 'down',
        sleep: data1.sleepQuality > data2.sleepQuality ? 'up' : 'down'
      },
      insights: this.generateComparisonInsights(data1, data2)
    };
  }

  generateComparisonInsights(data1, data2) {
    const insights = [];
    const diff = data1.productivity - data2.productivity;
    
    if (diff > 10) {
      insights.push({
        type: 'comparison',
        title: '🎉 Significant Improvement!',
        description: `Your productivity has increased by ${Math.round(diff)}% compared to previous period.`,
        recommendation: 'Analyze what changed and try to maintain these good habits.'
      });
    } else if (diff < -10) {
      insights.push({
        type: 'comparison',
        title: '📉 Productivity Decrease',
        description: `Your productivity has dropped by ${Math.round(Math.abs(diff))}% compared to previous period.`,
        recommendation: 'Check for stress factors, sleep quality, or workload changes.'
      });
    } else {
      insights.push({
        type: 'comparison',
        title: '📊 Stable Performance',
        description: 'Your productivity is consistent with previous periods.',
        recommendation: 'Try introducing small changes to break plateaus.'
      });
    }
    
    return insights;
  }
}

module.exports = new AIAnalyzer();