import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

const Footer = () => {
  const { settings } = useSettings();

  const phoneNumber = settings.phone_number || "966500000000";
  const email = settings.email || "info@ofuq.com";

  return (
    <footer className="bg-ofuq-navy text-primary-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-2xl bg-white shadow-soft ring-1 ring-border">
                      <img
                          src="/logo.png"
                         alt="أفق للتعليم الطبي"
                        className="h-20 object-contain"
                         />
</div>

              <div className="flex flex-col">
                <span className="text-xl font-bold">أُفُق</span>
                <span className="text-[10px] text-primary-foreground/60 -mt-1">
                  التعليم الطبي المستمر
                </span>
              </div>
            </Link>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              منصتكم الأولى للتعليم الطبي المستمر. نقدم دورات معتمدة وباقات
              تدريبية متميزة لتطوير مهاراتكم الطبية.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">روابط سريعة</h4>
            <ul className="space-y-3">
              {[
                { label: "الرئيسية", href: "/" },
                { label: "الباقات", href: "/packages" },
                { label: "من نحن", href: "/about" },
                { label: "تواصل معنا", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-4">خدماتنا</h4>
            <ul className="space-y-3">
              {[
                "دورات CME معتمدة",
                "ورش عمل متخصصة",
                "شهادات مهنية",
                "تدريب عملي",
                "استشارات طبية",
              ].map((service) => (
                <li key={service}>
                  <span className="text-sm text-primary-foreground/70">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">تواصل معنا</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail className="h-4 w-4 text-secondary" />
                <span>{email}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Phone className="h-4 w-4 text-secondary" />
                <span dir="ltr">+{phoneNumber}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                <span>المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} أُفُق. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/50">
            <a
              href="#"
              className="hover:text-primary-foreground transition-colors"
            >
              سياسة الخصوصية
            </a>
            <a
              href="#"
              className="hover:text-primary-foreground transition-colors"
            >
              الشروط والأحكام
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
