const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many attempts. Please try again in 15 minutes.' }
});

const lookupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts. Please try again in 15 minutes.' }
});

const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: 'Too many booking attempts. Please try again later.' }
});

module.exports = { authLimiter, lookupLimiter, bookingLimiter };