import bcrypt from "bcryptjs";
import prisma from "../../database/prisma.js";
import {
  generateAccessToken,
  generateRefreshToken
} from "../../utils/token.js";
import { sendEmail } from "../../utils/sendEmail.js";

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

  const verifyUrl = `${process.env.FRONT_URL}/verify-email?token=${token}`;

  await sendEmail(
    email,
    "Verify your email",
    `<p>Click to verify: <a href="${verifyUrl}">Verify Email</a></p>`
  );

  return user;
};

export const login = async ({ email, password, ip, userAgent }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      ip,
      userAgent,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  return { accessToken, refreshToken, user };
};

export const refresh = async (token) => {
  const stored = await prisma.refreshToken.findUnique({ where: { token } });

  if (!stored || stored.revoked) throw new Error("Invalid refresh token");

  const user = await prisma.user.findUnique({ where: { id: stored.userId } });

  const accessToken = generateAccessToken(user);
  return { accessToken };
};

export const verifyEmail = async (token) => {
  const user = await prisma.user.findFirst({
    where: { emailVerificationToken: token },
  });

  if (!user) throw new Error("Invalid token");

  return prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null,
    },
  });
};

export const requestPasswordReset = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  const token = crypto.randomBytes(32).toString("hex");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: token,
      resetTokenExp: new Date(Date.now() + 1000 * 60 * 10),
    },
  });

  const resetUrl = `${process.env.FRONT_URL}/reset-password?token=${token}`;

  await sendEmail(
    email,
    "Reset your password",
    `<p>Click: <a href="${resetUrl}">Reset Password</a></p>`
  );
};

export const resetPassword = async (token, newPassword) => {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExp: { gt: new Date() },
    },
  });

  if (!user) throw new Error("Invalid or expired token");

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      resetToken: null,
      resetTokenExp: null,
    },
  });
};
