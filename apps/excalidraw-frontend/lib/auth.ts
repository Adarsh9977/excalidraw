'use server'
import { cookies } from 'next/headers';

export async function getAuthToken() {
  if (typeof window === 'undefined') {
    // Server-side
    const cookieStore =await cookies();
    return cookieStore.get('auth_token')?.value;
  } else {
    // Client-side
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1];
  }
}