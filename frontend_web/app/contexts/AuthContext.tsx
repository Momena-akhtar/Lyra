'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { signInWithGoogle as firebaseGoogleSignIn, getCurrentUser, signOut as firebaseSignOut } from '../utils/firebase';

interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt: Date;
  lastSignInAt: Date;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface AuthContextType {
  user: AuthUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already signed in
    const currentUser = getCurrentUser();
    if (currentUser) {
      setFirebaseUser(currentUser);
      // You can fetch user profile from backend here if needed
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      setUser(data.data.user);
    } catch (error: any) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, displayName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      setUser(data.data.user);
    } catch (error: any) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { idToken } = await firebaseGoogleSignIn();
      
      const response = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Google authentication failed');
      }

      const data = await response.json();
      setUser(data.data.user);
    } catch (error: any) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut();
      setUser(null);
      setFirebaseUser(null);
    } catch (error: any) {
      throw error;
    }
  };

  const value = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
