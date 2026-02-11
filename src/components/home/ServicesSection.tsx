import { useEffect, useState, ComponentType, SVGProps } from "react";
import { 
  BookOpen, Award, Users, Video, FileText, HeartPulse, Loader2,
  GraduationCap, RefreshCw, Star, Heart, Shield, Zap, Target, 
  Clock, Calendar, Headphones, MessageSquare, Globe
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string;
}

const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  BookOpen, GraduationCap, Award, Users, RefreshCw,
  Star, Heart, Shield, Zap, Target, Clock, Calendar,
  FileText, Video, Headphones, MessageSquare, Globe, HeartPulse
};

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("id, title, description, icon")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        if (error) throw error;
        setServices(data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || BookOpen;
    return IconComponent;
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-muted/30">
        <div className="container flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
            خدماتنا
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            كل ما تحتاجه لتطوير مسيرتك الطبية
          </h2>
          <p className="text-muted-foreground">
            نقدم مجموعة متكاملة من الخدمات التعليمية المصممة لتلبية احتياجاتك المهنية
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const IconComponent = getIcon(service.icon);
            const colorClass = index % 2 === 0 ? "primary" : "secondary";
            
            return (
              <Card
                key={service.id}
                className="group relative overflow-hidden border-0 bg-card shadow-soft hover:shadow-glow transition-all duration-500 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div
                    className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl ${
                      colorClass === "primary"
                        ? "gradient-primary"
                        : "gradient-gold"
                    } shadow-soft group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className={`h-7 w-7 ${colorClass === "primary" ? "text-primary-foreground" : "text-secondary-foreground"}`} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>

                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
