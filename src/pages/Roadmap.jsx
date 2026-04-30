import React, { useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Loader2, MapPin } from "lucide-react";

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
            <div className="grid md:grid-cols-2 gap-4">
              {legacyProjects.sort((a, b) => (b.year || "").localeCompare(a.year || "")).map((project) => (
                <div key={project.id} className="bg-white/5 p-4 rounded-lg border border-blue-400/20">
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
                      <p className="text-xs text-blue-300 font-medium mt-2">{project.year || "Date TBD"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Timeline */}
        <div className="space-y-12">
            {Object.entries(groupedByPhase).map(([phase, phaseProjects]) => (
              <motion.div
                key={phase}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-white mb-3 pb-3 border-b-2 border-white/20">
                  {phase.toUpperCase()}
                </h2>
                {phase === "US Commercialization" && (
                  <p className="text-white/70 text-sm mb-6 italic">Scale farming operations across the Southwest to demonstrate economic viability and establish our production blueprint.</p>
                )}
                {phase === "Salton Sea Transformation" && (
                  <p className="text-white/70 text-sm mb-6 italic">Deploy integrated farm + tunnel infrastructure to import water at scale, transform the region's microclimate, and revitalize the Salton Sea basin.</p>
                )}
                {phase === "Global Deployment" && (
                  <p className="text-white/70 text-sm mb-6 italic">Roll out proven farm and tunnel technologies worldwide to address water scarcity and create sustainable agricultural zones globally.</p>
                )}
                {phase === "R&D" && (
                  <p className="text-white/70 text-sm mb-6 italic">Validate core technologies and configure solutions for US context deployment.</p>
                )}

                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-1 bg-amber-400" />

                  {/* Timeline Items */}
                  <div className="space-y-6 ml-20">
                    {phaseProjects.map((project, idx) => {
                      const isCompleted = project.status === "completed";
                      const isInProgress = project.status === "active";
                      const milestoneCount = project.project_updates ? project.project_updates.split(",").length : 8;

                      return (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          className="relative"
                        >
                          {/* Marker */}
                          <div className="absolute -left-16 top-6 w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center border-4 border-black shadow-md">
                            {isCompleted ? (
                              <CheckCircle2 className="w-6 h-6 text-black" />
                            ) : isInProgress ? (
                              <Loader2 className="w-6 h-6 text-black animate-spin" />
                            ) : (
                              <div className="w-2 h-2 bg-black rounded-full" />
                            )}
                          </div>

                          {/* Card */}
                          <div className="border-2 border-white/20 rounded-xl p-6 bg-white/5 hover:shadow-lg hover:shadow-amber-400/10 transition-shadow">
                            <div className="flex gap-6">
                              {/* Image */}
                              {project.hero_image && (
                                <img
                                  src={project.hero_image}
                                  alt={project.name}
                                  className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                                />
                              )}

                              {/* Content */}
                              <div className="flex-1">
                                {/* Status Badge */}
                                <div className="mb-3">
                                  <span
                                    className={`inline-block px-3 py-1 text-xs font-bold rounded ${
                                      isCompleted
                                        ? "bg-white/20 text-white"
                                        : isInProgress
                                          ? "bg-amber-400/20 text-amber-400"
                                          : "bg-white/10 text-white/70"
                                    }`}
                                  >
                                    {isCompleted
                                      ? `COMPLETED ${project.year}`
                                      : isInProgress
                                        ? `IN PROGRESS ${project.year}`
                                        : `PLANNED ${project.year}`}
                                  </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold text-white mb-2">{project.name}</h3>

                                {/* Location */}
                                <div className="flex items-center gap-1 text-white/60 mb-4">
                                  <MapPin className="w-4 h-4" />
                                  <span>{project.location}</span>
                                </div>

                                {/* Milestones */}
                                <div className="text-sm text-white/70 mb-3">
                                  {milestoneCount} milestones
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-white/10 rounded-full h-2">
                                  <div
                                    className="bg-amber-400 h-2 rounded-full"
                                    style={{ width: isCompleted ? "100%" : isInProgress ? "75%" : "0%" }}
                                  />
                                </div>
                                <div className="text-right text-sm text-white/50 mt-1">
                                  {isCompleted ? "8/8" : isInProgress ? "6/8" : "0/8"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}