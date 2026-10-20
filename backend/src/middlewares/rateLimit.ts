import rateLimit from 'express-rate-limit';

/** Brute-force protection for sign-in: 10 failed attempts per IP per 15 minutes. */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, error: 'Too many sign-in attempts. Please try again in 15 minutes.' },
});

/** General cap for the admin API. */
export const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please slow down.' },
});
