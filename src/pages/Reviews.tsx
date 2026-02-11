import { useState, useEffect } from "react";
import { Loader2, MessageSquare } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  image_url: string;
  sort_order: number;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .order("sort_order", { ascending: true });

        if (error) throw error;
        setReviews(data || []);
      } catch {
        console.error("Failed to fetch reviews");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 gradient-hero">
          <div className="container text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
              <MessageSquare className="h-4 w-4" />
              آراء عملائنا
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              ماذا يقول <span className="text-gradient">عملاؤنا</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              نفتخر بثقة عملائنا ونسعد بمشاركة تجاربهم معنا
            </p>
          </div>
        </section>

        {/* Reviews Grid */}
        <section className="py-12">
          <div className="container">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                لا توجد آراء حالياً
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="break-inside-avoid cursor-pointer group"
                    onClick={() => setSelectedImage(review.image_url)}
                  >
                    <div className="rounded-xl overflow-hidden border border-border shadow-soft hover:shadow-glow transition-shadow duration-300">
                      <img
                        src={review.image_url}
                        alt="رأي عميل"
                        className="w-full h-auto object-contain"
                        loading="lazy"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="رأي عميل"
            className="max-w-full max-h-[90vh] rounded-xl object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default Reviews;
