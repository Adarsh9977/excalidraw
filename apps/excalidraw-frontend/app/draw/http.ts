import axios from "axios";

export async function getExistingShapes(roomId: string){
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chats/${roomId}`);
    const messages = res.data.chats;

    if(!messages) {
        return [];
    }

    const shapes = messages.map((x: { message: string }) => {
        const messageData = JSON.parse(x.message);
            return messageData.shape;
    });

    return shapes;
}