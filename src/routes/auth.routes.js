import { Router } from "express";
import * as AuthController from "../controllers/auth.controller.js";
import { rateLimit } from "../middlewares/rateLimitMiddleware.js";

const router = Router();

router.post("/register", rateLimit(1), AuthController.register);
router.get("/verify", AuthController.verify);
router.post("/login", rateLimit(1), AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);
router.post("/forgot-password", rateLimit(1), AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

export default router;
