'use server'

import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@repo/db/client';
import jwt from 'jsonwebtoken';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';


export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

try {
    // First, get all rooms where the user is the admin
    const rooms = await prismaClient.room.findMany({
    where: {
        adminId: userId,
    },
    });

    // Get all collaborators for these rooms
    const collaborators = await prismaClient.roomUser.findMany({
    where: {
        roomId: {
        in: rooms.map((room: any) => room.id),
        },
    },
    include: {
        user: {
        select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
        },
        },
        room: {
        select: {
            id: true,
            slug: true,
        },
        },
    },
    });

    return NextResponse.json({
    status: 200,
    collaborators: collaborators.map((collab: any) => ({
        userId: collab.user.id,
        name: collab.user.name,
        email: collab.user.email,
        roomId: collab.room.id,
        roomName: collab.room.slug,
        role: collab.role,
    })),
    });
} catch (error) {
    console.error('Error fetching collaborators:', error);
    return NextResponse.json({ status: 400, error: 'Error while fetching collaborators' }, { status: 400 });
}
}
