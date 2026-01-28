import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendOtpEmail(email: string, otp: string) {
  // If no email server configured (dev mode), log to console
  if (!process.env.EMAIL_SERVER_HOST) {
    console.log('------------------------------------');
    console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
    console.log('------------------------------------');
    return;
  }

  const result = await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"The GameOn Co." <noreply@gameon.co>',
    to: email,
    subject: 'Your GameOn Verification Code',
    text: `Your verification code is: ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563EB;">Welcome to GameOn!</h2>
        <p>Your verification code is:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #1E293B; background: #F1F5F9; padding: 10px 20px; display: inline-block; border-radius: 4px;">${otp}</p>
        <p>This code will expire in 10 minutes.</p>
        <p style="color: #64748B; font-size: 14px;">If you didn't request this code, you can ignore this email.</p>
      </div>
    `,
  });
  
  return result;
}
