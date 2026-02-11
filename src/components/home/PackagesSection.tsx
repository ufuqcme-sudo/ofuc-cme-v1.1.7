import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Package {
  id: string;
  title: string;
  description: string | null;
  price: number;
  duration_months: number | null;
  features: unknown;
  is_featured: boolean;
}

const PackagesSection = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data, error } = await supabase
          .from("packages")
          .select("id, title, description, price, duration_months, features, is_featured")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        if (error) throw error;
        setPackages(data || []);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const getFeaturesList = (features: unknown): string[] => {
    if (Array.isArray(features)) {
      return features.map(f => String(f));
    }
    return [];
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "مجاني";
    return price.toLocaleString("ar-SA");
  };

  if (isLoading) {
    return (
      <section className="py-24">
        <div className="container flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (packages.length === 0) {
    return null;
  }

  return (
    <section className="py-24">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-4">
            الباقات والأسعار
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            اختر الباقة المناسبة لك
          </h2>
          <p className="text-muted-foreground">
            باقات مرنة تناسب جميع الاحتياجات والميزانيات
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {packages.map((pkg) => {
            const features = getFeaturesList(pkg.features);
            return (
              <Card
                key={pkg.id}
                className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                  pkg.is_featured
                    ? "border-2 border-primary shadow-glow"
                    : "border border-border shadow-soft hover:shadow-glow"
                }`}
              >
                {pkg.is_featured && (
                  <div className="absolute top-0 left-0 right-0 gradient-primary py-2 text-center">
                    <span className="text-sm font-semibold text-primary-foreground flex items-center justify-center gap-1">
                      <Sparkles className="h-4 w-4" />
                      الأكثر طلباً
                    </span>
                  </div>
                )}

                <CardHeader className={`pb-4 ${pkg.is_featured ? "pt-14" : ""}`}>
                  <h3 className="text-xl font-bold text-foreground">{pkg.title}</h3>
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                  <div className="pt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">{formatPrice(pkg.price)}</span>
                      {pkg.price > 0 && (
                        <>
                          <span className="text-lg text-muted-foreground">ر.س</span>
                          {pkg.duration_months && (
                            <span className="text-sm text-muted-foreground">
                              / {pkg.duration_months === 12 ? "سنوياً" : `${pkg.duration_months} شهر`}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {features.length > 0 && (
                    <ul className="space-y-3">
                      {features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                          <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            pkg.is_featured ? "gradient-primary" : "bg-accent"
                          }`}>
                            <Check className={`h-3 w-3 ${pkg.is_featured ? "text-primary-foreground" : "text-primary"}`} />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link to="/packages">
                    <Button
                      variant={pkg.is_featured ? "hero" : "outline"}
                      className="w-full group"
                    >
                      اطلب الآن
                      <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
