import axios from 'axios';

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
    const response = await axios.get('http://localhost:3000/api/rooms');
    return {status:response.status, data: response.data.rooms};

  } catch (error) {
    console.error('Error fetching boards:', error);
    return {status:400, data: []};
  }
}

export async function getMyBoards(): Promise<{status: Number, data: Board[]}> {
  try {

    const response = await axios.get('/api/myrooms');
    return {status:response.status, data: response.data.rooms};
  } catch (error) {
    console.error('Error fetching boards:', error);
    return {status:400, data: []};
  }
}

export async function createBoard(name: string): Promise<{status: Number, data: Board} | undefined> {
  try {

    const response = await axios.post('/api/room', {
      roomName: name,
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

    const res = await axios.delete(`/api/rooms/${boardId}`);
    return {status:res.status, data: res.data};
  } catch (error) {
    console.error('Error deleting board:', error);
    return {status:400, data: undefined};
  }
}