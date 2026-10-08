import { createContext, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import authService from '../services/authService';
import { setUnauthorizedHandler } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    try {
      const me = await authService.me();
      setUser(me?.user || me || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
    setUnauthorizedHandler(() => setUser(null));
  }, [loadMe]);

  const login = async (payload) => {
    const res = await authService.login(payload);
    setUser(res?.user || res);
    toast.success('Welcome back!');
    return res;
  };

  const loginWithGoogle = async (credential) => {
    const res = await authService.googleLogin(credential);
    setUser(res?.user || res);
    toast.success('Welcome back!');
    return res;
  };

  const register = async (payload) => {
    const res = await authService.register(payload);
    setUser(res?.user || res);
    toast.success('Account created — welcome to Pakistan AI!');
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      /* ignore network errors on logout */
    }
    setUser(null);
    toast.success('Logged out');
  };

  const isAdmin = user && ['admin', 'superadmin'].includes(user.role);

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, isAdmin, login, loginWithGoogle, register, logout, refresh: loadMe }}
    >
      {children}
    </AuthContext.Provider>
  );
}
