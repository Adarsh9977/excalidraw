'use client';
import { Canvas } from "@/components/Canvas";
import { useEffect, useState } from "react"

export function RoomCanvas({ roomId, token }: { roomId: string, token : string | undefined }) {
    const [ socket, setSocket ] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`);

        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: 'join-room',
                roomId,
                token
            }));
        }
    }, []);

    if(!socket) {
        console.log(process.env.NEXT_PUBLIC_WS_URL);
        return <div>Connecting to server...</div>
    }

    return (
        <div>
            <Canvas roomId={roomId} socket={socket} />
        </div>
    )
}