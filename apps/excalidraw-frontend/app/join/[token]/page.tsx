
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { JoinRoomCard } from '@/components/join-room-card';
import axios from "axios";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type tParams = Promise< { token: string } >


async function verifyToken(token: string) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/verify-invite/${token}`);
    return await response.data;
  } catch (error) {
    return { valid: false, error: 'Failed to verify invitation' };
  }
}

export default async function JoinRoom({ params }: { params: tParams }) {
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