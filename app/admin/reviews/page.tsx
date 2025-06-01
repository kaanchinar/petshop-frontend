"use client";

import { useState } from "react";
import { useGetAllReviews } from "@/lib/api/reviews/admin-reviews";
import { useDeleteApiReviewsId } from "@/lib/api/reviews/reviews";
import { ReviewDto } from "@/lib/api/petPetAPI.schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Search, Trash2, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { format } from "date-fns";
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

export default function AdminReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  
  // Fetch all reviews for admin dashboard
  const { data: reviews = [], isLoading, refetch } = useGetAllReviews();

  const deleteReviewMutation = useDeleteApiReviewsId();

  const handleDeleteReview = async (reviewId: number) => {
    try {
      console.log("🗑️ Attempting to delete review:", reviewId);
      await deleteReviewMutation.mutateAsync({ id: reviewId });
      toast.success("Review deleted successfully");
      refetch();
    } catch (error: any) {
      console.error("🗑️ Delete review error:", error);
      console.error("🗑️ Error response:", error.response);
      console.error("🗑️ Error status:", error.response?.status);
      console.error("🗑️ Full error object:", JSON.stringify(error, null, 2));
      
      if (error.response?.status === 401) {
        toast.error("You need to be authenticated to delete reviews");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to delete reviews");
      } else if (error.response?.status === 404) {
        toast.error("Review not found");
      } else {
        toast.error("Failed to delete review");
      }
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const filteredReviews = reviews?.filter((review: ReviewDto) => {
    const matchesSearch = searchTerm === "" || 
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = filterRating === "all" || review.rating === parseInt(filterRating);
    
    return matchesSearch && matchesRating;
  }).sort((a: ReviewDto, b: ReviewDto) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      case "oldest":
        return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
      case "rating-high":
        return (b.rating || 0) - (a.rating || 0);
      case "rating-low":
        return (a.rating || 0) - (b.rating || 0);
      case "helpful":
        return (b.helpfulVotes || 0) - (a.helpfulVotes || 0);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Review Management</h1>
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 5 }, (_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Review Management</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Badge variant="secondary">
            {filteredReviews?.length || 0} reviews
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviews?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews && reviews.length > 0
                ? (reviews.reduce((sum: number, review: ReviewDto) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
                : "0.0"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">5-Star Reviews</CardTitle>
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews?.filter((r: ReviewDto) => r.rating === 5).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">1-Star Reviews</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews?.filter((r: ReviewDto) => r.rating === 1).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reviews by content, title, or user email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="rating-high">Highest Rating</SelectItem>
                <SelectItem value="rating-low">Lowest Rating</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews?.map((review: ReviewDto) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(review.rating || 0)}</div>
                    <span className="text-sm text-gray-500">
                      {review.rating || 0}/5
                    </span>
                    {review.isVerifiedPurchase && (
                      <Badge variant="secondary" className="text-xs">
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                  {review.title && (
                    <h3 className="font-semibold text-lg">{review.title}</h3>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>By {review.userName || "Anonymous"}</span>
                    <span>•</span>
                    <span>{review.createdAt ? format(new Date(review.createdAt), "MMM d, yyyy") : "Unknown date"}</span>
                    <span>•</span>
                    <span>Product ID: {review.productId}</span>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Review</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this review? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => review.id && handleDeleteReview(review.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{review.comment}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>👍 {review.helpfulVotes || 0} helpful</span>
                  <span>👎 {review.unhelpfulVotes || 0} not helpful</span>
                </div>
                {review.orderId && (
                  <span>Order: {review.orderId}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredReviews?.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No reviews found</h3>
                <p className="text-gray-500">
                  {searchTerm || filterRating !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "No reviews have been submitted yet."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
