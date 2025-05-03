import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@repo/db/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getAuthToken } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const decoded = jwt.verify(token, 'SECR3T')

  const userId = (decoded as any).userId;

  const { currentPassword, newPassword } = await req.json();

  if (!userId || !currentPassword || !newPassword) {
    return NextResponse.json(
      { error: 'Current password and new password are required' },
      { status: 400 }
    );
  }

  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prismaClient.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return NextResponse.json({
      status: 200,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json({ error: 'Failed to update password' }, { status: 400 });
  }
}
