import axios from "axios";
import { BACKEND_URL } from "../config";
import { ChatRoomClient } from "./ChatRoomClient";


async function getChats(roomId: number) {
    const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    return response.data.chats;
}



export async function ChatRoom({ roomId }: { roomId: number }) {
    const messages = await getChats(roomId);
        return  <ChatRoomClient messages={messages} roomId={roomId} />
}