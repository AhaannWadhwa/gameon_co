import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOtp, hashOtp } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const otp = generateOtp();
    const otpHash = await hashOtp(otp);
    // Expiry set to 10 minutes from now
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Update user with OTP details
    // We assume user already exists (signed up)
    await prisma.user.update({
      where: { email },
      data: {
        otpHash,
        otpExpiry,
      },
    });

    await sendOtpEmail(email, otp);

    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
