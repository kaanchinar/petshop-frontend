"use client";

import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Star } from "lucide-react";
import type { ReviewDto } from "@/lib/api/petPetAPI.schemas";


interface ReviewItemProps {
  review: ReviewDto;
}



export default function ReviewItem({ review }: ReviewItemProps) {
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{review.userName || "Anonymous"}</span>
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
                  {review.createdAt && formatDate(review.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Title */}
          {review.title && (
            <h4 className="font-medium text-foreground">{review.title}</h4>
          )}

          {/* Comment */}
          {review.comment && (
            <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
