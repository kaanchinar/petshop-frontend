"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string; // Default to home page
}

export function AuthGuard({ children, fallback, redirectTo = "/" }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!isLoading && !hasChecked) {
      setHasChecked(true);
      
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }
    }
  }, [isLoading, isAuthenticated, router, redirectTo, hasChecked]);

  // Show loading spinner while checking authentication
  if (isLoading || !hasChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect)
  if (!isAuthenticated) {
    return fallback || null;
  }

  // User is authenticated
  return <>{children}</>;
}
