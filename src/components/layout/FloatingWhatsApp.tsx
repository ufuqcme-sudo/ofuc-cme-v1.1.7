import { MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useSettings } from "@/hooks/useSettings";
import { openWhatsAppChat } from "@/lib/whatsapp-utils";

const FloatingWhatsApp = () => {
  const { settings, isLoading } = useSettings();
  const location = useLocation();

  // Hide on admin pages
  if (location.pathname.startsWith("/admin")) return null;
  if (isLoading) return null;

  const whatsappNumber = settings.whatsapp_number;
  if (!whatsappNumber) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openWhatsAppChat(
      whatsappNumber,
      "السلام عليكم، أود الاستفسار عن خدمات منصة أُفُق"
    );
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(142,70%,45%)] text-white shadow-lg hover:bg-[hsl(142,70%,40%)] transition-all duration-300 hover:scale-110 animate-fade-in"
      aria-label="تواصل عبر واتساب"
    >
      <MessageCircle className="h-7 w-7" />
    </button>
  );
};

export default FloatingWhatsApp;
