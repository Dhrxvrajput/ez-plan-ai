import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <img
        src={heroBg}
        alt="Mountain landscape at golden hour"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 hero-overlay" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center pt-20">
        <h1
          className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-primary-foreground mb-6 opacity-0 animate-fade-up"
        >
          EzTravels
        </h1>
        <p
          className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-12 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          Plan smarter journeys with AI-powered travel recommendations.
        </p>

        {/* Search Panel */}
        <div
          className="glass max-w-xl mx-auto rounded-2xl p-6 md:p-8 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
            <div className="text-left flex-1">
              <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider mb-2 block">
                Location
              </label>
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <MapPin className="h-4 w-4 text-primary" />
                <input
                  type="text"
                  placeholder="Where to?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="bg-transparent text-foreground placeholder:text-muted-foreground text-sm w-full outline-none"
                />
              </div>
            </div>
            <Button
              className="rounded-full h-12 text-base font-semibold px-8"
              onClick={() => navigate(`/plan${destination ? `?destination=${encodeURIComponent(destination)}` : ""}`)}
            >
              Plan My Trip
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/40 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-primary-foreground/60 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
