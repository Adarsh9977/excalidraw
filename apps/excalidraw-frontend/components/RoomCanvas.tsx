'use client';
import { WS_URL } from "@/config";
import { Canvas } from "@/components/Canvas";
import { useEffect, useState } from "react"

export function RoomCanvas({ roomId }: { roomId: string }) {
    const [ socket, setSocket ] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmYzQxZWI4MS0zZjE0LTQ0ZDUtYjIzNi01MDY1NjNmMTY5MWMiLCJpYXQiOjE3NDQwMTIwMDB9.JXe8B71NZkOra5ZR8GLq8SUWvTxoau8N4CXlWr2QPFQ`);

        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: 'join-room',
                roomId
            }));
        }
    }, []);

    if(!socket) {
        return <div>Connecting to server...</div>
    }

    return (
        <div>
            <Canvas roomId={roomId} socket={socket} />
        </div>
    )
}