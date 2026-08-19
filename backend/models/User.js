const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    default: 'User'
  },
  preferredLanguage: {
    type: String,
    enum: ['ar', 'fr', 'en'],
    default: 'ar'
  },
  pushSubscription: {
    type: Object,
    default: null
  },
  wakeTime: {
    type: String,
    default: '07:00'
  },
  sleepTime: {
    type: String,
    default: '23:00'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);