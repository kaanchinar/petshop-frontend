"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useGetApiAuthMe } from '@/lib/api/auth/auth';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, userData?: User) => void;
  logout: () => void;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  // Only fetch user data if we're not on auth pages
  const shouldFetchUser = pathname !== '/sign-in' && pathname !== '/sign-up';
  
  // Use the generated API hook with proper error handling
  const { data: userData, isLoading, error, refetch } = useGetApiAuthMe({
    query: {
      enabled: shouldFetchUser, // Only run query when not on auth pages
      retry: 1, // Try once on error
      staleTime: 0, // Always check for fresh data
      refetchOnWindowFocus: true, // Refetch when window gains focus
      refetchOnMount: true, // Always refetch on mount
      refetchInterval: false, // Disable periodic refetching
    }
  });

  // Debug logging
  console.log('Auth Context Debug:', {
    pathname,
    shouldFetchUser,
    userData,
    isLoading,
    error,
    user,
    isAuthenticated: !!user && !error
  });

  const isAuthenticated = !!user && !error;

  // Update user state when API data changes
  useEffect(() => {
    // Only process data if we should be fetching user data
    if (!shouldFetchUser) return;
    
    if (userData?.data) {
      const apiUser = userData.data;
      const userObj: User = {
        id: apiUser.id || '',
        email: apiUser.email || '',
        firstName: apiUser.firstName || undefined,
        lastName: apiUser.lastName || undefined,
        createdAt: apiUser.createdAt || undefined,
      };
      setUser(userObj);
    } else if (error) {
      // Only clear user if we have a definitive error and we're supposed to be fetching
      if ((error as any)?.status === 401) {
        setUser(null);
      }
    }
  }, [userData, error, shouldFetchUser]);

  const login = useCallback((token: string, userData?: User) => {
    // After successful login, refetch user data from API
    refetch();
  }, [refetch]);

  const logout = useCallback(async () => {
    try {
      // Call logout endpoint to clear HTTP-only cookie
      await fetch('http://localhost:8080/api/Auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      // Clear user data from localStorage
      localStorage.removeItem('currentUser');
      // Clear any remaining auth tokens
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      router.push('/sign-in');
    }
  }, [router]);

  const refetchUser = useCallback(() => {
    if (shouldFetchUser) {
      refetch();
    }
  }, [refetch, shouldFetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        refetchUser,
      }}
    >
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
