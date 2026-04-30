import nodemailer from "nodemailer";
import { hmacprocess } from "../utils/hashing.js";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDING_EMAIL_ADDRESS,
    pass: process.env.SENDING_EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (user) => {
  const code = generateVerificationCode();

  const hashedCode = hmacprocess(
    code,
    process.env.HMAC_VERIFICATION_CODE_SECRET
  );

  user.verificationCode = hashedCode;
  user.verificationCodeValidation = Date.now() + 5 * 60 * 1000;

  await user.save();

  await transport.sendMail({
    from: process.env.SENDING_EMAIL_ADDRESS,
    to: user.email,
    subject: "Email Verification",
    html: `
  <div style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding: 30px; text-align: center;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
      <h2 style="color: #0d47a1; font-size: 22px;">Email Verification Code</h2>
      <p style="font-size: 15px; color: #333; text-align: left;">
        Dear Customer,<br><br>
        To proceed with your request, please use the verification code below.  
        Do not share this code with anyone.
      </p>
      <div style="margin: 25px auto; font-size: 28px; font-weight: bold; color: #0d47a1; border: 2px solid #0d47a1; letter-spacing: 4px; display: inline-block; padding: 12px 24px; border-radius: 6px;">
        ${code}
      </div>
      <p style="font-size: 14px; color: #555; text-align: left;">
        This code is valid for <b>5 minutes</b>. After this time, it will expire automatically.
      </p>
      <p style="font-size: 13px; color: #888; text-align: left; margin-top: 20px;">
        If you did not request this verification, please ignore this email.
      </p>
      <hr style="margin: 30px 0;">
      <p style="font-size: 12px; color: #999; text-align: center;">
        © ${new Date().getFullYear()} SecureAuth Inc. All rights reserved.  
      </p>
    </div>
  </div>
`,
  });
};

export const generateVerificationCode = () => {
  return Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
};
