import React from "react";
import { motion } from "framer-motion";
import { MapPin, Wrench, Leaf } from "lucide-react";

export default function LocationMarkerList({ locations, selectedLocation, onSelect }) {
  return (
    <div className="absolute bottom-6 left-6 right-6 sm:left-8 sm:bottom-8 sm:right-auto z-10">
      <div className="flex flex-wrap gap-2">
        {locations.map((loc, i) => {
          const isSelected = selectedLocation?.name === loc.name;
          const engCount = loc.projects.filter(p => p.type === "engineering").length;
          const farmCount = loc.projects.filter(p => p.type === "farming").length;

          return (
            <motion.button
              key={loc.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
              onClick={() => onSelect(isSelected ? null : loc)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-xl transition-all duration-300 text-xs
                ${isSelected 
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300" 
                  : "bg-white/[0.04] border-white/[0.08] text-white/60 hover:bg-white/[0.08] hover:border-white/[0.15] hover:text-white/80"
                }`}
            >
              <MapPin className={`w-3 h-3 ${isSelected ? "text-amber-400" : "text-white/30"}`} />
              <span className="font-medium">{loc.name}</span>
              <div className="flex items-center gap-1.5 ml-1 pl-2 border-l border-white/10">
                {engCount > 0 && (
                  <span className="flex items-center gap-0.5 text-blue-400/70">
                    <Wrench className="w-2.5 h-2.5" />{engCount}
                  </span>
                )}
                {farmCount > 0 && (
                  <span className="flex items-center gap-0.5 text-emerald-400/70">
                    <Leaf className="w-2.5 h-2.5" />{farmCount}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}