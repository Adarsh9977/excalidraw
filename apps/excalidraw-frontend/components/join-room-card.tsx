'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import axios from 'axios';

interface RoomData {
  room: {
    id: number;
    slug: string;
    adminId: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  role: string;
  token: string;
}

interface JoinRoomCardProps {
  roomData: RoomData;
}

export function JoinRoomCard({ roomData }: JoinRoomCardProps) {
  const router = useRouter();


  const handleJoinRoom = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/join-room`, {
        roomId: roomData.room.id,
        role: roomData.role,
        userId: roomData.user.id,
      });

      if (response.status === 200) {
        toast.success('You have successfully joined the room');
        router.push('/dashboard');
      }
    } catch (err) {
      toast.error('Failed to join room');
      router.push('/dashboard');
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Join Room</CardTitle>
        <CardDescription>You have been invited to join a room</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Room:</strong> {roomData?.room.slug}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleJoinRoom} className="w-full">Join Room</Button>
      </CardFooter>
    </Card>
  );
}