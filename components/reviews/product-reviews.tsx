"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, Filter, SortDesc } from "lucide-react";
import {
  useGetApiReviewsProductProductId,
  useGetApiReviewsProductProductIdSummary,
} from "@/lib/api/reviews/reviews";
import ReviewItem from "./review-item";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductReviewsProps {
  productId: number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    refetch: refetchReviews,
  } = useGetApiReviewsProductProductId(productId);

  const {
    data: summaryData,
    isLoading: summaryLoading,
    refetch: refetchSummary,
  } = useGetApiReviewsProductProductIdSummary(productId);

  const reviews = reviewsData || [];
  const summary = summaryData;

  const handleRefresh = () => {
    refetchReviews();
    refetchSummary();
  };

  // Apply filtering and sorting
  const filteredAndSortedReviews = reviews
    .filter((review) => {
      if (filterRating === "all") return true;
      return review.rating === parseInt(filterRating);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt || "").getTime() -
            new Date(b.createdAt || "").getTime()
          );
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

  const displayedReviews = showAllReviews
    ? filteredAndSortedReviews
    : filteredAndSortedReviews.slice(0, 3);

  if (reviewsLoading || summaryLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">
              {filteredAndSortedReviews.length}{" "}
              {filteredAndSortedReviews.length === 1 ? "review" : "reviews"}
            </Badge>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
            <p className="text-muted-foreground">
              Be the first to review this product!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Summary Section */}
          {summary && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Average Rating */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    Overall Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-6xl font-bold">
                      {summary.averageRating?.toFixed(1)}
                    </div>
                    <div className="flex justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-6 h-6 ${
                            star <= Math.round(summary.averageRating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground">
                      Based on{" "}
                      {summary.totalReviews} review
                      {summary.totalReviews !== 1 ? "s" : ""}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Rating Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Rating Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count =
                        summary.ratingDistribution?.[rating.toString()] || 0;
                      const percentage =
                        summary.totalReviews && summary.totalReviews > 0
                          ? (count / summary.totalReviews) * 100
                          : 0;

                      return (
                        <div key={rating} className="flex items-center gap-3">
                          <div className="flex items-center gap-1 w-12">
                            <span className="text-sm">{rating}</span>
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          </div>
                          <Progress value={percentage} className="flex-1" />
                          <span className="text-sm text-muted-foreground w-8">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Separator />

          {/* Filters and Sorting */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <Select
                  value={filterRating}
                  onValueChange={setFilterRating}
                  defaultValue="all"
                >
                  <SelectTrigger className="w-[160px]">
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
              </div>

              <div className="flex items-center gap-2">
                <SortDesc className="h-4 w-4" />
                <Select
                  value={sortBy}
                  onValueChange={setSortBy}
                  defaultValue="newest"
                >
                  <SelectTrigger className="w-[160px]">
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
            </div>

            {filterRating !== "all" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterRating("all")}
              >
                Clear Filter
              </Button>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {displayedReviews.map((review) => (
              <ReviewItem key={review.id} review={review}  />
            ))}

            {!showAllReviews && filteredAndSortedReviews.length > 3 && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAllReviews(true)}
                >
                  Show All {filteredAndSortedReviews.length} Reviews
                </Button>
              </div>
            )}

            {showAllReviews && filteredAndSortedReviews.length > 3 && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAllReviews(false)}
                >
                  Show Less
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
