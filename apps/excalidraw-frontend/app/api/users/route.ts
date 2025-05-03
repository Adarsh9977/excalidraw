// app/api/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@repo/db/client';
import { getAuthToken } from '@/lib/auth';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const decoded = jwt.verify(token, 'SECR3T')

  const userId = (decoded as any).userId;

  try {
    const users = await prismaClient.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
      },
    });

    return NextResponse.json({
      status: 200,
      users,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error while getting users' },
      { status: 400 }
    );
  }
}
