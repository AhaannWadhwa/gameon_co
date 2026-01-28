import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyOtpHash } from '@/lib/otp';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has an OTP set
    if (!user.otpHash || !user.otpExpiry) {
        return NextResponse.json({ error: 'No OTP requested' }, { status: 400 });
    }

    // Check expiry
    if (new Date() > user.otpExpiry) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    // Verify hash
    const isValid = await verifyOtpHash(otp, user.otpHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // Mark as verified and clear OTP
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
        status: 'VERIFIED',
        otpHash: null,
        otpExpiry: null,
      },
    });

    return NextResponse.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}
