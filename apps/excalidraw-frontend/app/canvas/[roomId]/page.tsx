
import { RoomCanvas } from "@/components/RoomCanvas";
import { getAuthToken } from "@/lib/auth";


export default async function CanvasPage({ params }: { params: { roomId: string } }) {
    const roomId = (await params).roomId;
    const token = await getAuthToken();

    return (
        <RoomCanvas roomId={roomId} token={token} />
    )
}