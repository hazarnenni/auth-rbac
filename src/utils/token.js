import jwt from "jsonwebtoken";
import crypto from "crypto";
import env from "../config/env.js";

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, env.jwtAccessSecret, { expiresIn: env.jwtAccessExpires });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.jwtAccessSecret);
};

export const generateRefreshTokenPlain = () => {
  return crypto.randomBytes(48).toString("hex");
};

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
