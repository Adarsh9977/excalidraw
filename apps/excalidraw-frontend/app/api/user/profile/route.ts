// app/api/user/profile/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@repo/db/client';
import { getAuthToken } from '@/lib/auth';
import jwt from 'jsonwebtoken';

export async function PUT(req: NextRequest) {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const decoded = jwt.verify(token, 'SECR3T')

  const userId = (decoded as any).userId;

  const { name, email, bio } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // Check if email is already taken by another user
    if (email) {
      const existingUser = await prismaClient.user.findFirst({
        where: {
          email,
          id: { not: userId }
        }
      });

      if (existingUser) {
        return NextResponse.json({ error: 'Email is already in use' }, { status: 400 });
      }
    }

    // Update user profile
    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(bio && { bio })
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatar: true
      }
    });

    return NextResponse.json({
      status: 200,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const token = await getAuthToken();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const decoded = jwt.verify(token, 'SECR3T')
  const userId = (decoded as any).userId;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatar: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ status: 200, user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 400 });
  }
}
