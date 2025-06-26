import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

// // Debug logs
// console.log("MAIL_USER:", process.env.MAIL_USER);
// console.log("MAIL_PASS:", process.env.MAIL_PASS ? "✅ Present" : "❌ Missing");
// console.log("MAIL_FROM_NAME:", process.env.MAIL_FROM_NAME);
// console.log("MAIL_FROM_EMAIL:", process.env.MAIL_FROM_EMAIL ? "✅ Present" : "❌ Missing");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `http://localhost:5173/verify-email/${token}`;

  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
    to: email,
    subject: 'Verify Your Email',
    html: `
      <h2>Email Verification</h2>
      <p>Click the button below to verify your email:</p>
      <a href="${verificationUrl}" style="padding:10px 15px; background:#007bff; color:white; text-decoration:none; border-radius:4px;">
        Verify Email
      </a>
    `
  });
};

export default sendVerificationEmail;
