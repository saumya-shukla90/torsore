import { useState, useEffect } from "react";
import { Star, User, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { ReviewForm } from "./ReviewForm";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  created_at: string;
  user_id: string;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? "fill-primary text-primary" : "text-muted"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="py-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <StarRating rating={review.rating} />
            <span className="text-sm text-muted-foreground">
              {format(new Date(review.created_at), "MMM d, yyyy")}
            </span>
          </div>
          {review.title && (
            <h4 className="font-medium text-foreground mb-1">{review.title}</h4>
          )}
          {review.content && (
            <p className="text-muted-foreground leading-relaxed">{review.content}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"recent" | "highest" | "lowest">("recent");

  const fetchReviews = async () => {
    setLoading(true);
    
    let query = supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId);

    if (sortBy === "recent") {
      query = query.order("created_at", { ascending: false });
    } else if (sortBy === "highest") {
      query = query.order("rating", { ascending: false });
    } else {
      query = query.order("rating", { ascending: true });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching reviews:", error);
    } else {
      setReviews(data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy]);

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
  }));

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-2xl md:text-3xl text-center mb-8">
          Customer Reviews
        </h2>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Reviews Summary */}
          <div className="lg:col-span-1">
            <div className="bg-muted/30 rounded-lg p-6 mb-6">
              <div className="text-center mb-4">
                <div className="text-4xl font-semibold text-foreground mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <StarRating rating={Math.round(averageRating)} />
                <p className="text-sm text-muted-foreground mt-2">
                  Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                </p>
              </div>

              <Separator className="my-4" />

              {/* Rating Breakdown */}
              <div className="space-y-2">
                {ratingCounts.map(({ rating, count }) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm w-8">{rating} ★</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{
                          width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : "0%",
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Form */}
            <ReviewForm productId={productId} onReviewSubmitted={fetchReviews} />
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">
                {reviews.length} Review{reviews.length !== 1 ? "s" : ""}
              </h3>
              <Select value={sortBy} onValueChange={(value: "recent" | "highest" | "lowest") => setSortBy(value)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="highest">Highest Rated</SelectItem>
                  <SelectItem value="lowest">Lowest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground mb-2">No reviews yet</p>
                <p className="text-sm text-muted-foreground">
                  Be the first to review {productName}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
