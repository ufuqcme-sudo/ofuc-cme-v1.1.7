import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-primary" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            ابدأ رحلتك التعليمية اليوم
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight">
            انضم إلى أكثر من 10,000 طبيب
            <br />
            يثقون بمنصة أُفُق
          </h2>

          <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto">
            سجّل الآن واحصل على أول دورة مجانية. ابدأ رحلة التميز المهني مع أفضل المدربين والخبراء.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/packages">
              <Button variant="gold" size="xl" className="group">
                تصفح الباقات
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/packages">
              <Button variant="heroOutline" size="xl">
                تعرف على المزيد
              </Button>
            </Link>
          </div>

          <p className="text-sm text-primary-foreground/60">
            لا حاجة لبطاقة ائتمان • إلغاء في أي وقت
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
