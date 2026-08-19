class RecommendationEngine {
  generateRecommendations(analysis, userProfile) {
    const recommendations = [];
    
    // Based on productivity score
    if (analysis.productivity < 50) {
      recommendations.push({
        category: 'productivity',
        title: 'Boost Your Productivity',
        description: 'Implement the "5-minute rule" to overcome procrastination.',
        action: 'Set a timer and start a task for just 5 minutes. Often, you\'ll continue after starting.',
        priority: 'high'
      });
    }
    
    // Based on rest score
    if (analysis.restScore < 40) {
      recommendations.push({
        category: 'rest',
        title: 'Increase Your Rest',
        description: 'You\'re not getting enough rest. Even 5-minute breaks are valuable.',
        action: 'Schedule short breaks every 30 minutes. Stand up and stretch.',
        priority: 'high'
      });
    }
    
    // Based on stress level
    if (analysis.stressLevel > 60) {
      recommendations.push({
        category: 'stress',
        title: 'Reduce Stress Levels',
        description: 'High stress affects both health and productivity.',
        action: 'Try box breathing: 4-4-4-4 (inhale-hold-exhale-hold).',
        priority: 'critical'
      });
    }
    
    // Based on category distribution
    const workTime = analysis.categories.work || 0;
    const exerciseTime = analysis.categories.exercise || 0;
    const leisureTime = analysis.categories.leisure || 0;
    
    if (workTime > 0.5 && exerciseTime < 0.1) {
      recommendations.push({
        category: 'balance',
        title: 'Balance Work and Exercise',
        description: 'You\'re spending too much time on work with little physical activity.',
        action: 'Start with 10 minutes of exercise daily. Gradually increase.',
        priority: 'medium'
      });
    }
    
    if (leisureTime > 0.4 && workTime < 0.3) {
      recommendations.push({
        category: 'focus',
        title: 'Increase Focus on Work',
        description: 'Your work-time ratio is low. Try to prioritize important tasks.',
        action: 'Use the Eisenhower Matrix to prioritize your tasks.',
        priority: 'medium'
      });
    }
    
    // Personalized recommendations based on time
    const currentHour = new Date().getHours();
    if (currentHour >= 9 && currentHour <= 11) {
      recommendations.push({
        category: 'timing',
        title: '🌅 Peak Energy Hour',
        description: 'You\'re in your morning energy peak. Use this time for complex tasks.',
        action: 'Tackle your most challenging task right now.',
        priority: 'high'
      });
    } else if (currentHour >= 14 && currentHour <= 16) {
      recommendations.push({
        category: 'timing',
        title: '🌄 Afternoon Dip',
        description: 'Energy levels often dip in the afternoon. Take a short walk or stretch.',
        action: 'Take a 15-minute power nap or go for a short walk outside.',
        priority: 'medium'
      });
    }
    
    // Sleep recommendation
    if (analysis.sleepQuality < 60) {
      recommendations.push({
        category: 'sleep',
        title: 'Improve Sleep Quality',
        description: 'Poor sleep affects productivity. Your sleep quality is below optimal.',
        action: 'Try to maintain a consistent sleep schedule. Avoid screens 1 hour before bed.',
        priority: 'high'
      });
    }
    
    return recommendations;
  }

  getSmartSuggestions(activities) {
    const suggestions = [];
    
    // Activity variety suggestions
    const categories = activities.map(a => a.category);
    const uniqueCategories = new Set(categories);
    
    if (uniqueCategories.size < 3) {
      suggestions.push({
        type: 'variety',
        suggestion: 'Try adding more variety to your day. Consider exercise or creative activities.'
      });
    }
    
    // Duration suggestions
    const avgDuration = activities.reduce((sum, a) => sum + a.duration, 0) / activities.length;
    if (avgDuration > 60) {
      suggestions.push({
        type: 'duration',
        suggestion: 'Your average activity duration is long. Consider breaking large tasks into smaller chunks.'
      });
    }
    
    // Time of day suggestions
    const morningActivities = activities.filter(a => parseInt(a.startTime.split(':')[0]) < 12);
    if (morningActivities.length < 2) {
      suggestions.push({
        type: 'morning',
        suggestion: 'Try to be more productive in the morning when your energy is highest.'
      });
    }
    
    return suggestions;
  }
}

module.exports = new RecommendationEngine();