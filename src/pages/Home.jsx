import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2 } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { createPageUrl } from "../utils";
import GlobeScene from "../components/globe/GlobeScene";
import LocationPanel from "../components/globe/LocationPanel";
import LocationMarkerList from "../components/globe/LocationMarkerList";

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
  });

  // Group projects by location
  const locations = React.useMemo(() => {
    const grouped = projects.reduce((acc, project) => {
      const key = project.location;
      if (!acc[key]) {
        acc[key] = {
          name: project.location,
          country: project.country,
          region: project.region || "",
          lat: project.lat,
          lon: project.lon,
          description: "",
          projects: [],
        };
      }
      acc[key].projects.push(project);
      return acc;
    }, {});
    return Object.values(grouped);
  }, [projects]);

  const handleSelectLocation = useCallback((loc) => {
    setSelectedLocation(loc);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedLocation(null);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Black backdrop */}
      <div className="absolute inset-0 bg-black" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-0 left-0 right-0 z-10 p-6 sm:p-8 pr-20 sm:pr-24"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/38ce93810_Brand_Icon_White.png"
              alt="E2Eden"
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">E2Eden</h1>
              <p className="text-xs text-white/30">The Next Green Revolution</p>
            </div>
          </div>
          
          <nav className="hidden sm:flex items-center gap-1">
            <Link to={createPageUrl("Technology")} className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all">
              Technology
            </Link>
            <Link to={createPageUrl("Roadmap")} className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all">
              Roadmap
            </Link>
            <Link to={createPageUrl("Funding")} className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all">
              Funding
            </Link>
          </nav>
        </div>
      </motion.div>

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-24 sm:top-28 left-6 sm:left-8 z-10 max-w-md"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white/90 tracking-tight leading-tight">
          Cultivating tomorrow,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
            sustaining today
          </span>
        </h2>
        <p className="text-sm text-white/90 mt-3 leading-relaxed max-w-sm">
          Pioneering sustainable engineering and regenerative agriculture across six continents, transforming communities through innovation.
        </p>
      </motion.div>

      {/* Globe */}
      <div className={`absolute inset-0 transition-all duration-700 ease-out ${
        selectedLocation ? "translate-x-[-15%] sm:translate-x-[-10%]" : ""
      }`}>
        <GlobeScene
          locations={locations}
          selectedLocation={selectedLocation}
          onSelectLocation={handleSelectLocation}
        />
      </div>

      {/* Location markers list */}
      <LocationMarkerList
        locations={locations}
        selectedLocation={selectedLocation}
        onSelect={handleSelectLocation}
      />

      {/* Side panel */}
      <AnimatePresence>
        {selectedLocation && (
          <LocationPanel location={selectedLocation} onClose={handleClose} />
        )}
      </AnimatePresence>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none z-[5]" />
    </div>
  );
}