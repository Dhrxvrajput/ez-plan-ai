import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Compass, ArrowLeft, Hotel, MapPin, DollarSign, Sparkles, Loader2, CalendarDays, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { streamTripPlanner } from "@/lib/streamChat";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

// Sample hotels data (replace images later with API data)
const sampleHotels = [
  { id: 1, name: "Mountain View Resort", rating: 4.8, price: 4500, image: "/placeholder.svg", amenities: ["Spa", "Pool", "Restaurant"] },
  { id: 2, name: "Valley Heritage Hotel", rating: 4.5, price: 3200, image: "/placeholder.svg", amenities: ["WiFi", "Breakfast", "Parking"] },
  { id: 3, name: "Pine Forest Lodge", rating: 4.6, price: 5800, image: "/placeholder.svg", amenities: ["Fireplace", "Mountain View", "Bar"] },
  { id: 4, name: "Riverside Inn", rating: 4.3, price: 2800, image: "/placeholder.svg", amenities: ["Garden", "Restaurant", "Tours"] },
];

// Sample destinations
const sampleDestinations = [
  { id: 1, name: "Solang Valley", type: "Adventure", image: "/placeholder.svg" },
  { id: 2, name: "Hadimba Temple", type: "Culture", image: "/placeholder.svg" },
  { id: 3, name: "Rohtang Pass", type: "Scenic", image: "/placeholder.svg" },
  { id: 4, name: "Old Manali", type: "Explore", image: "/placeholder.svg" },
];

const TripPlanner = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const destination = searchParams.get("destination")?.trim() || "Manali";

  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [travelers, setTravelers] = useState("2");
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");

  const nights = dateRange.from && dateRange.to ? differenceInDays(dateRange.to, dateRange.from) : 0;
  const hotel = selectedHotel !== null ? sampleHotels.find(h => h.id === selectedHotel) : null;

  // Calculate budget
  const hotelCost = hotel ? hotel.price * nights : 0;
  const foodCost = nights * parseInt(travelers) * 800; // ₹800 per person per day
  const activityCost = nights * parseInt(travelers) * 500; // ₹500 per person per day
  const transportCost = parseInt(travelers) * 1500; // ₹1500 per person round trip local
  const totalBudget = hotelCost + foodCost + activityCost + transportCost;

  const handleOptimizeBudget = async () => {
    if (!dateRange.from || !dateRange.to || !hotel) {
      toast.error("Please select dates and a hotel first");
      return;
    }

    setOptimizing(true);
    setAiSuggestion("");

    const message = `I'm planning a trip to ${destination} for ${travelers} travelers, ${nights} nights. 
    Selected hotel: ${hotel.name} at ₹${hotel.price}/night. 
    Current budget estimate: ₹${totalBudget.toLocaleString()} (Hotel: ₹${hotelCost.toLocaleString()}, Food: ₹${foodCost.toLocaleString()}, Activities: ₹${activityCost.toLocaleString()}, Transport: ₹${transportCost.toLocaleString()}).
    
    Please suggest ways to optimize this budget - cheaper alternatives, money-saving tips, and what I can do with this budget.`;

    let accumulated = "";
    try {
      await streamTripPlanner({
        type: "budget",
        message,
        onDelta: (chunk) => {
          accumulated += chunk;
          setAiSuggestion(accumulated);
        },
        onDone: () => setOptimizing(false),
        onError: (err) => {
          toast.error(err);
          setOptimizing(false);
        },
      });
    } catch {
      toast.error("Failed to connect. Please try again.");
      setOptimizing(false);
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
                Trip to {destination}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Date & Travelers Selection */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-8">
          <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Select Your Travel Dates
          </h2>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                Check-in / Check-out
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "MMM d, yyyy")
                      )
                    ) : (
                      "Pick your dates"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                    numberOfMonths={2}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="w-40">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                Travelers
              </label>
              <Select value={travelers} onValueChange={setTravelers}>
                <SelectTrigger className="h-12">
                  <Users className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} {n === 1 ? "traveler" : "travelers"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {nights > 0 && (
              <div className="text-sm text-muted-foreground bg-muted px-4 py-3 rounded-xl">
                <span className="font-semibold text-foreground">{nights}</span> nights
              </div>
            )}
          </div>
        </div>

        {/* Destinations */}
        <div className="mb-8">
          <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Top Destinations in {destination}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sampleDestinations.map((dest) => (
              <div
                key={dest.id}
                className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-muted cursor-pointer"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-semibold text-sm">{dest.name}</p>
                  <p className="text-white/70 text-xs">{dest.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hotels */}
        <div className="mb-8">
          <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <Hotel className="h-5 w-5 text-primary" />
            Select Your Hotel
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleHotels.map((h) => (
              <div
                key={h.id}
                onClick={() => setSelectedHotel(h.id)}
                className={cn(
                  "rounded-xl border-2 overflow-hidden cursor-pointer transition-all",
                  selectedHotel === h.id
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="aspect-video bg-muted relative">
                  <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
                  {selectedHotel === h.id && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      Selected
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1">{h.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    {h.rating}
                  </div>
                  <p className="text-primary font-bold">₹{h.price.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/night</span></p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {h.amenities.slice(0, 2).map((a) => (
                      <span key={a} className="text-xs bg-muted px-2 py-0.5 rounded">{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Estimate */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-8">
          <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Budget Estimate
          </h2>

          {nights > 0 && hotel ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Hotel ({nights} nights)</p>
                  <p className="text-xl font-bold text-foreground">₹{hotelCost.toLocaleString()}</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Food & Dining</p>
                  <p className="text-xl font-bold text-foreground">₹{foodCost.toLocaleString()}</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Activities</p>
                  <p className="text-xl font-bold text-foreground">₹{activityCost.toLocaleString()}</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Transport</p>
                  <p className="text-xl font-bold text-foreground">₹{transportCost.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-primary/10 rounded-xl p-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Total Estimated Budget</p>
                  <p className="text-3xl font-bold text-primary">₹{totalBudget.toLocaleString()}</p>
                </div>
                <Button
                  onClick={handleOptimizeBudget}
                  disabled={optimizing}
                  className="rounded-full gap-2"
                >
                  {optimizing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Optimize with AI
                    </>
                  )}
                </Button>
              </div>

              {/* AI Suggestions */}
              {aiSuggestion && (
                <div className="bg-muted/50 rounded-xl p-4 mt-4">
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Budget Tips
                  </h3>
                  <div className="prose prose-sm max-w-none text-foreground/80 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_li]:text-sm [&_p]:text-sm">
                    <MarkdownRenderer content={aiSuggestion} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-sm">Select dates and a hotel to see your budget estimate</p>
            </div>
          )}
        </div>
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
