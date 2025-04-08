"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({ messages, roomId }: { messages: {
    message: string,
}[], roomId: number }) {
    const { socket, loading } = useSocket();
    const [message, setMessage] = useState("");
    const [chats, setChats] = useState<{
        message: string,
    }[]>(messages);
    useEffect(() => {
        if(socket && !loading) {
            socket.send(JSON.stringify({
                type: "join-room",
                roomId: roomId,
            }));

            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                if(parsedData.type === "chat") {
                    setChats((prevChats) => [...prevChats, parsedData]);
                }
            };
        }
    }, [socket, loading, roomId]);
    console.log("chats", chats);

    return (
        <div>
            {chats.map((m, index) => <div key={index}>{m.message}</div>)}
            <input type="text" onChange={(e) => setMessage(e.target.value)} value={message} />
            <button onClick={() => {
                    socket?.send(JSON.stringify({
                        type: "chat",
                        message: message,
                        roomId: roomId,
                    }));
                    setMessage("");
            }}>Send</button>
        </div>
    );
}