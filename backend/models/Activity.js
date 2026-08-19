const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['work', 'exercise', 'leisure', 'selfcare', 'social', 'education', 'other'],
    default: 'other'
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 1
  },
  startTime: {
    type: String, // HH:mm format
    required: true
  },
  endTime: {
    type: String // HH:mm format
  },
  wakeTime: {
    type: String, // HH:mm format
    required: true
  },
  quality: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  notes: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  dayOfWeek: {
    type: Number, // 0-6 (Sunday-Saturday)
    get: function() {
      return this.date.getDay();
    }
  }
});

// Index for efficient queries
ActivitySchema.index({ user: 1, date: -1 });
ActivitySchema.index({ user: 1, 'date': -1, 'dayOfWeek': 1 });

module.exports = mongoose.model('Activity', ActivitySchema);