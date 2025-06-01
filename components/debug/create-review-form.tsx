"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateReview } from "@/lib/api/reviews/create-review";
import { Star } from "lucide-react";

export default function CreateReviewForm({ productId }: { productId: number }) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  
  const createReviewMutation = useCreateReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      alert("Please enter a comment");
      return;
    }

    try {
      await createReviewMutation.mutateAsync({
        productId,
        rating,
        comment: comment.trim(),
        reviewerName: reviewerName.trim() || "Anonymous"
      });
      
      // Reset form
      setComment("");
      setReviewerName("");
      setRating(5);
      
      alert("Review created successfully! Check the product card to see if ratings update.");
    } catch (error) {
      console.error("Failed to create review:", error);
      alert(`Failed to create review: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Test Review - Product {productId}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-yellow-400 hover:text-yellow-500 transition-colors"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? "fill-current" : ""
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">{rating} star{rating !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reviewer Name (Optional)</label>
            <Input
              type="text"
              placeholder="Anonymous"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Comment</label>
            <Textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            disabled={createReviewMutation.isPending || !comment.trim()}
            className="w-full"
          >
            {createReviewMutation.isPending ? "Creating..." : "Create Review"}
          </Button>

          {createReviewMutation.error && (
            <p className="text-xs text-destructive">
              {createReviewMutation.error instanceof Error 
                ? createReviewMutation.error.message 
                : "Failed to create review"}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
