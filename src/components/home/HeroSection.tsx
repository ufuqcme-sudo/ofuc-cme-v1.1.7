import { ArrowLeft, Play, Award, Users, BookOpen, User, Star, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Award, value: "+500", label: "شهادة معتمدة" },
    { icon: Users, value: "+10K", label: "طبيب مسجل" },
    { icon: BookOpen, value: "+200", label: "دورة تدريبية" },
  ];

  return (
    <section
      dir="rtl"
      className="relative min-h-[90vh] gradient-hero overflow-hidden px-4 sm:px-6"
    >
      {/* خلفية ديناميكية (تظهر في كل الأحجام) */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-10 end-10 w-72 h-72 sm:w-80 sm:h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 start-20 w-80 h-80 sm:w-96 sm:h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/50 to-transparent" />
      </div>

      <div className="container relative pt-16 sm:pt-20 pb-16 sm:pb-32">
        {/* grid: عمود واحد في الجوال، عمودين في الكبير */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* ===== العمود الأول (النص + الإحصائيات) ===== */}
          <div className="space-y-6 sm:space-y-8 animate-fade-up">
            {/* شارة تميز */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              منصة التعليم الطبي المستمر الأولى في المنطقة
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              طوّر مسيرتك المهنية مع <br />
              <span className="text-gradient">أُفُق</span> للتعليم الطبي
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-lg">
              احصل على أعلى مستويات التعليم الطبي المستمر من خلال باقات تدريبية معتمدة
              ودورات مصممة خصيصاً لك.
            </p>

            {/* الأزرار */}
            <div className="flex gap-3 sm:gap-4 flex-wrap">
              <Button
                variant="hero"
                size="lg"
                className="group text-sm sm:text-base"
                onClick={() => navigate("/packages")}
              >
                استكشف الباقات
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="group text-sm sm:text-base"
                onClick={() => navigate("/reviews")}
              >
                <Play className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                آراء العملاء
              </Button>
            </div>

            {/* ===== الإحصائيات – أفقي في الجوال، عمودي في الكبير ===== */}
            <div className="flex flex-row flex-wrap gap-4 sm:gap-6 lg:flex-col lg:gap-6 pt-6 sm:pt-8 border-t border-border/50">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3 lg:gap-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-xl lg:rounded-2xl bg-accent rotate-0 lg:rotate-3 hover:rotate-0 transition-transform">
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== العمود الثاني – التصميم الدائري (يظهر في جميع الشاشات) ===== */}
          <div className="relative block animate-scale-in mt-8 lg:mt-0">
            <div className="relative aspect-square flex items-center justify-center max-w-[350px] mx-auto lg:max-w-none">
              
              {/* طبقات دائرية شفافة – مصغرة في الجوال */}
              <div className="absolute w-[90%] h-[90%] rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-2xl" />
              <div className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-primary/20 to-transparent blur-xl" />
              
              {/* الدائرة الأساسية – حجم متجاوب */}
              <div className="absolute w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] lg:w-[300px] lg:h-[300px] rounded-full bg-card shadow-soft flex items-center justify-center border-4 sm:border-8 border-accent/30">
                <div className="text-center p-4 sm:p-6">
                  <div className="mx-auto mb-3 sm:mb-4 h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 bg-white rounded-xl sm:rounded-2xl shadow-md flex items-center justify-center">
                    <img src="/logo.png" alt="أفق" className="h-10 sm:h-12 lg:h-16 object-contain" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">تعليم طبي متميز</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">معتمد دولياً</p>
                </div>
              </div>

              {/* بطاقة عائمة 1 – دائرية (تظهر في كل الأحجام، تتوسط في الجوال) */}
              <div className="absolute -top-4 sm:-top-6 end-0 lg:-end-6 bg-secondary/90 backdrop-blur-sm p-3 sm:p-4 rounded-full shadow-soft animate-float max-w-[160px] sm:max-w-none">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 bg-white rounded-full flex items-center justify-center shrink-0">
                    <HeartPulse className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-foreground" />
                  </div>
                  <div className="ps-1">
                    <p className="text-xs sm:text-sm font-semibold">تحديثات 2026</p>
                    <p className="text-[10px] sm:text-xs text-secondary-foreground/70">أحدث المناهج</p>
                  </div>
                </div>
              </div>

              {/* بطاقة عائمة 2 – أيقونات المستخدمين */}
              <div className="absolute -bottom-4 sm:-bottom-6 start-0 lg:-start-6 bg-primary/10 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-soft border border-primary/20 animate-float max-w-[160px] sm:max-w-none">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex -space-x-2 space-x-reverse">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-accent border-2 border-card flex items-center justify-center"
                      >
                        <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold">+10,000</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">طبيب مسجل</p>
                  </div>
                </div>
              </div>

              {/* نجمة زخرفية */}
              <div className="absolute top-0 start-0 lg:top-10 lg:start-10 animate-pulse">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-500 fill-yellow-500" />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;