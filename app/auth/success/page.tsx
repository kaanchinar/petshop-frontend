'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const processAuthCallback = async () => {
      try {
        // Get any query parameters that might contain auth info
        const token = searchParams.get('token');
        const error = searchParams.get('error');
        const user = searchParams.get('user');

        if (error) {
          setSuccess(false);
          setMessage(error);
          setIsProcessing(false);
          return;
        }

        if (token) {
          // Store the token if provided
          localStorage.setItem('token', token);
        }

        if (user) {
          try {
            // Store user data if provided
            const userData = JSON.parse(decodeURIComponent(user));
            localStorage.setItem('user', JSON.stringify(userData));
          } catch (e) {
            console.warn('Failed to parse user data:', e);
          }
        }

        setSuccess(true);
        setMessage('Successfully signed in with Google!');
        setIsProcessing(false);

        // Redirect to home page after a short delay
        setTimeout(() => {
          router.push('/');
        }, 2000);

      } catch (error) {
        console.error('Auth callback error:', error);
        setSuccess(false);
        setMessage('An error occurred during authentication');
        setIsProcessing(false);
      }
    };

    processAuthCallback();
  }, [searchParams, router]);

  const handleContinue = () => {
    router.push('/');
  };

  const handleRetry = () => {
    router.push('/sign-in');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4">
            {isProcessing ? (
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            ) : success ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {isProcessing ? 'Processing...' : success ? 'Success!' : 'Authentication Failed'}
          </CardTitle>
          <CardDescription>
            {isProcessing 
              ? 'Please wait while we complete your sign in'
              : message
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isProcessing && (
            <div className="space-y-4">
              {success ? (
                <>
                  <p className="text-sm text-gray-600 text-center">
                    You will be redirected to the home page in a moment.
                  </p>
                  <Button 
                    onClick={handleContinue} 
                    className="w-full"
                  >
                    Continue to Home
                  </Button>
                </>
              ) : (
                <div className="space-y-3">
                  <Button 
                    onClick={handleRetry} 
                    className="w-full"
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={handleContinue} 
                    variant="outline" 
                    className="w-full"
                  >
                    Go to Home
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
