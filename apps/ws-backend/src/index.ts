import { WebSocket, WebSocketServer } from 'ws';
import jwt from "jsonwebtoken";
import { prismaClient } from '@repo/db/client';

const wss = new WebSocketServer({ port: 8080, host: '0.0.0.0' });

interface User {
    ws: WebSocket,
    rooms: string[],
    userId: string,
    username?: string
}

const users: User[] = [];
console.log("USERS", users);

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, "SECR3T");

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch(e) {
    return null;
  }
}

async function broadcastRoomUsers(roomId: string, userId?: string) {
    const seenUserIds = new Set<string>();
    const uniqueRoomUsers: typeof users = [];

    for (const user of users) {
        if (user.rooms.includes(roomId) && !seenUserIds.has(user.userId)) {
            seenUserIds.add(user.userId);
            uniqueRoomUsers.push(user);
        }
    }

    const userDetails = await Promise.all(uniqueRoomUsers.map(async (user) => {
        const dbUser = await prismaClient.user.findUnique({
            where: { id: user.userId },
            select: { name: true, id: true }
        });
        return { id: user.userId, name: dbUser?.name };
    }));

    users.forEach(user => {
        if (user.rooms.includes(roomId)) {
            user.ws.send(JSON.stringify({
                type: "room-users",
                users: userDetails,
                roomId: Number(roomId)
            }));
        }
    });
}


wss.on('connection', function connection(ws, request) {
    const url = request.url;
    if (!url) {
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const userId = checkUser(token);

    if (userId == null) {
        ws.close()
        return null;
    }

    users.push({
        userId,
        rooms: [],
        ws
    })

ws.on('message', async function message(data: any) {
    console.log("data", data.toString());

    let parsedData: any;
    if (typeof data !== "string") {
        parsedData = JSON.parse(data.toString());
    } else {
        parsedData = JSON.parse(data); // {type: "join-room", roomId: 1}
    }

    if (parsedData.type === "join-room") {
        const userId = checkUser(parsedData.token);
        if(userId == null) {
            ws.close()
            return null;
        }
        const user = users.find(x => x.ws === ws);
        user?.rooms.push(parsedData.roomId);
        await broadcastRoomUsers(parsedData.roomId, userId);
    }

    if (parsedData.type === "leave-room") {
        const user = users.find(x => x.ws === ws);
        if (!user) {
            return;
        }
        user.rooms = user.rooms.filter(x => x !== parsedData.roomId);
        await broadcastRoomUsers(parsedData.roomId);
    }

    // Handle video call signaling
    if (parsedData.type === "video-call") {
        const roomId = parsedData.roomId;
        const targetUserId = parsedData.targetUserId;
        const callData = parsedData.callData;
        const callType = parsedData.callType; // 'offer', 'answer', 'ice-candidate', 'hang-up'
        
        // Find the target user
        const targetUser = users.find(user =>
            user.userId === targetUserId && user.rooms.includes(roomId)
        );
        
        if (targetUser) {
            // Forward the call data to the target user
            targetUser.ws.send(JSON.stringify({
                type: "video-call",
                callType: callType,
                callData: callData,
                fromUserId: userId,
                roomId: Number(roomId)
            }));
            
            // Log call activity for debugging
            console.log(`Video call ${callType} from ${userId} to ${targetUserId} in room ${roomId}`);
        } else {
            // Notify caller that target user is not available
            ws.send(JSON.stringify({
                type: "video-call-error",
                message: "User is not available",
                targetUserId,
                roomId: Number(roomId)
            }));
        }
    }

    if (parsedData.type === "chat") {
        const roomId = parsedData.roomId;
        const message = parsedData.message;

        const chat = await prismaClient.chat.create({
            data: {
            roomId: Number(roomId),
            message,
            userId
            }
        });

        users.forEach(user => {
            if (user.rooms.includes(roomId)) {
            user.ws.send(JSON.stringify({
                type: "chat",
                message: message,
                roomId: Number(roomId),
            }))
            }
        })
    }
    });

    ws.on('close', async () => {
        const user = users.find(x => x.ws === ws);
        if (user) {
            // Broadcast user left to all rooms they were in
            for (const roomId of user.rooms) {
                await broadcastRoomUsers(roomId);
            }
            // Remove user from users array
            users.splice(users.indexOf(user), 1);
        }
    });
});