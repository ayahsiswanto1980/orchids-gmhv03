import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const WhatsAppButton = () => {
  const { settings } = useSiteSettings();
  const whatsappNumber = String(settings.whatsapp || '').replace(/[^0-9+]/g, '');
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
      aria-label="Chat via WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-current" />
      <span className="hidden sm:inline font-medium">Chat WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;
