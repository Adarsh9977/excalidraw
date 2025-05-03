// app/api/signup/route.ts

import { NextRequest, NextResponse } from 'next/server';// Adjust path as needed
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CreateUserSchema } from '@repo/common/types';
import { prismaClient } from '@repo/db/client';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username: email, password, name } = body;

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: 'Email, password and name are required' },
      { status: 400 }
    );
  }

  const parsedData = CreateUserSchema.safeParse(body);
  if (!parsedData.success) {
    return NextResponse.json(
      { error: parsedData.error.message },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

  try {
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User Already Exists' }, { status: 400 });
    }

    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data.username,
        password: hashedPassword,
        name: parsedData.data.name,
      },
    });

    const token = jwt.sign({ userId: user.id }, 'SECR3T');

    const response = NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      });
    
    response.cookies.set('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    return response; // Return the response object with the use
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
