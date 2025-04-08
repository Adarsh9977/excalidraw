'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  return (
    <div style={{
      backgroundColor: 'black',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      height: '100vh',
      width: '100vw',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
      }}>
        <input style={{
          padding: '10px',
          borderRadius: '5px',
          border: 'none',
          width: '100%',
        }} value={roomId} onChange={(e)=> setRoomId(e.target.value)} type="text" placeholder="Room ID" />
        <button style={{
          padding: '10px',
          borderRadius: '5px',
          border: 'none',
          width: '100%',
          backgroundColor: 'blue',
          color: 'white',
        }} onClick={()=> router.push(`/room/${roomId}`)}>Join</button>
      </div>
    </div>
  );
}
