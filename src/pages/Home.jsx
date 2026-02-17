import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2 } from "lucide-react";
import GlobeScene from "../components/globe/GlobeScene";
import LocationPanel from "../components/globe/LocationPanel";
import LocationMarkerList from "../components/globe/LocationMarkerList";

const LOCATIONS = [
  {
    name: "Nairobi",
    country: "Kenya",
    region: "East Africa",
    lat: -1.29,
    lon: 36.82,
    description: "Hub for sustainable agriculture and renewable energy infrastructure across the region.",
    projects: [
      { name: "Solar Micro-Grid Network", type: "engineering", description: "Deploying modular solar micro-grids to power 12 rural communities with clean, reliable energy.", year: "2025", team: "14 engineers", status: "active" },
      { name: "Precision Drip Irrigation", type: "farming", description: "AI-driven irrigation system reducing water usage by 60% across 800 hectares of farmland.", year: "2024", team: "8 specialists", status: "active" },
      { name: "Vertical Farm Pilot", type: "farming", description: "Urban vertical farming facility producing leafy greens year-round using hydroponics.", year: "2024", team: "6 agronomists", status: "completed" },
    ],
  },
  {
    name: "São Paulo",
    country: "Brazil",
    region: "South America",
    lat: -23.55,
    lon: -46.63,
    description: "Major operations center for tropical agriculture innovation and water engineering projects.",
    projects: [
      { name: "Rainforest Reforestation Drones", type: "engineering", description: "Autonomous drone fleet planting 50,000 native trees monthly in deforested areas.", year: "2025", team: "10 engineers", status: "active" },
      { name: "Cacao Agroforestry", type: "farming", description: "Shade-grown cacao integrated with native trees, restoring biodiversity while producing premium chocolate.", year: "2023", team: "22 farmers", status: "active" },
      { name: "Flood Barrier System", type: "engineering", description: "Smart flood management infrastructure protecting 3 riverside communities.", year: "2024", team: "18 engineers", status: "completed" },
    ],
  },
  {
    name: "Rotterdam",
    country: "Netherlands",
    region: "Europe",
    lat: 51.92,
    lon: 4.48,
    description: "European center for water management engineering and climate-adaptive agriculture.",
    projects: [
      { name: "Floating Farm Platform", type: "farming", description: "Self-sustaining floating dairy farm producing milk with zero land footprint.", year: "2024", team: "12 specialists", status: "active" },
      { name: "Tidal Energy Converter", type: "engineering", description: "Next-gen tidal turbines generating 5MW of clean energy from harbor currents.", year: "2025", team: "20 engineers", status: "active" },
    ],
  },
  {
    name: "Bangalore",
    country: "India",
    region: "South Asia",
    lat: 12.97,
    lon: 77.59,
    description: "Technology-driven agricultural solutions and smart infrastructure development.",
    projects: [
      { name: "Soil Health AI Platform", type: "farming", description: "Machine learning platform analyzing soil samples to optimize crop yields for 2,000+ smallholder farms.", year: "2025", team: "9 data scientists", status: "active" },
      { name: "Rural Bridge Network", type: "engineering", description: "Modular steel bridges connecting 15 isolated villages to market centers.", year: "2023", team: "25 engineers", status: "completed" },
      { name: "Millet Revival Program", type: "farming", description: "Reviving ancient millet varieties with modern processing for nutrition-dense food products.", year: "2024", team: "16 agronomists", status: "active" },
    ],
  },
  {
    name: "Denver",
    country: "United States",
    region: "North America",
    lat: 39.74,
    lon: -104.99,
    description: "Advanced research facility for arid-climate farming and renewable energy systems.",
    projects: [
      { name: "Geothermal Greenhouse Complex", type: "engineering", description: "Year-round food production using geothermal heating in high-altitude greenhouses.", year: "2025", team: "11 engineers", status: "active" },
      { name: "Regenerative Ranching Trial", type: "farming", description: "Holistic planned grazing restoring 5,000 acres of degraded grassland.", year: "2024", team: "7 ranchers", status: "active" },
    ],
  },
  {
    name: "Hokkaido",
    country: "Japan",
    region: "East Asia",
    lat: 43.06,
    lon: 141.35,
    description: "Cutting-edge robotics and cold-climate agriculture research center.",
    projects: [
      { name: "Autonomous Harvest Robotics", type: "engineering", description: "Fleet of AI-powered robots performing precision harvesting of delicate crops.", year: "2025", team: "16 roboticists", status: "active" },
      { name: "Snow Melt Aquaculture", type: "farming", description: "Sustainable fish farming utilizing pristine snowmelt water systems.", year: "2024", team: "5 marine biologists", status: "planned" },
    ],
  },
];

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState(null);

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
        className="absolute top-0 left-0 right-0 z-10 p-6 sm:p-8"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
            <Globe2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Global Projects</h1>
            <p className="text-xs text-white/30">Engineering & Agriculture Worldwide</p>
          </div>
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
          Building the future,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
            one project at a time
          </span>
        </h2>
        <p className="text-sm text-white/30 mt-3 leading-relaxed max-w-sm">
          Explore our global network of engineering and farming initiatives transforming communities across six continents.
        </p>
      </motion.div>

      {/* Globe */}
      <div className={`absolute inset-0 transition-all duration-700 ease-out ${
        selectedLocation ? "translate-x-[-15%] sm:translate-x-[-10%]" : ""
      }`}>
        <GlobeScene
          locations={LOCATIONS}
          selectedLocation={selectedLocation}
          onSelectLocation={handleSelectLocation}
        />
      </div>

      {/* Location markers list */}
      <LocationMarkerList
        locations={LOCATIONS}
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