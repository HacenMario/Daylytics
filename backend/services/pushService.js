const webpush = require('../config/vapid');
const User = require('../models/User');

class PushService {
  async sendNotification(userId, title, body, data = {}) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.pushSubscription) return false;
      
      const payload = JSON.stringify({
        title,
        body,
        icon: '/icon.png',
        badge: '/badge.png',
        data: {
          url: '/dashboard',
          ...data
        }
      });
      
      await webpush.sendNotification(user.pushSubscription, payload);
      return true;
    } catch (error) {
      console.error('Push notification error:', error);
      return false;
    }
  }

  async sendProductivityAlert(userId, productivity) {
    let title, body, data;
    
    if (productivity < 40) {
      title = '⚠️ Low Productivity Alert';
      body = 'Your productivity is below 40%. Consider taking a break or changing your approach.';
      data = { type: 'alert' };
    } else if (productivity > 80) {
      title = '🌟 Excellent Productivity!';
      body = 'You\'re performing at your best. Keep up the great work!';
      data = { type: 'celebration' };
    } else {
      title = '📊 Daily Productivity Update';
      body = `Your productivity score today is ${Math.round(productivity)}%.`;
      data = { type: 'update' };
    }
    
    return this.sendNotification(userId, title, body, data);
  }

  async sendDailyReminder(userId) {
    const title = '🌅 Start Your Day';
    const body = 'Don\'t forget to log your activities and track your productivity today!';
    return this.sendNotification(userId, title, body, { type: 'reminder' });
  }

  async sendRestReminder(userId) {
    const title = '🧘 Take a Break';
    const body = 'You\'ve been working for a while. Take 5 minutes to rest and recharge.';
    return this.sendNotification(userId, title, body, { type: 'rest' });
  }
}

module.exports = new PushService();