import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Compass, ArrowLeft, Hotel, Route, MapPin, DollarSign, Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { streamTripPlanner, type PlannerType } from "@/lib/streamChat";
import { toast } from "sonner";

const tabs = [
  { id: "hotels" as PlannerType, label: "Hotels", icon: Hotel, placeholder: "e.g. Find luxury hotels in Bali for 2 guests, $150-300/night budget, close to beach" },
  { id: "itinerary" as PlannerType, label: "Itinerary", icon: Route, placeholder: "e.g. 5-day Kyoto itinerary focused on temples, street food, and cherry blossoms" },
  { id: "destinations" as PlannerType, label: "Destinations", icon: MapPin, placeholder: "e.g. I love beaches, culture, and seafood. Budget $2000 for 7 days. Traveling in June." },
  { id: "budget" as PlannerType, label: "Budget", icon: DollarSign, placeholder: "e.g. Estimate budget for 4 days in Santorini, 2 travelers, mid-range style" },
];

const TripPlanner = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialDest = searchParams.get("destination") || "";

  const [activeTab, setActiveTab] = useState<PlannerType>("itinerary");
  const [inputs, setInputs] = useState<Record<PlannerType, string>>({
    hotels: initialDest ? `Find hotels in ${initialDest}` : "",
    itinerary: initialDest ? `Plan a trip to ${initialDest}` : "",
    destinations: "",
    budget: initialDest ? `Estimate budget for a trip to ${initialDest}` : "",
  });
  const [results, setResults] = useState<Record<PlannerType, string>>({
    hotels: "", itinerary: "", destinations: "", budget: "",
  });
  const [loading, setLoading] = useState<Record<PlannerType, boolean>>({
    hotels: false, itinerary: false, destinations: false, budget: false,
  });

  const handleGenerate = async (type: PlannerType) => {
    const message = inputs[type];
    if (!message.trim()) {
      toast.error("Please describe what you're looking for");
      return;
    }

    setLoading((p) => ({ ...p, [type]: true }));
    setResults((p) => ({ ...p, [type]: "" }));

    let accumulated = "";
    try {
      await streamTripPlanner({
        type,
        message,
        onDelta: (chunk) => {
          accumulated += chunk;
          setResults((p) => ({ ...p, [type]: accumulated }));
        },
        onDone: () => setLoading((p) => ({ ...p, [type]: false })),
        onError: (err) => {
          toast.error(err);
          setLoading((p) => ({ ...p, [type]: false }));
        },
      });
    } catch {
      toast.error("Failed to connect. Please try again.");
      setLoading((p) => ({ ...p, [type]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-primary" />
              <span className="font-display text-xl font-bold text-foreground">
                Trip Planner
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-Powered
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Plan Your Perfect Trip
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get AI-powered hotel recommendations, optimized itineraries, destination
            suggestions, and budget estimates — all in one place.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PlannerType)}>
          <TabsList className="grid w-full grid-cols-4 mb-8 h-auto p-1">
            {tabs.map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="flex items-center gap-2 py-3 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <t.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((t) => (
            <TabsContent key={t.id} value={t.id}>
              {/* Input area */}
              <div className="bg-card rounded-2xl border border-border p-6 mb-6">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
                  Describe what you need
                </label>
                <textarea
                  value={inputs[t.id]}
                  onChange={(e) =>
                    setInputs((p) => ({ ...p, [t.id]: e.target.value }))
                  }
                  placeholder={t.placeholder}
                  rows={3}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none mb-4"
                />
                <Button
                  onClick={() => handleGenerate(t.id)}
                  disabled={loading[t.id]}
                  className="rounded-full px-8 gap-2"
                >
                  {loading[t.id] ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Generate {t.label}
                    </>
                  )}
                </Button>
              </div>

              {/* Results */}
              {results[t.id] && (
                <div className="bg-card rounded-2xl border border-border p-6 animate-fade-up">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      AI Recommendation
                    </h3>
                  </div>
                  <div className="prose prose-sm max-w-none text-foreground/90 [&_h1]:font-display [&_h2]:font-display [&_h3]:font-display [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground [&_li]:text-foreground/80 [&_p]:text-foreground/80">
                    <MarkdownRenderer content={results[t.id]} />
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!results[t.id] && !loading[t.id] && (
                <div className="text-center py-16 text-muted-foreground">
                  <t.icon className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="text-sm">
                    Describe your trip details above and hit generate to get
                    AI-powered {t.label.toLowerCase()} recommendations.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

// Simple markdown renderer
const MarkdownRenderer = ({ content }: { content: string }) => {
  const html = content
    .replace(/^### (.*$)/gm, '<h3 class="text-base font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-lg font-bold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4 list-decimal">$2</li>')
    .replace(/\n\n/g, '</p><p class="mb-2">')
    .replace(/\n/g, '<br/>');

  return <div dangerouslySetInnerHTML={{ __html: `<p class="mb-2">${html}</p>` }} />;
};

export default TripPlanner;
