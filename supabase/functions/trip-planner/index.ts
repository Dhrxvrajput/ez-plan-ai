import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompts: Record<string, string> = {
  hotels: `You are an expert hotel recommender for EzTravels. Your job is to analyze the user's request and recommend the best hotels for their destination.

Consider: price vs budget, rating, distance to popular attractions.

Output format (use markdown):

## Recommended Hotels

For each hotel provide:
- **Name**
- **Rating** (stars)
- **Price** (per night estimate)
- **Reason for recommendation** (why it fits their needs)

Recommend 4-5 hotels. Be specific about why each hotel is a good fit based on the user's budget and preferences.`,

  itinerary: `You are an expert travel itinerary planner for EzTravels. Create an optimized day-by-day itinerary that minimizes travel distance between attractions.

Output format (use markdown):

## Top Attractions
For each attraction:
- **Name**
- **Why it's worth visiting**

## Optimized Itinerary
### Day 1
- Morning: [activity + estimated time]
- Afternoon: [activity + estimated time]
- Evening: [activity + estimated time]

(Repeat for each day)

## Budget Estimate
| Category | Estimated Cost |
|----------|---------------|
| Hotel total | ₹/$ X |
| Food estimate | ₹/$ X |
| Activity cost | ₹/$ X |
| Transportation | ₹/$ X |
| **Total estimated trip cost** | **₹/$ X** |

Include travel tips and time estimates between locations. Respect the user's budget.`,

  destinations: `You are an expert destination recommender for EzTravels. Based on user preferences (interests, budget, travel style, season), suggest 4-5 ideal destinations.

Output format (use markdown):

## Recommended Destinations

For each destination:
- **Name**
- **Why it matches preferences**
- **Best time to visit**
- **Estimated daily budget**
- **Top highlight**

Be specific and practical. Consider weather, costs, and accessibility.`,

  budget: `You are an expert travel budget estimator for EzTravels. Provide a detailed, realistic budget breakdown.

Output format (use markdown):

## Budget Breakdown

| Category | Estimated Cost |
|----------|---------------|
| Flights | ₹/$ X - Y |
| Accommodation (per night × nights) | ₹/$ X |
| Food & Dining | ₹/$ X |
| Activities & Attractions | ₹/$ X |
| Local Transportation | ₹/$ X |
| Miscellaneous | ₹/$ X |
| **Total Estimated Range** | **₹/$ X - Y** |

Include tips for saving money and note what's included in estimates. Be realistic based on current prices.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, message } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = systemPrompts[type] || systemPrompts.itinerary;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("trip-planner error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
