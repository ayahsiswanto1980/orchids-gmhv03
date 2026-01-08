import { useState, useEffect } from "react";
import { Menu, X, Bed, Star, Coffee, Utensils, Waves, ChevronRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { settings } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Beranda", href: "#beranda" },
    { 
      label: "Kamar", 
      href: "#kamar",
      items: [
        { title: "Standard Room", desc: "Kamar nyaman untuk kebutuhan esensial", icon: Bed },
        { title: "Deluxe Room", desc: "Ruang lebih luas dengan fasilitas premium", icon: Star },
        { title: "Executive Suite", desc: "Kemewahan terbaik untuk pengalaman eksklusif", icon: Waves },
      ]
    },
    { 
      label: "Fasilitas", 
      href: "#fasilitas",
      items: [
        { title: "Restoran", desc: "Sajian kuliner nusantara & internasional", icon: Utensils },
        { title: "Kolam Renang", desc: "Segarkan diri di kolam renang outdoor", icon: Waves },
        { title: "Ruang Meeting", desc: "Fasilitas bisnis profesional & lengkap", icon: Coffee },
      ]
    },
    { label: "Layanan", href: "#layanan" },
    { label: "Ulasan", href: "#ulasan" },
    { label: "Lokasi", href: "#lokasi" },
  ];

  const hotelNameParts = settings.hotel_name.split(' ');
  const mainName = hotelNameParts.slice(0, -1).join(' ') || settings.hotel_name;
  const subName = hotelNameParts.length > 1 ? hotelNameParts[hotelNameParts.length - 1] : '';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl shadow-lg py-3 border-b border-white/10"
          : "bg-black/10 backdrop-blur-[2px] py-5"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <a href="#beranda" className="flex items-center gap-3 group relative overflow-hidden px-2 py-1 rounded-lg transition-all duration-300 hover:bg-white/5">
            {settings.logo_url ? (
              <img 
                src={settings.logo_url} 
                alt={settings.hotel_name}
                className="h-10 lg:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col">
                <span
                  className={`font-marker text-xl lg:text-2xl transition-colors ${
                    isScrolled ? "text-primary" : "text-gold"
                  }`}
                >
                  {mainName}
                </span>
                {subName && (
                  <span
                    className={`text-xs tracking-[0.2em] uppercase ${
                      isScrolled
                        ? "text-muted-foreground"
                        : "text-gold/80"
                    }`}
                  >
                    {subName}
                  </span>
                )}
              </div>
            )}
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    {link.items ? (
                      <>
                        <NavigationMenuTrigger 
                          className={cn(
                            "bg-transparent hover:bg-white/10 focus:bg-white/10 data-[state=open]:bg-white/10 text-sm font-medium transition-all duration-300",
                            isScrolled ? "text-foreground" : "text-white"
                          )}
                        >
                          {link.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-background/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl">
                            <div className="flex flex-col justify-between p-6 bg-gold/5 rounded-lg border border-gold/10 row-span-2">
                              <div>
                                <h4 className="text-lg font-bold text-gold mb-2">{link.label} Unggulan</h4>
                                <p className="text-sm text-muted-foreground">
                                  Temukan berbagai pilihan terbaik kami yang dirancang khusus untuk kenyamanan Anda.
                                </p>
                              </div>
                              <Button variant="outline" size="sm" className="mt-4 border-gold/20 hover:bg-gold hover:text-white transition-all">
                                Lihat Semua <ChevronRight className="ml-2 w-4 h-4" />
                              </Button>
                            </div>
                            <div className="flex flex-col gap-2">
                              {link.items.map((item) => (
                                <NavigationMenuLink key={item.title} asChild>
                                  <a
                                    href={link.href}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gold/10 transition-all group/item"
                                  >
                                    <div className="p-2 rounded-lg bg-gold/10 text-gold group-hover/item:bg-gold group-hover/item:text-white transition-colors">
                                      <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <h5 className="text-sm font-semibold leading-none">{item.title}</h5>
                                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{item.desc}</p>
                                    </div>
                                  </a>
                                </NavigationMenuLink>
                              ))}
                            </div>
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink
                        href={link.href}
                        className={cn(
                          "relative px-4 py-2 text-sm font-medium transition-all duration-300 group inline-flex items-center justify-center rounded-md hover:bg-white/10 focus:bg-white/10",
                          isScrolled ? "text-foreground" : "text-white"
                        )}
                      >
                        <span className="relative z-10 group-hover:text-gold transition-colors duration-300">
                          {link.label}
                        </span>
                        <span className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-gold transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* CTA & Contact */}
          <div className="hidden lg:flex items-center gap-6">
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
              className={`flex items-center gap-2 text-sm transition-colors hover:text-gold ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>{settings.phone}</span>
            </a>
            <Button 
              variant={isScrolled ? "gold" : "hero"} 
              size="lg"
              className="shadow-md hover:shadow-gold/20 active:scale-95 transition-all duration-300 font-semibold px-8"
              onClick={() => document.getElementById('kamar')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Pesan Sekarang
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
              isScrolled ? "bg-primary/5 text-primary" : "bg-white/10 text-white"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden absolute top-full left-0 right-0 overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-[800px] opacity-100 border-t border-white/5 shadow-2xl" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-card/98 backdrop-blur-2xl px-4 py-8 flex flex-col gap-2">
            {navLinks.map((link, index) => (
              <div key={link.href} className="flex flex-col">
                <a
                  href={link.href}
                  className="text-foreground text-lg font-medium hover:text-gold transition-all duration-300 py-3 border-b border-border/40 last:border-0 flex items-center justify-between group"
                  onClick={() => !link.items && setIsMobileMenuOpen(false)}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {link.label}
                  {link.items ? <ChevronRight className="w-5 h-5 text-muted-foreground" /> : <div className="w-2 h-2 rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />}
                </a>
                {link.items && (
                  <div className="pl-4 flex flex-col gap-3 py-2">
                    {link.items.map((item) => (
                      <a key={item.title} href={link.href} className="flex items-center gap-3 text-muted-foreground hover:text-gold transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm">{item.title}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-6 flex flex-col gap-4">
              <Button 
                variant="gold" 
                size="lg" 
                className="w-full py-7 text-lg shadow-xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pesan Sekarang
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
