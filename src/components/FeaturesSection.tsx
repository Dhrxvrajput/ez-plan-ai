import { Brain, Map, Hotel, CalendarDays, Sparkles, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Recommendations",
    desc: "Get personalized destination suggestions based on your travel history, budget, and style.",
  },
  {
    icon: CalendarDays,
    title: "Smart Itinerary Builder",
    desc: "Generate day-by-day travel plans with attractions, restaurants, and routes.",
  },
  {
    icon: Map,
    title: "Map Integration",
    desc: "Visualize your itinerary on an interactive map with routes between attractions.",
  },
  {
    icon: Hotel,
    title: "Hotel Suggestions",
    desc: "Find the best hotels filtered by price, rating, and proximity to attractions.",
  },
  {
    icon: BarChart3,
    title: "Travel History Analysis",
    desc: "Track and analyze your travel patterns to uncover your ideal vacation style.",
  },
  {
    icon: Sparkles,
    title: "AI Travel Assistant",
    desc: "Chat with our AI assistant for real-time travel tips and planning help.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-primary font-medium text-sm uppercase tracking-widest mb-3">
            Smart Features
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Travel Smarter, Not Harder
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-500 opacity-0 animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {f.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
