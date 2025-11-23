import nodemailer from "nodemailer";
import env from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.mailUser,
    pass: env.mailPass
  }
});

export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Auth RBAC" <${env.mailUser}>`,
    to,
    subject,
    html
  });
};
