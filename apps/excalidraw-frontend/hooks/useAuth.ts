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
    document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
    document.cookie = `user_id=${userId}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
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