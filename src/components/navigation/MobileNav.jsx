import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Lightbulb, Map, DollarSign, Handshake } from "lucide-react";
import { createPageUrl } from "../../utils";

export default function MobileNav() {
  const location = useLocation();
  
  const navItems = [
    { name: "Home", icon: Home, path: createPageUrl("Home") },
    { name: "Innovations", icon: Lightbulb, path: createPageUrl("TheInnovations") },
    { name: "Roadmap", icon: Map, path: createPageUrl("Roadmap") },
    { name: "Funding", icon: DollarSign, path: createPageUrl("Funding") },
    { name: "Partnerships", icon: Handshake, path: createPageUrl("Partnerships") }
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-t border-white/10">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                isActive 
                  ? 'text-amber-400' 
                  : 'text-white/60 hover:text-white/90'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}