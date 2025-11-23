import { RateLimiterMemory } from "rate-limiter-flexible";
import env from "../config/env.js";

const rateLimiter = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMIT_POINTS ?? env.RATE_LIMIT_POINTS ?? "10"),
  duration: parseInt(process.env.RATE_LIMIT_DURATION ?? env.RATE_LIMIT_DURATION ?? "60")
});

export const rateLimit = (points = 1) => async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip, points);
    next();
  } catch (err) {
    res.status(429).json({ message: "Too many requests" });
  }
};
