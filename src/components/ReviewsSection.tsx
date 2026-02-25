import { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useSectionContent } from "@/hooks/useSectionContent";

/* ================================
   Types
================================ */

interface Review {
  id: string;
  guest_name: string;
  guest_avatar: string | null;
  rating: number | null;
  comment: string | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  created_at: string;
}

/* ================================
   Component
================================ */

const ReviewsSection = () => {
  const { sections } = useSectionContent();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================================
     Fetch Reviews
  ================================= */

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      } else {
        setReviews(data || []);
      }

      setLoading(false);
    };

    fetchReviews();

    /* Realtime subscription */

    const channel = supabase
      .channel("reviews-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reviews",
        },
        fetchReviews
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /* ================================
     Helpers
  ================================= */

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : "0";

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getAvatar = (review: Review) => {
    if (review.guest_avatar?.startsWith("http")) {
      return (
        <img
          src={review.guest_avatar}
          alt={review.guest_name}
          className="w-full h-full object-cover"
        />
      );
    }

    const initials = review.guest_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <span className="text-gold text-sm font-medium">
        {initials}
      </span>
    );
  };

  /* ================================
     Loading State
  ================================= */

  if (loading) {
    return (
      <section id="ulasan" className="py-20 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-4">

          <header className="text-center max-w-2xl mx-auto mb-16">
            <Skeleton className="h-4 w-24 mx-auto mb-4" />
            <Skeleton className="h-10 w-64 mx-auto mb-3" />
            <Skeleton className="h-4 w-full max-w-md mx-auto mb-6" />
            <Skeleton className="h-12 w-40 mx-auto rounded-full" />
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-6">
                <Skeleton className="w-8 h-8 mb-4" />
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-20 w-full mb-6" />
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  /* ================================
     Render
  ================================= */

  return (
    <section id="ulasan" className="py-20 lg:py-32 bg-secondary/30">

      <div className="container mx-auto px-4">

        {/* ================================
            Header (SEO Correct)
        ================================= */}

        <header className="text-center max-w-2xl mx-auto mb-16">

          <span className="text-gold text-sm tracking-widest uppercase">
            {sections.testimonials.title}
          </span>

          <h2 className="section-title text-foreground mt-4">
            Ulasan Tamu
          </h2>

          <h4 className="text-muted-foreground mt-3 font-normal">
            {sections.testimonials.subtitle}
          </h4>

          {/* Overall Rating */}

          <div className="inline-flex items-center gap-4 bg-card rounded-full px-6 py-3 shadow-soft mt-6">

            <div className="text-3xl font-medium text-foreground">
              {averageRating}
            </div>

            <div>

              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(Number(averageRating))
                        ? "fill-gold text-gold"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>

              <div className="text-sm text-muted-foreground">
                {reviews.length} ulasan
              </div>

            </div>

          </div>

        </header>

        {/* ================================
            Reviews Grid
        ================================= */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {reviews.map((review, index) => (

            <article
              key={review.id}
              className="bg-card rounded-xl p-6 shadow-soft animate-fade-up"
              style={{
                animationDelay: `${index * 80}ms`,
              }}
            >

              <Quote className="w-8 h-8 text-gold/30 mb-4" />

              {/* Rating */}

              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < (review.rating || 0)
                        ? "fill-gold text-gold"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}

              {review.comment && (
                <p className="text-foreground mb-6 line-clamp-4">
                  "{review.comment}"
                </p>
              )}

              {/* Author */}

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center overflow-hidden">
                  {getAvatar(review)}
                </div>

                <div>

                  <div className="font-medium text-foreground">
                    {review.guest_name}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {formatDate(review.created_at)}
                  </div>

                </div>

              </div>

            </article>

          ))}

        </div>

      </div>

    </section>
  );
};

export default ReviewsSection;
