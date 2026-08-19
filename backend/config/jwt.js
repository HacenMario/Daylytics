let secret = process.env.JWT_SECRET;

if (!secret) {
  console.warn('⚠️ JWT_SECRET not set in environment. Using an insecure development secret. Set JWT_SECRET in .env for production.');
  secret = 'daylytics-insecure-dev-secret';
}

module.exports = { JWT_SECRET: secret };
