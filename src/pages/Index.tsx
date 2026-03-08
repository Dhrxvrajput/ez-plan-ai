import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DestinationsSection from "@/components/DestinationsSection";
import ItinerarySection from "@/components/ItinerarySection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <DestinationsSection />
      <ItinerarySection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
