import express from 'express';
import jwt from 'jsonwebtoken';
import { middleware } from './midleware';
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from '@repo/common/types';
import { prismaClient  } from '@repo/db/client';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import nodemailer from 'nodemailer';
// import { EMAIL_USER, EMAIL_PASSWORD, FRONTEND_URL } from './config';

const app = express();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
app.use(express.json());
app.use(cors());

app.listen(3001,'0.0.0.0', () => {
  console.log('Server is running on port 3001');
});

app.post('/signup', async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  if(!email || !password ||!name) {
    res.status(400).json({ error: 'Email, password and name are required' });
    return;
  }
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error.message });
    return;
  }
  const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
  try {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      res.status(400).json({ error: 'User Alreay Exists' });
      return;
    }
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data.username,
        password: hashedPassword,
        name: parsedData.data.name,
      },
    });
    const token = jwt.sign({ userId: user.id }, "SECR3T");
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error });
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
  const token = jwt.sign({ userId: existingUser.id }, "SECR3T");
  res.status(200).json({
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
    res.status(200).json({ status: 200, room: room });
    return;
  } catch (error) {
    res.status(400).json({ error: 'Room already exists' });
  }
});

app.get('/rooms', middleware, async (req, res) => {
  const userId = (req as any).userId;
  try {
    // Get rooms where user is admin
    const adminRooms = await prismaClient.room.findMany({
      where: {
        adminId: userId
      },
      include: {
        collaborators: true
      }
    });

    // Get rooms where user is a collaborator
    const collaboratorRooms = await prismaClient.room.findMany({
      where: {
        collaborators: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        collaborators: true
      }
    });

    // Combine both sets of rooms
    const allRooms = [...adminRooms, ...collaboratorRooms];

    res.status(200).json({
      status:200,
      rooms: allRooms
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error while getting rooms' });
  }
});

app.get('/myrooms', middleware, async(req, res) => {
    const userId = (req as any).userId;
    try {
      // Get rooms where user is admin
      const adminRooms = await prismaClient.room.findMany({
        where: {
          adminId: userId
        },
        include: {
          collaborators: true
        }
      });

      res.status(200).json({
        status: 200,
        rooms: adminRooms
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: 'Error while getting rooms' });
    }
  });

app.get('/users',middleware, async (req, res)=>{
  const userId = (req as any).userId;
  try {
    const users = await prismaClient.user.findMany({
      where: {
        id : {
          not: userId
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true
      }
    });

    res.status(200).json({
      status:200,
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
        id: Number(roomId),
        adminId: userId
      }
    });
    res.status(200).json({ status:200, message: 'Room deleted successfully' });
  } catch (error) {
    res.status(400).json({ status: 400, error: error });
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

    res.status(200).json({
      status: 200,
      room
    });
  } catch (error) {
    res.status(400).json({ error: 'Room not found' });
  }
});

app.post('/invite/:userId', middleware, async(req, res) => {
  const targetUserId = String(req.params.userId);
  const roomId = req.body.roomId;
  const role = req.body.role;

  if (!targetUserId || !roomId || !role) {
    res.status(400).json({ error: 'User ID and Room ID are required' });
    return;
  }

  try {
    const targetUser = await prismaClient.user.findUnique({
      where: { id: targetUserId }
    });

    if (!targetUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const room = await prismaClient.room.findUnique({
      where: { id: parseInt(roomId) },
      include: { admin: true },
    });

    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    const existingMembership = await prismaClient.roomUser.findUnique({
      where: {
        userId_roomId: {
          userId: targetUserId,
          roomId: room.id
        }
      }
    })

    if(existingMembership) {
      res.status(400).json({ status:400, error: 'User is already a member of this room' });
    }

    // Generate invitation token
    const inviteToken = jwt.sign(
      { userId: targetUserId, roomId: room.id, role: role },
      "SECR3T",
      { expiresIn: '24h' }
    );

    // Send invitation email with the new token
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
                <a href="${process.env.FRONTEND_URL}/join/${inviteToken}" style="background-color: #6c5ce7; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">Join Room</a>
              </div>
              <p>If the button doesn't work, copy and paste this URL into your browser:</p>
              <p style="word-break: break-word;">${process.env.FRONTEND_URL}/join/${inviteToken}</p>
            </div>
            <div style="background-color: #f1effa; text-align: center; padding: 15px; font-size: 13px; color: #888;">
              &copy; ${new Date().getFullYear()} WhiteBoard. All rights reserved.
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ status:200, message: 'Invitation sent successfully' });
  } catch (error) {
    console.error('Error sending invitation:', error);
    res.status(500).json({ error: 'Failed to send invitation' });
  }
});

// Add new endpoint to verify invitation token
app.get('/verify-invite/:token',async(req:any, res:any) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, "SECR3T") as { userId: string; roomId: number, role: string };
    console.log(decoded)
    const room = await prismaClient.room.findUnique({
      where: { id: decoded.roomId },
      select: {
        id: true,
        slug: true,
        adminId: true
      }
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const user = await prismaClient.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      status:200,
      valid: true,
      token,
      room,
      user,
      role: decoded.role
    });
  } catch (error) {
    res.status(400).json({ valid: false, error: 'Invalid or expired invitation link' });
  }
});

app.post('/join-room', async(req:any, res:any) => {
  const roomId = req.body.roomId;
  const userId = req.body.userId;
  const role = req.body.role;
  if(!roomId || !userId) {
    res.status(400).json({ error: 'Room ID and User ID are required' });
    return;
  }
  try {
    const existingMembership = await prismaClient.roomUser.findUnique({
      where: {
        userId_roomId: {
          userId: userId,
          roomId: Number(roomId)
        }
      }
    });

    if (existingMembership) {
      return res.status(400).json({ error: 'User is already a member of this room' });
    }

    const room = await prismaClient.room.findUnique({
      where: { id: Number(roomId) },
      include: { admin: true },
    });

    if (!room) {
      res.status(404).json({status:400, error: 'Room not found' });
      return;
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      res.status(404).json({status:400, error: 'User not found' });
      return;
    }
    const mainRoom = await prismaClient.roomUser.create({
      data: {
        userId: user.id,
        roomId: room.id,
        role: role,
        avatar: user.avatar
      }
    });

    res.status(200).json({ status:200, message: 'Joined room successfully' });
  } catch (error) {
    res.status(400).json({ error: error });
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
        roomId: Number(roomId)
      }
    });
    res.status(200).json({ status:200, message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: "Error while deleting user" });
  }
});

app.put('/room/:userId', middleware, async(req, res) => {
  const userId = req.params.userId;
  const roomId = req.body.roomId;
  const role = req.body.role;
  if(!userId) {
    res.status(400).json({ status: 400, error: 'User ID is required' });
    return;
  }
  if(!roomId) {
    res.status(400).json({ status:400, error: 'Room ID is required' });
    return;
  }
  if(!role) {
    res.status(400).json({ status: 400, error: 'Role is required' });
    return;
  }

  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      res.status(404).json({ status: 400, error: 'User not found' });
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
    res.status(200).json({ status:200, message: 'User updated successfully' });
  } catch (error) {
    res.status(400).json({status: 400, error: 'Error while updating user' }); 
  }
});

app.get('/collaborators', middleware, async (req, res) => {
  const userId = (req as any).userId;
  try {
    // First get all rooms where the user is admin
    const rooms = await prismaClient.room.findMany({
      where: {
        adminId: userId
      }
    });

    // Get all collaborators for these rooms
    const collaborators = await prismaClient.roomUser.findMany({
      where: {
        roomId: {
          in: rooms.map((room : any) => room.id)
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        room: {
          select: {
            id: true,
            slug: true
          }
        }
      }
    });

    res.status(200).json({
      status:200,
      collaborators: collaborators.map((collab : any) => ({
        userId: collab.user.id,
        name: collab.user.name,
        email: collab.user.email,
        roomId: collab.room.id,
        roomName: collab.room.slug,
        role: collab.role
      }))
    });
  } catch (error) {
    console.error('Error fetching collaborators:', error);
    res.status(400).json({ status : 400, error: 'Error while fetching collaborators' });
  }
});

app.get('/chats/:roomId', async (req, res) => {
  const roomId = Number(req.params.roomId);
  if(!roomId) {
    res.status(400).json({ error: 'Room ID is required' });
    return;
  }
  try {
    const chats = await prismaClient.chat.findMany({
      where: {
        roomId: roomId
      }
    });
    res.status(200).json({ status:200, chats})
  }catch (error) {
    res.status(400).json({ status: 400, error: 'Error while fetching chats' });
  }
});

// User profile update endpoints
app.put('/user/profile', middleware, async (req : any, res : any) => {
  const userId = (req as any).userId;
  const { name, email, bio } = req.body;
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    // Check if email is already taken by another user
    if (email) {
      const existingUser = await prismaClient.user.findFirst({
        where: {
          email,
          id: { not: userId }
        }
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already in use' });
      }
    }
    
    // Update user profile
    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(bio && { bio })
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatar: true
      }
    });
    
    res.status(200).json({
      status: 200,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({ error: 'Failed to update profile' });
  }
});

app.put('/user/password', middleware, async (req : any, res : any) => {
  const userId = (req as any).userId;
  const { currentPassword, newPassword } = req.body;
  
  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }
  
  try {
    // Get user with password
    const user = await prismaClient.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await prismaClient.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
    
    res.status(200).json({
      status: 200,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(400).json({ error: 'Failed to update password' });
  }
});

app.put('/user/avatar', middleware, async (req : any, res : any) => {
  const userId = (req as any).userId;
  const { avatar } = req.body;

  if (!userId || !avatar) {
    return res.status(400).json({ error: 'Avatar URL is required' });
  }

  try {
    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: { avatar },
      select: {
        id: true,
        avatar: true
      }
    });

    res.status(200).json({
      status: 200,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating avatar:', error);
    res.status(400).json({ error: 'Failed to update avatar' });
  }
});

// Get user profile
app.get('/user/profile', middleware, async (req : any, res : any) => {
  const userId = (req as any).userId;
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatar: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      status: 200,
      user
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(400).json({ error: 'Failed to fetch profile' });
  }
});

