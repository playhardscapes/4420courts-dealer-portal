'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'DEALER' | 'MANAGER';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials for development - replace with real auth in production
const DEMO_USERS = [
  {
    id: '1',
    email: 'admin@4420courts.com',
    password: 'admin123',
    name: '4420 Courts Admin',
    role: 'ADMIN' as const
  },
  {
    id: '2', 
    email: 'dealer@4420courts.com',
    password: 'dealer123',
    name: 'Demo Dealer',
    role: 'DEALER' as const
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on load
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('4420courts-dealer-user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('4420courts-dealer-user');
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Demo authentication - replace with real API call in production
      const user = DEMO_USERS.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return { success: false, error: 'Invalid credentials' };
      }

      const userSession = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      };

      setUser(userSession);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('4420courts-dealer-user', JSON.stringify(userSession));
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('4420courts-dealer-user');
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}