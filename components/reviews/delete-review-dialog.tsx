"use client";

import { useState } from "react";
import { useDeleteApiReviewsId } from "@/lib/api/reviews/reviews";
import { ReviewDto } from "@/lib/api/petPetAPI.schemas";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteReviewDialogProps {
  review: ReviewDto;
  onSuccess?: () => void;
  children: React.ReactNode;
}

export function DeleteReviewDialog({ review, onSuccess, children }: DeleteReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const deleteReviewMutation = useDeleteApiReviewsId();

  const handleDelete = async () => {
    if (!review.id) {
      toast.error("Review ID is missing");
      return;
    }

    try {
      await deleteReviewMutation.mutateAsync({ id: review.id });
      toast.success("Review deleted successfully!");
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Review</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete your review for "{review.productName || "this product"}"? 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteReviewMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteReviewMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteReviewMutation.isPending ? "Deleting..." : "Delete Review"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
