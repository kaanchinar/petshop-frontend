"use client";

import { useState } from "react";
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
import { authApi } from "@/lib/services/authApi"; // Import the authApi
import type { LoginRequest } from "@/lib/types"; // Import LoginRequest type

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState(""); // Changed to email from username for LoginRequest
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null); // For displaying login errors
  const [isSubmitting, setIsSubmitting] = useState(false); // For loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const credentials: LoginRequest = {
      username: email, // Mapping email state to username for the API
      password: password,
    };

    try {
      const response = await authApi.login(credentials);
      // Assuming a successful login returns a token or some user data
      // Store the token (e.g., in localStorage or context)
      console.log("Login successful:", response);
      // For now, just an alert and redirect. Implement proper session management.
      alert("Login successful!");
      router.push("/"); // Redirect to main page
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err instanceof Error ? err.message : "Invalid email or password."
      );
    } finally {
      setIsSubmitting(false);
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                  disabled={isSubmitting}
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me for 30 days
                </Label>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing In..." : "Sign In"}
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
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                type="button"
                className="flex items-center justify-center gap-2"
              >
                <Image
                  src="/placeholder.svg?height=20&width=20&text=G"
                  alt="Google"
                  width={20}
                  height={20}
                />
                Google
              </Button>
              <Button
                variant="outline"
                type="button"
                className="flex items-center justify-center gap-2"
              >
                <Image
                  src="/placeholder.svg?height=20&width=20&text=F"
                  alt="Facebook"
                  width={20}
                  height={20}
                />
                Facebook
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Don't have an account?{" "}
              <Link href="#" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

