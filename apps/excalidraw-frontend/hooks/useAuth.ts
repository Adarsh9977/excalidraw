import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AuthToken {
  token: string | null;
  userId: string | null;
}

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthToken>({
    token: null,
    userId: null
  });

  useEffect(() => {
    // Load token from cookies on mount
    const storedToken = Cookies.get('auth_token');
    const storedUserId = Cookies.get('user_id');
    if (storedToken && storedUserId) {
      setAuth({ token: storedToken, userId: storedUserId });
    }
  }, []);

  const login = (token: string, userId: string) => {
    // Set cookies with expiry (e.g., 7 days)
    Cookies.set('auth_token', token, { 
      expires: 7,
      secure: true,
      sameSite: 'strict'
    });
    Cookies.set('user_id', userId, { 
      expires: 7,
      secure: true,
      sameSite: 'strict'
    });
    setAuth({ token, userId });
  };

  const logout = () => {
    Cookies.remove('auth_token');
    Cookies.remove('user_id');
    setAuth({ token: null, userId: null });
  };

  return {
    token: auth.token,
    userId: auth.userId,
    isAuthenticated: !!auth.token,
    login,
    logout
  };
};