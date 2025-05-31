"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetApiUserManagementPermissions } from "@/lib/api/user-management/user-management";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Get user permissions from backend
  const { 
    data: permissionsData, 
    isLoading: permissionsLoading, 
    error: permissionsError 
  } = useGetApiUserManagementPermissions({
    query: { 
      enabled: isAuthenticated && !!user
    }
  });

  const isLoading = authLoading || permissionsLoading;
  const permissions = (permissionsData as any)?.data;
  const hasAdminAccess = permissions?.hasAdminRole === true || permissions?.isAdmin === true;

  console.log('🔍 AdminGuard Debug:', {
    authLoading,
    permissionsLoading,
    isLoading,
    isAuthenticated,
    permissionsData,
    permissions,
    hasAdminAccess,
    permissionsError
  });

  // Don't redirect - just show status
  useEffect(() => {
    console.log('🚀 AdminGuard useEffect:', {
      isLoading,
      isAuthenticated,
      hasAdminAccess,
      permissionsError
    });
  }, [isLoading, isAuthenticated, hasAdminAccess, permissionsError]);

  // Show loading while checking
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Grant access if authenticated and has admin permissions
  if (isAuthenticated && hasAdminAccess && !permissionsError) {
    return <>{children}</>;
  }

  // Fallback while redirecting
  return null;
}
