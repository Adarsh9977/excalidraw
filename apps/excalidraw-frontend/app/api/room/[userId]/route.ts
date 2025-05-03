// app/api/room/[userId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@repo/db/client';

export async function PUT(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = await params;
  const { roomId, role } = await req.json();

  // Validation
  if (!userId) {
    return NextResponse.json({ status: 400, error: 'User ID is required' }, { status: 400 });
  }
  if (!roomId) {
    return NextResponse.json({ status: 400, error: 'Room ID is required' }, { status: 400 });
  }
  if (!role) {
    return NextResponse.json({ status: 400, error: 'Role is required' }, { status: 400 });
  }

  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ status: 400, error: 'User not found' }, { status: 404 });
    }

    await prismaClient.roomUser.update({
      where: {
        userId_roomId: {
          userId: user.id,
          roomId: Number(roomId),
        },
      },
      data: {
        role,
      },
    });

    return NextResponse.json({
      status: 200,
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: 400, error: 'Error while updating user' },
      { status: 400 }
    );
  }
}
