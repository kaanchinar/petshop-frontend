"use client";

import { useAuth } from "@/context/auth-context";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Mail, User, UserCheck } from "lucide-react";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect to sign-in if not authenticated
  if (!isLoading && !isAuthenticated) {
    redirect("/sign-in");
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if user is not loaded
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground mb-4">
            Unable to load your profile information.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>
              Your personal details and account settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={user.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                Your email address cannot be changed
              </p>
            </div>

            <Separator />

            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                value={user.firstName || ""}
                disabled
                className="bg-muted"
                placeholder="Not provided"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={user.lastName || ""}
                disabled
                className="bg-muted"
                placeholder="Not provided"
              />
            </div>

            <Separator />

            {/* Account Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Account Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    User ID
                  </Label>
                  <Input
                    value={user.id || ""}
                    disabled
                    className="bg-muted font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Member Since
                  </Label>
                  <Input
                    value={formatDate(user.createdAt)}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1" disabled>
                Edit Profile
                <span className="ml-2 text-xs">(Coming Soon)</span>
              </Button>
              <Button variant="outline" className="flex-1" disabled>
                Change Password
                <span className="ml-2 text-xs">(Coming Soon)</span>
              </Button>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Profile editing functionality is currently under development. 
                Contact support if you need to update your information.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
