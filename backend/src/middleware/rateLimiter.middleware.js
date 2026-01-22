import rateLimit from "express-rate-limit";
import { ipKeyGenerator } from "express-rate-limit";

// Common configuration options
const commonOptions = {
  standardHeaders: true,
  legacyHeaders: false,
};

// Global Rate Limiter - baseline protection for all routes
export const globalLimiter = rateLimit({
  ...commonOptions,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { message: "Too many requests. Please try again later." },
});

// API Rate Limiter - moderate limits for all /api routes
export const apiLimiter = rateLimit({
  ...commonOptions,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: "Too many API requests. Please try again later." },
});

// Auth Rate Limiter - strict limits for signup/login (brute force protection)
export const authLimiter = rateLimit({
  ...commonOptions,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: "Too many authentication attempts. Please try again later." },
});

// Protected Route Rate Limiter - lenient limits for authenticated users
export const protectedLimiter = rateLimit({
  ...commonOptions,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { message: "Too many requests. Please try again later." },

  keyGenerator: (req) => {
    // Prefer user ID for authenticated users
    if (req.user?._id) {
      return `user:${req.user._id.toString()}`;
    }

    // Fallback to IPv6-safe IP key
    return ipKeyGenerator(req);
  },
});
