import { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

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

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching reviews:', error);
      } else {
        setReviews(data || []);
      }
      setLoading(false);
    };

    fetchReviews();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('reviews-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews'
        },
        () => {
          fetchReviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, review) => acc + (review.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : "0";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name: string, avatar: string | null) => {
    if (avatar && avatar.startsWith('http')) return avatar;
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <section id="ulasan" className="py-20 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Skeleton className="h-4 w-24 mx-auto mb-4" />
            <Skeleton className="h-10 w-64 mx-auto mb-6" />
            <Skeleton className="h-4 w-full max-w-md mx-auto mb-8" />
            <Skeleton className="h-12 w-48 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-xl p-6">
                <Skeleton className="h-8 w-8 mb-4" />
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

  return (
    <section id="ulasan" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold text-sm font-normal tracking-widest uppercase">
            Testimonial
          </span>
          <h2 className="section-title text-foreground mt-4 mb-6">
            Ulasan Tamu Kami
          </h2>
          <p className="text-muted-foreground mb-8">
            Lihat apa kata tamu kami tentang pengalaman menginap di Hotel Grand
            Master Purwodadi.
          </p>

          {/* Overall Rating */}
          {reviews.length > 0 && (
            <div className="inline-flex items-center gap-4 bg-card rounded-full px-6 py-3 shadow-soft">
              <div className="text-3xl font-sans font-normal text-foreground">
                {averageRating}
              </div>
              <div className="flex flex-col items-start">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(Number(averageRating))
                          ? "fill-gold text-gold"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {reviews.length} ulasan
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="bg-card rounded-xl p-6 shadow-soft animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Quote className="w-8 h-8 text-gold/30 mb-4" />

              {/* Rating */}
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= (review.rating || 0)
                        ? "fill-gold text-gold"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-foreground mb-6 line-clamp-4">
                "{review.comment}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center overflow-hidden">
                  {review.guest_avatar && review.guest_avatar.startsWith('http') ? (
                    <img src={review.guest_avatar} alt={review.guest_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gold font-normal text-sm">
                      {getInitials(review.guest_name, review.guest_avatar)}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-normal text-foreground">
                    {review.guest_name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(review.created_at)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
