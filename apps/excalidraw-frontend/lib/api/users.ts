import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { getAuthToken } from "../auth";

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string
}

export interface Collaborator {
    userId: string;
    name: string;
    email: string;
    roomId: string;
    roomName: string;
    role: string;
    avatar?: string
}

interface InviteUserToRoomResponse {
    status: number;
    message: string;
}

export async function getUsers(): Promise<User[]> {
    try {
        const token  = await getAuthToken();
        if (!token) {
            throw new Error('Authentication token not found');
        }
        const res = await axios.get(`${HTTP_BACKEND}/users`, {
            headers: {
                'Authorization': `${token}`
            }
        });
        return res.data.users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

export async function getCollaborators(): Promise<Collaborator[]> {
    try {
        const token = await getAuthToken();
        const res = await axios.get(`${HTTP_BACKEND}/collaborators`,{
            headers: {
                'Authorization': `${token}`
            }
        });
        return res.data.collaborators;
    } catch (error) {
        console.error('Error fetching collaborators:', error);
        return [];
    }
}

export async function InviteUserToRoom(userId: string, roomId: string, role: string): Promise<InviteUserToRoomResponse | undefined> {
    try {
        const token = await getAuthToken();
        const res = await axios.post(`${HTTP_BACKEND}/invite/${userId}`, {
            roomId,
            role
        },{
            headers: {
                'Authorization': `${token}`
            }
        }
    );
        return res.data;
    } catch (error) {
        console.error('Error inviting user to room:', error);
    }
}