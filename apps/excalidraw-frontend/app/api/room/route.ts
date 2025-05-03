// app/api/room/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { CreateRoomSchema } from '@repo/common/types';
import { prismaClient } from '@repo/db/client';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = token.sub;
    const body = await req.json();
    const parsedData = CreateRoomSchema.safeParse(body);

    if (!parsedData.success) {
        return NextResponse.json(
        { error: parsedData.error.message },
        { status: 400 }
        );
    }

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const room = await prismaClient.room.create({
        data: {
            slug: parsedData.data.roomName,
            adminId: userId,
        },
        });

        return NextResponse.json({ status: 200, room });
    } catch (error) {
        return NextResponse.json({ error: 'Room already exists' }, { status: 400 });
    }
}
