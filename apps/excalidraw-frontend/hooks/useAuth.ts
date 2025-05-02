import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  token: string | null;
  userId: string | null;
  user: User | null;
}

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthState>({
    token: null,
    userId: null,
    user: null
  });

  useEffect(() => {
    const storedToken = Cookies.get('auth_token');
    const storedUserId = Cookies.get('user_id');
    const storedUser = Cookies.get('user');

    if (storedToken && storedUserId && storedUser) {
      setAuth({ 
        token: storedToken, 
        userId: storedUserId,
        user: JSON.parse(storedUser)
      });
    }
  }, []);

  const login = (token: string, userId: string, userData: User) => {
    // Set cookies with 7 days expiry
    Cookies.set('auth_token', token, { expires: 7, sameSite: 'lax' });
    Cookies.set('user_id', userId, { expires: 7, sameSite: 'lax' });
    Cookies.set('user', JSON.stringify(userData), { expires: 7, sameSite: 'lax' });

    setAuth({ token, userId, user: userData });
  };

  const logout = () => {
    Cookies.remove('auth_token');
    Cookies.remove('user_id');
    Cookies.remove('user');
    setAuth({ token: null, userId: null, user: null });
  };

  return {
    token: auth.token,
    userId: auth.userId,
    user: auth.user,
    isAuthenticated: !!auth.token,
    login,
    logout
  };
};