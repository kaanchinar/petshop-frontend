"use client";

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetApiAuthGoogleCallback } from '@/lib/api/auth/auth';
import { useAuth } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, refetchUser } = useAuth();
  const hasProcessed = useRef(false);

  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Use the generated hook to handle Google callback
  const { data: callbackData, isLoading, error: callbackError } = useGetApiAuthGoogleCallback(
    { code: code || undefined, state: state || undefined },
    { 
      query: { 
        enabled: !!code && !hasProcessed.current && !error,
        retry: false 
      } 
    }
  );

  useEffect(() => {
    if (error) {
      console.error('Google OAuth error:', error);
      router.push('/sign-in?error=oauth_error');
      return;
    }

    if (callbackData && !hasProcessed.current) {
      hasProcessed.current = true;
      
      // The callback was successful, user should be authenticated
      // Trigger a refetch of user data
      refetchUser();
      
      // Redirect based on state parameter
      if (state === 'signup') {
        router.push('/?welcome=true');
      } else {
        router.push('/');
      }
    }

    if (callbackError && !hasProcessed.current) {
      hasProcessed.current = true;
      console.error('Google callback error:', callbackError);
      router.push('/sign-in?error=callback_error');
    }
  }, [callbackData, callbackError, error, state, router, refetchUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-2">Completing Sign In</h1>
          <p className="text-muted-foreground">Please wait while we complete your Google authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">Processing Authentication</h1>
        <p className="text-muted-foreground">Redirecting you...</p>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Loading</h1>
        <p className="text-muted-foreground">Please wait...</p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
