import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import destSantorini from "@/assets/dest-santorini.jpg";
import destKyoto from "@/assets/dest-kyoto.jpg";
import destSwiss from "@/assets/dest-swiss.jpg";
import destBali from "@/assets/dest-bali.jpg";
import destPatagonia from "@/assets/dest-patagonia.jpg";
import destMaldives from "@/assets/dest-maldives.jpg";

const destinations = [
  { name: "Santorini, Greece", cost: "$1,200", image: destSantorini, tag: "Beach" },
  { name: "Kyoto, Japan", cost: "$1,800", image: destKyoto, tag: "Culture" },
  { name: "Swiss Alps", cost: "$2,400", image: destSwiss, tag: "Mountains" },
  { name: "Bali, Indonesia", cost: "$900", image: destBali, tag: "Tropical" },
  { name: "Patagonia", cost: "$2,100", image: destPatagonia, tag: "Adventure" },
  { name: "Maldives", cost: "$3,200", image: destMaldives, tag: "Luxury" },
];

const DestinationsSection = () => {
  return (
    <section id="destinations" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-primary font-medium text-sm uppercase tracking-widest mb-3">
            Explore the World
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Popular Destinations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, i) => (
            <div
              key={dest.name}
              className="group relative rounded-2xl overflow-hidden bg-card shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 opacity-0 animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              {/* Tag */}
              <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                {dest.tag}
              </span>
              {/* Info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-secondary/90 to-transparent">
                <h3 className="font-display text-xl font-semibold text-secondary-foreground">
                  {dest.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gold text-sm font-medium">
                    From {dest.cost}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-secondary-foreground hover:text-primary gap-1 p-0"
                  >
                    Explore <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;
