"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePostApiAuthLogin, useGetApiAuthGoogleUrl } from "@/lib/api/auth/auth";
import { useAuth } from "@/context/auth-context";
import type { LoginDto } from "@/lib/api/petPetAPI.schemas";

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Check for OAuth errors in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthError = urlParams.get('error');
    if (oauthError === 'oauth_error') {
      setError('Google OAuth authentication failed. Please try again.');
    } else if (oauthError === 'callback_error') {
      setError('Authentication callback failed. Please try again.');
    }
  }, []);
  
  const loginMutation = usePostApiAuthLogin();

  // Get Google OAuth URL from the backend
  const { data: googleUrlData, refetch: getGoogleUrl } = useGetApiAuthGoogleUrl(
    { state: 'login' }, 
    { query: { enabled: false } }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const credentials: LoginDto = {
      email: email,
      password: password,
    };

    try {
      const response = await loginMutation.mutateAsync({ data: credentials });
      
      // With HTTP-only cookies, the token is automatically stored in cookies
      // We just need to trigger a refetch of user data
      const authData = response.data;
      
      if (authData?.user || authData?.token) {
        // Call login to trigger auth context to refetch user data
        login(authData.token || '');
        
        console.log("Login successful:", response);
        router.push("/");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Login failed:", err);
      const errorMessage = err instanceof Error && err.message 
        ? err.message 
        : (err as any)?.response?.data?.message 
        || "Invalid email or password.";
      setError(errorMessage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Sign In to PetPals</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Please enter your details.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loginMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loginMutation.isPending}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                  disabled={loginMutation.isPending}
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me for 30 days
                </Label>
              </div>
              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          {error && (
            <p className="text-red-500 text-sm px-6 pb-4">Error: {error}</p>
          )}
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Button
                variant="outline"
                type="button"
                className="flex items-center justify-center gap-2"
                disabled={isGoogleLoading}
                onClick={async () => {
                  try {
                    setIsGoogleLoading(true);
                    setError(null);
                    // Get Google OAuth URL from backend
                    const response = await getGoogleUrl();
                    if (response.data?.data) {
                      // Redirect to Google OAuth URL
                      window.location.href = response.data.data;
                    }
                  } catch (error) {
                    console.error('Failed to get Google OAuth URL:', error);
                    setError('Failed to initialize Google OAuth');
                    setIsGoogleLoading(false);
                  }
                }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isGoogleLoading ? "Connecting..." : "Continue with Google"}
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

