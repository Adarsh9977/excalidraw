// app/api/rooms/[roomId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@repo/db/client';
import { getAuthToken } from '@/lib/auth';
import jwt from 'jsonwebtoken';


export async function DELETE(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const decoded = jwt.verify(token, 'SECR3T')

  const userId = (decoded as any).userId;
  const roomId = Number(params.roomId);

  if (!roomId) {
    return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prismaClient.room.delete({
      where: {
        id: roomId,
        adminId: userId,
      },
    });

    return NextResponse.json({
      status: 200,
      message: 'Room deleted successfully',
    });
  } catch (error) {
    console.error('Delete room error:', error);
    return NextResponse.json(
      { status: 400, error: 'Failed to delete room' },
      { status: 400 }
    );
  }
}
