import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Award, Users, BookOpen, Target, Heart, Shield } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "رسالتنا",
      description:
        "تمكين الكوادر الطبية من الوصول إلى أعلى مستويات التعليم الطبي المستمر من خلال حلول تدريبية مبتكرة ومعتمدة.",
    },
    {
      icon: Heart,
      title: "رؤيتنا",
      description:
        "أن نكون المنصة الرائدة في التعليم الطبي المستمر في المنطقة، ونساهم في رفع جودة الرعاية الصحية.",
    },
    {
      icon: Shield,
      title: "قيمنا",
      description:
        "الجودة والاعتمادية والابتكار والتميز في تقديم المحتوى التعليمي الطبي.",
    },
  ];

  const stats = [
    { value: "+500", label: "شهادة CME معتمدة", icon: Award },
    { value: "+10,000", label: "طبيب مسجل", icon: Users },
    { value: "+200", label: "دورة تدريبية", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 gradient-hero">
          <div className="container text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
              من نحن
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              نحن <span className="text-gradient">أُفُق</span> للتعليم الطبي المستمر
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              منصتكم الأولى للتعليم الطبي المستمر في المملكة العربية السعودية.
              نقدم دورات معتمدة وباقات تدريبية متميزة لتطوير مهاراتكم الطبية
              والارتقاء بمستوى الرعاية الصحية.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((item, i) => (
                <div
                  key={i}
                  className="text-center p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-glow transition-all duration-300"
                >
                  <div className="mx-auto mb-6 h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center">
                    <item.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              أرقام نفخر بها
            </h2>
            <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-xl bg-accent flex items-center justify-center">
                    <stat.icon className="h-7 w-7 text-primary" />
                  </div>
                  <p className="text-4xl font-bold text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
