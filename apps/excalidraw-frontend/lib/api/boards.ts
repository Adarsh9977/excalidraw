import axios from 'axios';
import { getAuthToken } from '@/lib/auth';
import { Exo } from 'next/font/google';

export interface Board {
  id: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  collaborators: Collaborator[];
}

export interface Collaborator {
  createdAt: string;
  id: string;
  name: string;
  role: string;
  roomId: number;
  updatedAt: string;
  userId: string;
}

export interface DeleteBoardResponse{
  status: Number
  message: string;
}


export async function getBoards(): Promise<{status: Number, data: Board[]}> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms`, {
      headers: {
        'Authorization': `${token}`
      }
    });
    return {status:response.status, data: response.data.rooms};
  } catch (error) {
    console.error('Error fetching boards:', error);
    return {status:400, data: []};
  }
}

export async function getMyBoards(): Promise<{status: Number, data: Board[]}> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/myrooms`, {
      headers: {
        'Authorization': `${token}`
      }
    });
    return {status:response.status, data: response.data.rooms};
  } catch (error) {
    console.error('Error fetching boards:', error);
    return {status:400, data: []};
  }
}

export async function createBoard(name: string): Promise<{status: Number, data: Board} | undefined> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room`, {
      roomName: name,
    }, {
      headers: {
        'Authorization': `${token}`
      } 
    });
    return {status:response.status, data: response.data.room};
  } catch (error) {
    console.error('Error creating board:', error);
    return {
      status: 400,
      data: {
        id: '',
        slug: '',
        createdAt: '',
        updatedAt: '',
        collaborators: [],
    }
    };
  }
}

export async function deleteBoardById(boardId: string): Promise<{status: Number, data: DeleteBoardResponse | undefined}> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/${boardId}`, {
      headers: {
        'Authorization': `${token}`
      }
    });
    return {status:res.status, data: res.data};
  } catch (error) {
    console.error('Error deleting board:', error);
    return {status:400, data: undefined};
  }
}