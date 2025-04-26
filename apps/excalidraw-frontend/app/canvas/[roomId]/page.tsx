
import { RoomCanvas } from "@/components/RoomCanvas";
import { getAuthToken } from "@/lib/auth";

type tParams = Promise<{ roomId: string }>;

export default async function CanvasPage({ params }: { params: tParams }) {
    const {roomId} = await params;
    const token = await getAuthToken();

    return (
        <RoomCanvas roomId={roomId} token={token} />
    )
}