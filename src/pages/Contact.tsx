import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/useSettings";
import { Loader2 } from "lucide-react";
import { openWhatsAppChat } from "@/lib/whatsapp-utils";

const Contact = () => {
  const { settings, isLoading } = useSettings();

  const whatsappNumber = settings.whatsapp_number || "966500000000";
  const phoneNumber = settings.phone_number || "966500000000";
  const email = settings.email || "info@ofuq.com";

  const contactItems = [
    {
      icon: MessageCircle,
      label: "واتساب",
      value: whatsappNumber,
      description: "تواصل معنا مباشرة",
      action: () => openWhatsAppChat(
        whatsappNumber,
        "مرحباً، أود الاستفسار عن خدمات منصة أُفُق"
      ),
      actionLabel: "أرسل رسالة",
    },
    {
      icon: Phone,
      label: "اتصل بنا",
      value: phoneNumber,
      description: "متاحون خلال ساعات العمل",
      action: () => window.open(`tel:+${phoneNumber}`, "_self"),
      actionLabel: "اتصل الآن",
    },
    {
      icon: Mail,
      label: "البريد الإلكتروني",
      value: email,
      description: "نرد خلال 24 ساعة",
      action: () => window.open(`mailto:${email}`, "_self"),
      actionLabel: "أرسل إيميل",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 gradient-hero">
          <div className="container text-center max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
              تواصل معنا
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              نحن هنا لمساعدتك
            </h1>
            <p className="text-lg text-muted-foreground">
              تواصل معنا عبر أي من القنوات التالية وسنكون سعداء بخدمتك
            </p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-20">
          <div className="container">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {contactItems.map((item, i) => (
                  <div
                    key={i}
                    className="text-center p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-glow transition-all duration-300"
                  >
                    <div className="mx-auto mb-5 h-14 w-14 rounded-xl gradient-primary flex items-center justify-center">
                      <item.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {item.label}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {item.description}
                    </p>
                    <p className="text-sm font-medium text-foreground mb-4" dir="ltr">
                      {item.value}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={item.action}
                    >
                      {item.actionLabel}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Location */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span>المملكة العربية السعودية</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
