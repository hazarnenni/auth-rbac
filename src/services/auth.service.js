import bcrypt from "bcryptjs";
import prisma from "../database/prisma.js";
import { generateAccessToken, generateRefreshTokenPlain, hashToken } from "../utils/token.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import env from "../config/env.js";


export const register = async ({ email, password, name }) => {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error("Email already used");

  const hashed = await bcrypt.hash(password, 10);
  const token = crypto.randomBytes(32).toString("hex");

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
      emailVerificationToken: token
    }
  });

  const verifyUrl = `${env.frontUrl}/verify-email?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Verify your email",
    html: `<p>Click to verify: <a href="${verifyUrl}">${verifyUrl}</a></p>`
  });

  return user;
};

export const verifyEmail = async (token) => {
  const user = await prisma.user.findFirst({ where: { emailVerificationToken: token } });
  if (!user) throw new Error("Invalid token");
  return prisma.user.update({
    where: { id: user.id },
    data: { isEmailVerified: true, emailVerificationToken: null }
  });
};


export const login = async ({ email, password, ip, userAgent }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");
  if (!user.isEmailVerified) throw new Error("Email not verified");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user);
  const refreshPlain = generateRefreshTokenPlain();
  const tokenHash = hashToken(refreshPlain);

  const expiresAt = new Date(Date.now() + env.jwtRefreshExpiresDays * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId: user.id,
      ip,
      userAgent,
      expiresAt
    }
  });

  await prisma.activityLog.create({
    data: {
      userId: user.id,
      action: "login_success",
      ip,
      userAgent
    }
  });

  return { accessToken, refreshToken: refreshPlain, user };
};

export const refresh = async (refreshPlain) => {
  const tokenHash = hashToken(refreshPlain);
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });
  if (!stored || stored.revoked || stored.expiresAt < new Date()) throw new Error("Invalid refresh token");

  const user = await prisma.user.findUnique({ where: { id: stored.userId } });
  if (!user) throw new Error("User not found");

  const accessToken = generateAccessToken(user);
  return { accessToken };
};

export const logout = async (refreshPlain) => {
  const tokenHash = hashToken(refreshPlain);
  await prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { revoked: true }
  });
};


export const requestPasswordReset = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  const token = crypto.randomBytes(32).toString("hex");
  const exp = new Date(Date.now() + 1000 * 60 * 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExp: exp }
  });

  const resetUrl = `${env.frontUrl}/reset-password?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Reset your password",
    html: `<p>Click to reset: <a href="${resetUrl}">${resetUrl}</a></p>`
  });
};


export const resetPassword = async (token, newPassword) => {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExp: { gt: new Date() }
    }
  });
  if (!user) throw new Error("Invalid or expired token");

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, resetToken: null, resetTokenExp: null }
  });
};

export const revokeAllUserTokens = async (userId) => {
  await prisma.refreshToken.updateMany({ where: { userId }, data: { revoked: true } });
};
