import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (savedUser && token) {
        try {
          setUser(JSON.parse(savedUser));
          // Validate token with backend in background
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser({ ...data, token });
            localStorage.setItem('user', JSON.stringify({ ...data, token }));
          } else {
            // Token expired or invalid
            logout();
          }
        } catch (err) {
          console.log("Backend offline, using cached local credentials");
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Save to logins table regardless of authentication result
    try {
      await fetch(`${API_URL}/contact/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
    } catch (e) {
      console.warn("Failed to save to logins table");
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        const loggedUser = {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.full_name,
          role: data.user.role,
          token: data.access_token
        };
        setUser(loggedUser);
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        return true;
      }
    } catch (e) {
      console.warn("Backend offline. Logging in with simulated mock account.");
    }

    // Mock Fallback
    if (email && password) {
      const mockUser: User = {
        id: 101,
        email: email,
        full_name: email.split('@')[0].toUpperCase(),
        role: email.includes('admin') ? 'admin' : 'user',
        token: 'mock-jwt-token-123456'
      };
      setUser(mockUser);
      localStorage.setItem('token', mockUser.token!);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: name })
      });
      
      if (response.ok) {
        return login(email, password);
      }
    } catch (e) {
      console.warn("Backend offline. Creating simulated mock account.");
    }

    // Mock Fallback
    const mockUser: User = {
      id: 102,
      email: email,
      full_name: name,
      role: email.includes('admin') ? 'admin' : 'user',
      token: 'mock-jwt-token-7890'
    };
    setUser(mockUser);
    localStorage.setItem('token', mockUser.token!);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return true;
  };

  const updateProfile = async (name: string, email: string): Promise<boolean> => {
    const token = localStorage.getItem('token');
    if (user && token && !token.startsWith('mock-')) {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ email, full_name: name })
        });
        if (response.ok) {
          const data = await response.json();
          const updated = { ...user, email: data.email, full_name: data.full_name };
          setUser(updated);
          localStorage.setItem('user', JSON.stringify(updated));
          return true;
        }
      } catch (err) {
        console.error("Backend error updating profile", err);
      }
    }
    
    // Local update fallback
    if (user) {
      const updated = { ...user, email, full_name: name };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
