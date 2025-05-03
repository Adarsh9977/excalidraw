// app/api/verify-invite/[token]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@repo/db/client';
import jwt from 'jsonwebtoken';

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params;

  try {
    const decoded = jwt.verify(token, 'SECR3T') as {
      userId: string;
      roomId: number;
      role: string;
    };
    console.log(decoded);

    // Find room based on decoded roomId
    const room = await prismaClient.room.findUnique({
      where: { id: decoded.roomId },
      select: {
        id: true,
        slug: true,
        adminId: true,
      },
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // Find user based on decoded userId
    const user = await prismaClient.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return response with room, user, and role
    return NextResponse.json({
      status: 200,
      valid: true,
      token,
      room,
      user,
      role: decoded.role,
    });
  } catch (error) {
    return NextResponse.json(
      { valid: false, error: 'Invalid or expired invitation link' },
      { status: 400 }
    );
  }
}
