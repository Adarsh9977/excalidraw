// app/api/signin/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { SigninSchema } from '@repo/common/types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prismaClient } from '@repo/db/client';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = SigninSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.message },
      { status: 400 }
    );
  }

  const { username, password } = parsed.data;

  try {
    const existingUser = await prismaClient.user.findUnique({
      where: { email: username },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 400 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 400 }
      );
    }

    const token = jwt.sign({ userId: existingUser.id }, 'SECR3T');

    return NextResponse.json({
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
      },
      token,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
