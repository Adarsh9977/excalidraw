// app/api/users/[userId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@repo/db/client';

export async function DELETE(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = await params;
  const { roomId } = await req.json();

  if (!userId || !roomId) {
    return NextResponse.json(
      { error: 'User ID and Room ID are required' },
      { status: 400 }
    );
  }

  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prismaClient.roomUser.deleteMany({
      where: {
        userId: user.id,
        roomId: Number(roomId),
      },
    });

    return NextResponse.json({
      status: 200,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error while deleting user' },
      { status: 400 }
    );
  }
}
