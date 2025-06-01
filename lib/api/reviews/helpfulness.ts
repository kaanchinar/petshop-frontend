import { useMutation } from "@tanstack/react-query";
import { customAxios } from "@/lib/axios";

interface HelpfulnessRequest {
  reviewId: number;
  isHelpful: boolean;
}

// Custom helpfulness API call
export const postReviewHelpfulness = async (data: HelpfulnessRequest) => {
  // Use lowercase endpoint
  const response = await customAxios({
    url: `/api/reviews/helpfulness`,
    method: 'POST',
    data: data,
  });
  return response;
};

export const useReviewHelpfulness = () => {
  return useMutation({
    mutationFn: postReviewHelpfulness,
  });
};
