import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT ?? 4000,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES ?? "15m",
  jwtRefreshExpiresDays: parseInt(process.env.JWT_REFRESH_EXPIRES_DAYS ?? "7", 10),
  frontUrl: process.env.FRONT_URL ?? "http://localhost:3000",
  mailUser: process.env.MAIL_USER,
  mailPass: process.env.MAIL_PASS,
};
