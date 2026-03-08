import { Compass } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Compass className="h-6 w-6 text-primary" />
              <span className="font-display text-xl font-bold">EzTravels</span>
            </div>
            <p className="text-secondary-foreground/60 text-sm leading-relaxed">
              AI-powered travel planning for smarter, unforgettable journeys.
            </p>
          </div>
          {[
            { title: "Explore", links: ["Destinations", "Recommendations", "Build Itinerary"] },
            { title: "Company", links: ["About", "Blog", "Careers"] },
            { title: "Support", links: ["Help Center", "Contact", "Privacy Policy"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-secondary-foreground/10 pt-8 text-center text-sm text-secondary-foreground/40">
          © 2026 EzTravels. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
