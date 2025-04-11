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

export async function getUsers(): Promise<{status: Number, data: User[]}> {
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
        return {status:res.status, data: res.data.users};
    } catch (error) {
        console.error('Error fetching users:', error);
        return {status:400, data: []};
    }
}

export async function getCollaborators(): Promise<{status: Number, data: Collaborator[]}> {
    try {
        const token = await getAuthToken();
        const res = await axios.get(`${HTTP_BACKEND}/collaborators`,{
            headers: {
                'Authorization': `${token}`
            }
        });
        return {status:res.status, data: res.data.collaborators};
    } catch (error) {
        console.error('Error fetching collaborators:', error);
        return {status:400, data: []};
    }
}

export async function InviteUserToRoom(userId: string, roomId: string, role: string): Promise<{status: Number, message: any}> {
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
        return {status:res.status, message: res.data};
    } catch (error) {
        console.error('Error inviting user to room:', error);
        return {status:400, message: error};
    }
}