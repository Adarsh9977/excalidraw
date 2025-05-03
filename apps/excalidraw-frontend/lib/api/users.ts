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
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
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
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/collaborators`,{
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
        const res = await axios.post(`/api/invite/${userId}`, {
            roomId,
            role
        });
        return {status:res.status, message: res.data};
    } catch (error) {
        console.error('Error inviting user to room:', error);
        return {status:400, message: error};
    }
}

export async function updateUserRole(userId: string, roomId: string, role: string): Promise<{status: Number, message: any}> {
    try {
        const token = await getAuthToken();
        const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/${userId}`, {
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
        console.error('Error updating user role:', error);
        return {status:400, message: error};
    }
}

export async function updateUserProfile( data: {name?: string, email?: string, bio?: string}): Promise<{status: Number, data: any}> {
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`, data, {
        headers: {
          'Authorization': `${token}`
        }
      });
      
      return {status: res.status, data: res.data};
    } catch (error) {
      console.error('Error updating profile:', error);
      return {status: 400, data: "Email already exists"};
    }
  }

export async function getUserProfile(): Promise<{status: number, data: any}> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`, {
      headers: {
        'Authorization': `${token}`
      }
    });
    
    return {status: res.status, data: res.data};
  } catch (error) {
    console.error('Error fetching profile:', error);
    return {status: 400, data: error};
  }
}