import transporter from './mailer.js'
const sendVerificationEmail = async (email, token) => {
  try {
    const verificationUrl = `${process.env.FRONT_END_URL}/verify-email/${token}`;

    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
      to: email,
      subject: 'Please verify your email address',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #333;">Welcome to Our Platform!</h2>
          <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">
            Verify Email
          </a>
          <p style="margin-top: 20px;">If you didn’t create this account, you can ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Failed to send verification email: ${error.message}`);
  }
};

export default sendVerificationEmail;
