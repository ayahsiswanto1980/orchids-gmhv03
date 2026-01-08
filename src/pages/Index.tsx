import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RoomsSection from "@/components/RoomsSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import ServicesSection from "@/components/ServicesSection";
import ReviewsSection from "@/components/ReviewsSection";
import LocationSection from "@/components/LocationSection";
import PartnerLogos from "@/components/PartnerLogos";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import useScrollReveal from "@/hooks/useScrollReveal";

const Index = () => {
  const scrollRef = useScrollReveal();

  return (
    <main className="min-h-screen" ref={scrollRef}>
      <Navbar />
      <HeroSection />
      <div className="scroll-reveal">
        <RoomsSection />
      </div>
      <div className="scroll-reveal">
        <FacilitiesSection />
      </div>
      <div className="scroll-reveal">
        <ServicesSection />
      </div>
      <div className="scroll-reveal">
        <ReviewsSection />
      </div>
      <div className="scroll-reveal">
        <LocationSection />
      </div>
      <PartnerLogos />
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default Index;
