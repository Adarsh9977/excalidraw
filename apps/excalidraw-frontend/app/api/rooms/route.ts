// app/api/rooms/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@repo/db/client';
import { getToken } from "next-auth/jwt";


export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log("token::", token);

  if (!token || !token.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = token.id;
  console.log(userId);

  try {
    const adminRooms = await prismaClient.room.findMany({
      where: { adminId: userId },
      include: { collaborators: true },
    });

    const collaboratorRooms = await prismaClient.room.findMany({
      where: {
        collaborators: {
          some: { userId },
        },
      },
      include: { collaborators: true },
    });

    const allRooms = [...adminRooms, ...collaboratorRooms];

    return NextResponse.json({
      status: 200,
      rooms: allRooms,
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Error while getting rooms' },
      { status: 400 }
    );
  }
}
