import * as AuthService from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const user = await AuthService.register(req.body);
    res.json({ message: "Registered. Check email to verify.", user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const verify = async (req, res) => {
  try {
    const token = req.query.token || req.params.token;
    await AuthService.verifyEmail(token);
    res.json({ message: "Email verified" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { accessToken, refreshToken, user } = await AuthService.login({
      ...req.body,
      ip: req.ip,
      userAgent: req.headers["user-agent"]
    });
    res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const { accessToken } = await AuthService.refresh(req.body.refreshToken);
    res.json({ accessToken });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    await AuthService.logout(req.body.refreshToken);
    res.json({ message: "Logged out" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    await AuthService.requestPasswordReset(req.body.email);
    res.json({ message: "If email exists, reset link sent" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await AuthService.resetPassword(token, newPassword);
    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
