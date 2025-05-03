// app/api/chats/[roomId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@repo/db/client';

export async function GET(req: NextRequest, { params }: { params: { roomId: string } }) {
  const roomId = (await params).roomId;

  if (!roomId) {
    return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
  }

  try {
    const chats = await prismaClient.chat.findMany({
      where: {
        roomId: Number(roomId),
      },
    });

    return NextResponse.json({ status: 200, chats });
  } catch (error) {
    console.error('Error while fetching chats:', error);
    return NextResponse.json({ status: 400, error: 'Error while fetching chats' }, { status: 400 });
  }
}
