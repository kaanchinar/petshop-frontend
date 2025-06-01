"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { useGetApiReviewsCanReview } from "@/lib/api/reviews/reviews";
import ReviewForm from "./review-form";

interface ReviewButtonProps {
  productId: number;
  orderId: number;
  productName: string;
  orderStatus: string;
}

export default function ReviewButton({ productId, orderId, productName, orderStatus }: ReviewButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Check if user can review this product
  const { data: canReview } = useGetApiReviewsCanReview({
    productId,
    orderId,
  });

  // Only show review button for completed orders
  if (orderStatus !== "Completed" || !canReview) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          Write Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review: {productName}</DialogTitle>
        </DialogHeader>
        <ReviewForm
          productId={productId}
          orderId={orderId}
          onSuccess={() => setIsOpen(false)}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
