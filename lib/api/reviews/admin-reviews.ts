import { useQuery } from "@tanstack/react-query";
import { useGetApiProducts } from "@/lib/api/products/products";
import type { ReviewDto, ProductDto } from "@/lib/api/petPetAPI.schemas";

// Custom hook to get all reviews for admin dashboard
export const useGetAllReviews = () => {
  // First, get all products
  const { data: productsResponse, isLoading: isLoadingProducts } = useGetApiProducts();

  // Create a query that fetches reviews for all products
  return useQuery({
    queryKey: ["admin-all-reviews"],
    queryFn: async (): Promise<ReviewDto[]> => {
      const products = productsResponse?.data?.items;
      
      if (!products || products.length === 0) {
        return [];
      }

      // Fetch reviews for all products in parallel
      const reviewPromises = products.map(async (product: ProductDto) => {
        try {
          const response = await fetch(`http://localhost:8080/api/Reviews/product/${product.id}`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) {
            console.warn(`Failed to fetch reviews for product ${product.id}`);
            return [];
          }
          
          const reviews: ReviewDto[] = await response.json();
          return reviews;
        } catch (error) {
          console.warn(`Error fetching reviews for product ${product.id}:`, error);
          return [];
        }
      });

      const allReviewArrays = await Promise.all(reviewPromises);
      
      // Flatten the array of arrays into a single array
      const allReviews = allReviewArrays.flat();
      
      // Sort by creation date (newest first)
      return allReviews.sort((a: ReviewDto, b: ReviewDto) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    },
    enabled: !!productsResponse?.data?.items && productsResponse.data.items.length > 0 && !isLoadingProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for admin dashboard
  });
};
