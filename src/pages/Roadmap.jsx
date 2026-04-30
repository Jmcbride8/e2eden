import React, { useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import PhaseCarousel from "@/components/roadmap/PhaseCarousel";
import LegacyCarousel from "@/components/roadmap/LegacyCarousel";

export default function Roadmap() {
  const [selectedPhase, setSelectedPhase] = useState("all");

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => base44.entities.Project.list("sort_order"),
  });

  const phaseOrder = { "R&D": 0, "US Commercialization": 1, "Salton Sea Transformation": 2, "Global Deployment": 3 };
  
  const legacyProjects = projects.filter((p) => p.company === "Seawater Greenhouse");
  const e2edenProjects = projects.filter((p) => (p.company === "E2Eden" || !p.company) && p.category !== "Visionary");
  const visionaryProjects = projects.filter((p) => p.category === "Visionary");
  
  const filteredProjects =
    selectedPhase === "all"
      ? e2edenProjects.sort((a, b) => (phaseOrder[a.phase] ?? 999) - (phaseOrder[b.phase] ?? 999))
      : e2edenProjects.filter((p) => p.phase === selectedPhase).sort((a, b) => (a.year || "").localeCompare(b.year || ""));

  const groupedByPhase = filteredProjects.reduce((acc, project) => {
    const phase = project.phase || "Other";
    if (!acc[phase]) acc[phase] = [];
    acc[phase].push(project);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-24 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-5 tracking-tight">
            Solving the Colorado River Crisis
          </h1>
          <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed mb-6">
            E2Eden is bringing innovative saltwater cooling and farming technologies to the American Southwest to address the Colorado River water crisis. Our mission: configure proven technologies for the US context, scale production in the Southwest, transform the Salton Sea region, and then deploy this integrated farm + tunnel approach globally.
          </p>
          <div className="inline-block px-6 py-3 bg-amber-400/10 border-2 border-amber-400/30 rounded-lg">
            <p className="text-sm font-semibold text-amber-400">
              From R&D validation → US Southwest commercialization → Salton Sea transformation → Global deployment
            </p>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center mb-16">
          {/* Phase Filters */}
          <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
            {["All", "R&D", "US Commercialization", "Salton Sea Transformation", "Global Deployment"].map((phase) => (
              <button
                key={phase}
                onClick={() => setSelectedPhase(phase === "All" ? "all" : phase)}
                className={`px-6 py-2 rounded-lg font-medium transition-all border-2 ${
                  selectedPhase === (phase === "All" ? "all" : phase)
                    ? "bg-amber-400 text-black border-amber-400"
                    : "bg-black text-white/70 border-white/20 hover:border-amber-400"
                }`}
              >
                {phase}
              </button>
            ))}
          </div>


        </div>

        {/* Visionary Projects Section */}
        {visionaryProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-16 p-8 bg-purple-900/20 border-2 border-purple-400/30 rounded-xl"
          >
            <h2 className="text-2xl font-bold text-purple-300 mb-4">Visionary Projects: Regional Transformation</h2>
            <p className="text-purple-200/80 mb-6 leading-relaxed">
              Large-scale regional transformation initiatives that reimagine landscapes and create new microclimate ecosystems through integrated saltwater infrastructure and sustainable agriculture.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {visionaryProjects.sort((a, b) => (b.year || "").localeCompare(a.year || "")).map((project) => (
                <div key={project.id} className="bg-white/5 p-4 rounded-lg border border-purple-400/20">
                  <div className="flex gap-4">
                    {project.hero_image && (
                      <img
                        src={project.hero_image}
                        alt={project.name}
                        className="w-20 h-20 object-cover rounded flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm">{project.name}</h3>
                      <p className="text-xs text-white/50 mt-1">{project.location}</p>
                      <p className="text-xs text-purple-300 font-medium mt-2">{project.year || "Date TBD"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Legacy Foundation Section */}
        {legacyProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-16 p-8 bg-blue-900/20 border-2 border-blue-400/30 rounded-xl"
          >
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Building on Legacy: Seawater Greenhouse Foundation</h2>
            <p className="text-blue-200/80 mb-6 leading-relaxed">
              E2Eden's approach builds directly on proven technologies from Seawater Greenhouse. Their groundbreaking projects demonstrated the viability and effectiveness of saltwater evaporative cooling and integrated farming systems. We're now applying these validated techniques to solve the Colorado River crisis and configure them for large-scale deployment in the US Southwest and beyond.
            </p>
            <LegacyCarousel projects={legacyProjects.sort((a, b) => (b.year || "").localeCompare(a.year || ""))} />
          </motion.div>
        )}

        {/* Timeline Carousel */}
        <div className="space-y-12">
          {Object.entries(groupedByPhase).map(([phase, phaseProjects]) => (
            <PhaseCarousel key={phase} phase={phase} projects={phaseProjects} />
          ))}
        </div>
      </div>
    </div>
  );
}