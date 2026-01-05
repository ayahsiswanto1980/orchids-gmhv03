import { useState, useEffect } from "react";
import { Menu, X, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { settings } = useSiteSettings();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Beranda", href: "#beranda" },
    { label: "Kamar", href: "#kamar" },
    { label: "Fasilitas", href: "#fasilitas" },
    { label: "Layanan", href: "#layanan" },
    { label: "Ulasan", href: "#ulasan" },
    { label: "Lokasi", href: "#lokasi" },
  ];

  // Parse hotel name into parts
  const hotelNameParts = settings.hotel_name.split(' ');
  const mainName = hotelNameParts.slice(0, -1).join(' ') || settings.hotel_name;
  const subName = hotelNameParts.length > 1 ? hotelNameParts[hotelNameParts.length - 1] : '';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-medium py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#beranda" className="flex items-center gap-3">
            {settings.logo_url ? (
              <img 
                src={settings.logo_url} 
                alt={settings.hotel_name}
                className="h-10 lg:h-12 w-auto object-contain"
              />
            ) : (
              <div className="flex flex-col">
                  <span
                    className={`font-montserrat text-xl lg:text-2xl transition-colors ${
                      isScrolled ? "text-primary" : "text-gold"
                    }`}
                  >
                    {mainName}
                  </span>
                {subName && (
                  <span
                    className={`text-xs tracking-[0.2em] uppercase ${
                      isScrolled ? "text-muted-foreground" : "text-gold/80"
                    }`}
                  >
                    {subName}
                  </span>
                )}
              </div>
            )}
          </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-gold ${
                    isScrolled ? "text-foreground" : "text-cream"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              
              {/* Auth Link Desktop */}
              <Link
                to={user ? "/admin" : "/auth"}
                className={`text-sm font-medium flex items-center gap-2 transition-colors hover:text-gold ${
                  isScrolled ? "text-foreground" : "text-cream"
                }`}
              >
                <User className="w-4 h-4" />
                <span>{user ? "Dashboard" : "Masuk"}</span>
              </Link>
            </div>


          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className={`flex items-center gap-2 text-sm ${
                isScrolled ? "text-foreground" : "text-cream"
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>{settings.phone}</span>
            </a>
            <Button variant={isScrolled ? "gold" : "hero"} size="lg">
              Pesan Sekarang
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={isScrolled ? "text-foreground" : "text-cream"} />
            ) : (
              <Menu className={isScrolled ? "text-foreground" : "text-cream"} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-card shadow-medium animate-fade-in">
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-foreground hover:text-gold transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <Link
                  to={user ? "/admin" : "/auth"}
                  className="text-foreground hover:text-gold transition-colors py-2 flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  <span>{user ? "Dashboard" : "Masuk"}</span>
                </Link>
                <Button variant="gold" size="lg" className="mt-4">
                  Pesan Sekarang
                </Button>

            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
