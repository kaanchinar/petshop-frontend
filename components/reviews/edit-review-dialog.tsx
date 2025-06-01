"use client";

import { useState, useEffect } from "react";
import { usePutApiReviewsId } from "@/lib/api/reviews/reviews";
import { ReviewDto } from "@/lib/api/petPetAPI.schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EditReviewDialogProps {
  review: ReviewDto;
  onSuccess?: () => void;
  children: React.ReactNode;
}

export function EditReviewDialog({ review, onSuccess, children }: EditReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(review.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState(review.title || "");
  const [comment, setComment] = useState(review.comment || "");

  const updateReviewMutation = usePutApiReviewsId();

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setRating(review.rating || 0);
      setTitle(review.title || "");
      setComment(review.comment || "");
      setHoveredRating(0);
    }
  }, [open, review]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    if (!review.id) {
      toast.error("Review ID is missing");
      return;
    }

    try {
      await updateReviewMutation.mutateAsync({
        id: review.id,
        data: {
          rating,
          comment: comment.trim(),
          title: title.trim() || undefined,
        },
      });

      toast.success("Review updated successfully!");
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to update review");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Your Review</DialogTitle>
          <DialogDescription>
            Update your review for {review.productName || "this product"}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => {
                const star = i + 1;
                return (
                  <button
                    key={star}
                    type="button"
                    className="text-2xl focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoveredRating || rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-title">Review Title (Optional)</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of your review"
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              {title.length}/100 characters
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="edit-comment">Review Comment *</Label>
            <Textarea
              id="edit-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              className="min-h-[100px] resize-none"
              maxLength={1000}
              required
            />
            <p className="text-xs text-muted-foreground">
              {comment.length}/1000 characters
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={updateReviewMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateReviewMutation.isPending || rating === 0 || !comment.trim()}
            >
              {updateReviewMutation.isPending ? "Updating..." : "Update Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
