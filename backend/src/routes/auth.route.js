import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { authLimiter, protectedLimiter } from "../middleware/rateLimiter.middleware.js";

const router = express.Router();

// Strict rate limiting for auth endpoints (5 requests per 15 min)
router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/logout", logout);

// Protected routes with lenient rate limiting (200 requests per 15 min)
router.put("/update-profile", protectRoute, protectedLimiter, updateProfile);

router.get("/check", protectRoute, protectedLimiter, (req, res) => {
  res.status(200).json({ user: req.user });
});

export default router;
