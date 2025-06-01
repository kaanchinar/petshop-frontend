"use client";

import { useState } from "react";
import { useGetApiReviewsMy } from "@/lib/api/reviews/reviews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { EditReviewDialog } from "@/components/reviews/edit-review-dialog";
import { DeleteReviewDialog } from "@/components/reviews/delete-review-dialog";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function MyReviewsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const { data: reviewsData, isLoading, refetch } = useGetApiReviewsMy({
    query: {
      enabled: isAuthenticated,
    },
  });

  const reviews = reviewsData || [];

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <CardTitle>Sign In Required</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                You need to be signed in to view your reviews.
              </p>
              <Button asChild className="w-full">
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Reviews</h1>
        <p className="text-muted-foreground">
          Manage your product reviews and ratings
        </p>
      </div>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Star className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              You haven't written any reviews yet. Start by purchasing a product and leaving your feedback!
            </p>
            <Button asChild>
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Your Reviews ({reviews.length})
            </h2>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {review.productName || "Product"}
                          </h3>
                          {review.isVerifiedPurchase && (
                            <Badge variant="secondary" className="text-xs">
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= (review.rating || 0)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {review.createdAt && 
                              formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })
                            }
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <EditReviewDialog review={review} onSuccess={refetch}>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </EditReviewDialog>
                        <DeleteReviewDialog review={review} onSuccess={refetch}>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </DeleteReviewDialog>
                      </div>
                    </div>

                    {/* Title */}
                    {review.title && (
                      <h4 className="font-medium text-foreground">{review.title}</h4>
                    )}

                    {/* Comment */}
                    {review.comment && (
                      <p className="text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 pt-2 border-t text-sm text-muted-foreground">
                      <span>
                        {review.helpfulVotes || 0} people found this helpful
                      </span>
                      {(review.unhelpfulVotes || 0) > 0 && (
                        <span>
                          {review.unhelpfulVotes} found this not helpful
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
