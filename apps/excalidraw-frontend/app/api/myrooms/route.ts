// app/api/myrooms/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@repo/db/client';
import jwt from 'jsonwebtoken';
import { getAuthToken } from '@/lib/auth';


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
    const adminRooms = await prismaClient.room.findMany({
      where: { adminId: userId },
      include: { collaborators: true },
    });

    return NextResponse.json({
      status: 200,
      rooms: adminRooms,
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Error while getting rooms' },
      { status: 400 }
    );
  }
}
