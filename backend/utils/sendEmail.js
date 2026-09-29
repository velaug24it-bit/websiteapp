const nodemailer = require('nodemailer');

/**
 * Creates nodemailer transporter.
 * Supports:
 * 1. Custom SMTP: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
 * 2. Gmail service: EMAIL_SERVICE='gmail', EMAIL_USER, EMAIL_PASS (App Password)
 * 3. Fallback: Ethereal test account when credentials are not configured in environment
 */
const createTransporter = async () => {
  const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  if (emailUser && emailPass) {
    if (process.env.EMAIL_SERVICE === 'gmail' || emailUser.includes('@gmail.com')) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  // Fallback: Test account via Ethereal for testing if no SMTP is configured in .env
  console.log('[Email Service] No custom SMTP credentials found in .env. Creating test email transporter...');
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

const sendPasswordResetEmail = async ({ to, resetOtp, userName = 'Valued Customer' }) => {
  const transporter = await createTransporter();
  const fromAddress =
    process.env.EMAIL_FROM ||
    (process.env.EMAIL_USER ? `"Velan Kadalai Mittai Store" <${process.env.EMAIL_USER}>` : '"Velan Kadalai Mittai Store" <support@kadalaicandy.com>');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Password Reset Verification Code</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF7F2; margin: 0; padding: 24px;">
  <div style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #EADBCE; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #c2410c 0%, #431407 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
      <div style="font-size: 38px; line-height: 1; margin-bottom: 8px;">🥜</div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Velan Kadalai Mittai Store</h1>
      <p style="margin: 6px 0 0; font-size: 13px; color: #fed7aa;">Authentic Kovilpatti Groundnut Candy</p>
    </div>

    <!-- Body -->
    <div style="padding: 32px 28px; color: #292524;">
      <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #1c1917;">Password Reset Verification Code</h2>
      <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #57534e;">
        Hello <strong>${userName}</strong>,<br><br>
        We received a request to reset the password for your account associated with <strong>${to}</strong>. Use the 6-digit verification code below to complete your password reset:
      </p>

      <!-- OTP Box -->
      <div style="text-align: center; margin: 28px 0; padding: 20px; background-color: #FFF7ED; border: 2px dashed #EA580C; border-radius: 16px;">
        <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; color: #9A3412; display: block; margin-bottom: 6px;">Your 6-Digit Code</span>
        <div style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #C2410C; font-family: monospace;">${resetOtp}</div>
        <span style="font-size: 12px; color: #78716c; display: block; margin-top: 8px;">⏱️ Valid for 15 minutes</span>
      </div>

      <p style="margin: 0 0 16px; font-size: 13px; line-height: 1.5; color: #78716c;">
        If you did not request a password reset, please disregard this email. Your current password remains safe and secure.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #FAF7F2; padding: 20px 24px; text-align: center; border-top: 1px solid #F0ECE4; color: #a8a29e; font-size: 11px;">
      <p style="margin: 0;">© ${new Date().getFullYear()} Velan Kadalai Mittai Store. All rights reserved.</p>
      <p style="margin: 4px 0 0;">Kovilpatti, Tamil Nadu, India</p>
    </div>
  </div>
</body>
</html>
  `;

  const info = await transporter.sendMail({
    from: fromAddress,
    to,
    subject: `🔐 ${resetOtp} is your Velan Kadalai Mittai verification code`,
    text: `Your password reset code for Velan Kadalai Mittai Store is: ${resetOtp}. This code expires in 15 minutes.`,
    html,
  });

  console.log(`[Email Service] ✉️ Password reset email dispatched to: ${to} (MessageId: ${info.messageId})`);
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`[Email Service] 🔗 Test Preview URL: ${previewUrl}`);
  }

  return info;
};

module.exports = {
  sendPasswordResetEmail,
};
