import { NextRequest, NextResponse } from 'next/server';
import { prismaClient  } from '@repo/db/client';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });


export async function POST(req: NextRequest, { params }: { params: Promise<{userId : string}>}) {
  const targetUserId = (await params).userId;

  const body = await req.json();
  const roomId = body.roomId;
  const role = body.role;

  if (!targetUserId || !roomId || !role) {
    return NextResponse.json({ error: 'User ID and Room ID are required' }, { status: 400 });
  }

  try {
    const targetUser = await prismaClient.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const room = await prismaClient.room.findUnique({
      where: { id: parseInt(roomId) },
      include: { admin: true },
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const existingMembership = await prismaClient.roomUser.findUnique({
      where: {
        userId_roomId: {
          userId: targetUserId,
          roomId: room.id,
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json({ error: 'User is already a member of this room' }, { status: 400 });
    }

    // Generate invitation token
    const inviteToken = jwt.sign(
      { userId: targetUserId, roomId: room.id, role },
      'SECR3T', // You should use process.env.JWT_SECRET in production
      { expiresIn: '24h' }
    );

    console.log("inviteToken", inviteToken)

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: targetUser.email,
      subject: 'Invitation to Join Room',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f7fc; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
            <div style="background-color: #6c5ce7; padding: 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff;">WhiteBoard</h1>
            </div>
            <div style="padding: 30px; color: #333333;">
              <h2 style="color: #6c5ce7;">Room Invitation</h2>
              <p>Hello <strong>${targetUser.name || 'there'}</strong>,</p>
              <p><strong>${room.admin.name}</strong> has invited you to join a room on <strong>WhiteBoard</strong>.</p>
              <p><strong>Room:</strong> ${room.slug}</p>
              <p style="margin-top: 20px;">Click the button below to join the room:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_FRONTEND_URL}/join/${inviteToken}" style="background-color: #6c5ce7; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">Join Room</a>
              </div>
              <p>If the button doesn't work, copy and paste this URL into your browser:</p>
              <p style="word-break: break-word;">${process.env.NEXT_PUBLIC_FRONTEND_URL}/join/${inviteToken}</p>
            </div>
            <div style="background-color: #f1effa; text-align: center; padding: 15px; font-size: 13px; color: #888;">
              &copy; ${new Date().getFullYear()} WhiteBoard. All rights reserved.
            </div>
          </div>
        </div>
      `,
    };

    console.log(mailOptions)

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Invitation sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending invitation:', error);
    return NextResponse.json({ error: 'Failed to send invitation' }, { status: 400 });
  }
}
