// app/api/join-room/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@repo/db/client';

export async function POST(req: NextRequest) {
  try {
    const { roomId, userId, role } = await req.json();

    if (!roomId || !userId) {
      return NextResponse.json(
        { error: 'Room ID and User ID are required' },
        { status: 400 }
      );
    }

    // Check if user is already a member of the room
    const existingMembership = await prismaClient.roomUser.findUnique({
      where: {
        userId_roomId: {
          userId: userId,
          roomId: Number(roomId),
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: 'User is already a member of this room' },
        { status: 400 }
      );
    }

    // Find the room and ensure it exists
    const room = await prismaClient.room.findUnique({
      where: { id: Number(roomId) },
      include: { admin: true },
    });

    if (!room) {
      return NextResponse.json(
        { status: 400, error: 'Room not found' },
        { status: 404 }
      );
    }

    // Find the user and ensure they exist
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { status: 400, error: 'User not found' },
        { status: 404 }
      );
    }

    // Add user to the room
    await prismaClient.roomUser.create({
      data: {
        userId: user.id,
        roomId: room.id,
        role: role,
        avatar: user.avatar,
      },
    });

    return NextResponse.json({
      status: 200,
      message: 'Joined room successfully',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error joining room' },
      { status: 400 }
    );
  }
}
