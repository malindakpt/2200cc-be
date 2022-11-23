import { config } from "config";
import nodemailer from "nodemailer";

export const sendEmail = async (
  toEmail: string,
  subject: string,
  html: string
) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: config.fromEmail,
      pass: config.password,
    },
  });

  try {
    const result = await transporter.sendMail({
      from: config.fromEmail,
      to: toEmail,
      subject: subject,
      html: html
    });
    return result;
  } catch (err) {
    return err;
  }
};
