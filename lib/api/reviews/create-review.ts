import { useMutation, useQueryClient } from "@tanstack/react-query";
import customAxios from "@/lib/axios";

export interface CreateReviewRequest {
  productId: number;
  rating: number;
  comment: string;
  reviewerName?: string;
}

export interface CreateReviewResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    productId: number;
    rating: number;
    comment: string;
    reviewerName: string;
    createdAt: string;
  };
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  
  return useMutation<CreateReviewResponse, Error, CreateReviewRequest>({
    mutationFn: async (reviewData) => {
      return await customAxios({
        url: `/api/reviews`,
        method: "POST",
        data: reviewData,
      });
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch products to update ratings
      queryClient.invalidateQueries({ queryKey: ['getApiProducts'] });
      queryClient.invalidateQueries({ queryKey: ['getApiProductsId', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['getAllReviews'] });
    },
  });
}
