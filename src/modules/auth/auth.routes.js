import { Router } from "express";
import * as AuthService from "./auth.service.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const user = await AuthService.register(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { accessToken, refreshToken, user } = await AuthService.login({
      ...req.body,
      ip: req.ip,
      userAgent: req.headers["user-agent"]
    });

    res.json({ accessToken, refreshToken, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const { accessToken } = await AuthService.refresh(req.body.refreshToken);
    res.json({ accessToken });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/verify", async (req, res) => {
  try {
    const token = req.query.token;
    await AuthService.verifyEmail(token);
    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    await AuthService.requestPasswordReset(req.body.email);
    res.json({ message: "If email exists, reset link sent" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await AuthService.resetPassword(token, newPassword);
    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
