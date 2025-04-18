
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { JoinRoomCard } from '@/components/join-room-card';
import { HTTP_BACKEND } from '@/config';
import axios from "axios";
import { Button } from "@/components/ui/button";
import Link from "next/link";


async function verifyToken(token: string) {
  try {
    const response = await axios.get(`${HTTP_BACKEND}/verify-invite/${token}`);
    return await response.data;
  } catch (error) {
    return { valid: false, error: 'Failed to verify invitation' };
  }
}

export default async function JoinRoom({ params }: { params: { token: string } }) {
  const { token } = await params;

  const data = await verifyToken(token);

  if (!data.valid) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{data.error || 'Invalid invitation link'}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href='/dashboard'>
              <Button>
                Back to home
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <JoinRoomCard roomData={data} />
    </div>
  );
}