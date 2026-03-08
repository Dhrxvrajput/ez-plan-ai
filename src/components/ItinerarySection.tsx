import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Heart, Utensils, Camera, Route } from "lucide-react";

const sampleItinerary = [
  {
    day: 1,
    title: "Arrival & City Exploration",
    items: [
      { icon: MapPin, text: "Check into hotel in central district" },
      { icon: Utensils, text: "Lunch at local restaurant" },
      { icon: Camera, text: "Evening city walking tour" },
    ],
  },
  {
    day: 2,
    title: "Major Attractions",
    items: [
      { icon: Camera, text: "Visit iconic landmarks & museums" },
      { icon: Utensils, text: "Traditional cuisine food tour" },
      { icon: Route, text: "Sunset viewpoint experience" },
    ],
  },
  {
    day: 3,
    title: "Local Experiences",
    items: [
      { icon: Heart, text: "Local market & artisan shops" },
      { icon: Camera, text: "Hidden gems & neighborhoods" },
      { icon: Utensils, text: "Farewell dinner" },
    ],
  },
];

const ItinerarySection = () => {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("3");
  const [showPlan, setShowPlan] = useState(false);

  return (
    <section id="itinerary" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-primary font-medium text-sm uppercase tracking-widest mb-3">
            AI-Powered
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Build Your Itinerary
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Builder form */}
          <div className="bg-card rounded-2xl border border-border p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                  Destination
                </label>
                <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Kyoto, Japan"
                    className="bg-transparent text-foreground placeholder:text-muted-foreground text-sm w-full outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                  Number of Days
                </label>
                <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    min={1}
                    max={14}
                    className="bg-transparent text-foreground text-sm w-full outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                  Interests
                </label>
                <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2">
                  <Heart className="h-4 w-4 text-primary" />
                  <input
                    type="text"
                    placeholder="Culture, Food..."
                    className="bg-transparent text-foreground placeholder:text-muted-foreground text-sm w-full outline-none"
                  />
                </div>
              </div>
            </div>
            <Button
              className="rounded-full w-full md:w-auto px-10"
              onClick={() => setShowPlan(true)}
            >
              Generate Itinerary
            </Button>
          </div>

          {/* Sample itinerary */}
          {showPlan && (
            <div className="space-y-6 animate-fade-up">
              {sampleItinerary.map((day) => (
                <div
                  key={day.day}
                  className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {day.day}
                    </span>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Day {day.day} – {day.title}
                    </h3>
                  </div>
                  <div className="space-y-3 ml-[52px]">
                    {day.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-3 text-muted-foreground text-sm">
                        <item.icon className="h-4 w-4 text-primary/70" />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ItinerarySection;
