import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware, config } from './midleware';
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from '@repo/common/types';
import { prismaClient } from '@repo/db/client';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASSWORD } from './config';

const app = express();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
});
app.use(express.json());
app.use(cors());

app.listen(3001, () => {
  console.log('Server is running on port 3005');
});


app.post('/signup', async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.log(parsedData.error);
    res.status(400).json({ error: parsedData.error.message });
    return;
  }
  const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data.username,
        password: hashedPassword,
        name: parsedData.data.name,
      },
    });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: 'User already exists' });
  }
});

app.post('/signin', async(req, res) => {
  const data = SigninSchema.safeParse(req.body);
  if (!data.success) {
    res.status(400).json({ error: data.error.message });
    return;
  }
  const existingUser = await prismaClient.user.findUnique({
    where: {
      email: data.data.username,
    },
  });
  if (!existingUser) {
    res.status(400).json({ error: 'User not found' });
    return;
  }
  const isPasswordCorrect = await bcrypt.compare(data.data.password, existingUser.password);

  if(!isPasswordCorrect){
    res.status(400).json({ error: 'Invalid password' });
    return;
  }
  const token = jwt.sign({ userId: existingUser.id }, JWT_SECRET);
  res.json({
    user: {
      id: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
    },
    token
  });
});

app.post('/room', middleware, async(req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error.message });
    return;
  }

  const userId = (req as any).userId;
  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.roomName,
        adminId: userId,
      },
    });
    res.json({ roomId: room.id });
    return;
  } catch (error) {
    res.status(400).json({ error: 'Room already exists' });
  }
});

app.get('/rooms', async (req, res)=>{
  const userId = (req as any).userId;
  try {
    const rooms = await prismaClient.room.findMany({
      where: {
        adminId: userId
      }
    });

    res.status(200).json({
      rooms
    });
  } catch (error) {
    res.status(400).json({ error: 'Error while getting rooms' });
  }
})

app.get('/users', async (req, res)=>{
  try {
    const users = await prismaClient.user.findMany();

    res.status(200).json({
      users
    });
  } catch (error) {
    res.status(400).json({ error: 'Error while getting users' });
  }
})

app.delete('/rooms/:roomId',middleware, async(req, res) => {
  const roomId = Number(req.params.roomId);
  const userId = (req as any).userId;
  if(!roomId) {
    res.status(400).json({ error: 'Room ID is required' });
    return;
  }
  if(!userId){
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  console.log(roomId);
  try {
    const room = await prismaClient.room.delete({
      where: {
        id: roomId,
        adminId: userId
      }
    });
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error while deleting room' });
  }
})

app.get('/room/:slug', async(req, res) => {
  const slug = req.params.slug;
  if(!slug) {
    res.status(400).json({ error: 'Room name is required' });
    return;
  }
  try {
    const room = await prismaClient.room.findFirst({
      where: { slug }
    });

    res.json({
      room
    });
  } catch (error) {
    res.status(400).json({ error: 'Room not found' });
  }
});

app.post('/invite/:userId', middleware, async(req, res) => {
  const targetUserId = String(req.params.userId);
  const roomId = req.body.roomId;

  if (!targetUserId || !roomId) {
    res.status(400).json({ error: 'User ID and Room ID are required' });
    return;
  } 

  try {
    // Find the target user
    const targetUser = await prismaClient.user.findUnique({
      where: { id: targetUserId }
    });

    if (!targetUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Find the room
    const room = await prismaClient.room.findUnique({
      where: { id: parseInt(roomId) },
      include: { admin: true },
    });

    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    // Send invitation email
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
                <a href="${process.env.FRONTEND_URL}/room/${room.slug}" style="background-color: #6c5ce7; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">Join Room</a>
              </div>
              <p>If the button doesn't work, copy and paste this URL into your browser:</p>
              <p style="word-break: break-word;">${process.env.FRONTEND_URL}/room/${room.slug}</p>
            </div>
            <div style="background-color: #f1effa; text-align: center; padding: 15px; font-size: 13px; color: #888;">
              &copy; ${new Date().getFullYear()} WhiteBoard. All rights reserved.
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Invitation sent successfully' });
  } catch (error) {
    console.error('Error sending invitation:', error);
    res.status(500).json({ error: 'Failed to send invitation' });
  }
});

app.post('/join-room', middleware, async(req, res) => {
  const roomId = req.body.roomId;
  const userId = (req as any).userId;
  if(!roomId || !userId) {
    res.status(400).json({ error: 'Room ID and User ID are required' });
    return;
  }
  try {
    const room = await prismaClient.room.findUnique({
      where: { id: roomId },
      include: { admin: true },
    });

    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await prismaClient.roomUser.create({
      data: {
        userId: user.id,
        roomId: room.id,
        role: 'editor'
      }
    });

    res.status(200).json({ message: 'Joined room successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error while joining room' });
  }
});

app.delete('/users/:userId', middleware, async(req, res) => {
  const userId = req.params.userId;
  const roomId = req.body.roomId;
  if(!userId ||!roomId) {
    res.status(400).json({ error: 'User ID and Room ID are required' });
    return;
  }

  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await prismaClient.roomUser.deleteMany({
      where: {
        userId: user.id,
        roomId: roomId
      }
    });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: "Error while deleting user" });
  }
});

app.put('/room/:userId', middleware, async(req, res) => {
  const userId = req.params.userID;
  const roomId = req.body.roomId;
  const role = req.body.role;
  if(!userId ||!roomId ||!role) {
    res.status(400).json({ error: 'User ID and Room ID are required' });
    return;
  }
  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    await prismaClient.roomUser.update({
      where: {
        userId_roomId: {
          userId: user.id,
          roomId: Number(roomId)
        }
      },
      data: {
        role: role
      }
    });
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error while updating user' }); 
  }
});

