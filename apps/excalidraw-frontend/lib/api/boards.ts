import axios from 'axios';
import { HTTP_BACKEND } from '@/config';
import { getAuthToken } from '@/lib/auth';

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


export async function getBoards(): Promise<Board[]> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.get(`${HTTP_BACKEND}/rooms`, {
      headers: {
        'Authorization': `${token}`
      }
    });
    return response.data.rooms;
  } catch (error) {
    console.error('Error fetching boards:', error);
    return [];
  }
}

export async function getMyBoards(): Promise<Board[]> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.get(`${HTTP_BACKEND}/myrooms`, {
      headers: {
        'Authorization': `${token}`
      }
    });
    return response.data.rooms;
  } catch (error) {
    console.error('Error fetching boards:', error);
    return [];
  }
}

export async function createBoard(name: string): Promise<Board> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.post(`${HTTP_BACKEND}/room`, {
      roomName: name,
    }, {
      headers: {
        'Authorization': `${token}`
      }
    });
    return response.data.room;
  } catch (error) {
    console.error('Error creating board:', error);
    return {
      id: '',
      slug: '',
      createdAt: '',
      updatedAt: '',
      collaborators: [],
    };
  }
}

export async function deleteBoardById(boardId: string): Promise<DeleteBoardResponse | undefined> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const res = await axios.delete(`${HTTP_BACKEND}/rooms/${boardId}`, {
      headers: {
        'Authorization': `${token}`
      }
    });
    return res.data;
  } catch (error) {
    console.error('Error deleting board:', error);
  }
}