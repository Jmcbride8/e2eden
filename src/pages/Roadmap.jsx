import React, { useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Loader2, MapPin } from "lucide-react";

export default function Roadmap() {
  const [selectedPhase, setSelectedPhase] = useState("all");
  const [viewMode, setViewMode] = useState("timeline");

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => base44.entities.Project.list("sort_order"),
  });

  const phaseOrder = { "R&D": 0, Commercialization: 1, Transformation: 2 };
  const filteredProjects =
    selectedPhase === "all"
      ? projects.sort((a, b) => (phaseOrder[a.phase] ?? 999) - (phaseOrder[b.phase] ?? 999))
      : projects.filter((p) => p.phase === selectedPhase).sort((a, b) => (a.year || "").localeCompare(b.year || ""));

  const groupedByPhase = filteredProjects.reduce((acc, project) => {
    const phase = project.phase || "Other";
    if (!acc[phase]) acc[phase] = [];
    acc[phase].push(project);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-24 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-black mb-5 tracking-tight">
            Roadmap
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            From pioneering research to global transformation — our journey to make deserts bloom.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center mb-16">
          {/* Phase Filters */}
          <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
            {["All", "R&D", "Commercialization", "Transformation"].map((phase) => (
              <button
                key={phase}
                onClick={() => setSelectedPhase(phase === "All" ? "all" : phase)}
                className={`px-6 py-2 rounded-lg font-medium transition-all border-2 ${
                  selectedPhase === (phase === "All" ? "all" : phase)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-800 border-gray-300 hover:border-blue-600"
                }`}
              >
                {phase}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            {["Timeline", "Gantt"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode.toLowerCase())}
                className={`px-6 py-2 rounded-lg font-medium transition-all border-2 ${
                  viewMode === mode.toLowerCase()
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-800 border-gray-300 hover:border-blue-600"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline View */}
        {viewMode === "timeline" && (
          <div className="space-y-12">
            {Object.entries(groupedByPhase).map(([phase, phaseProjects]) => (
              <motion.div
                key={phase}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-black mb-6 pb-3 border-b-2 border-gray-300">
                  {phase.toUpperCase()} PHASE
                </h2>

                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-1 bg-blue-600" />

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
                          <div className="absolute -left-16 top-6 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center border-4 border-white shadow-md">
                            {isCompleted ? (
                              <CheckCircle2 className="w-6 h-6 text-white" />
                            ) : isInProgress ? (
                              <Loader2 className="w-6 h-6 text-white animate-spin" />
                            ) : (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>

                          {/* Card */}
                          <div className="border-2 border-gray-300 rounded-xl p-6 bg-white hover:shadow-lg transition-shadow">
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
                                    className={`inline-block px-3 py-1 text-xs font-bold rounded text-white ${
                                      isCompleted
                                        ? "bg-gray-600"
                                        : isInProgress
                                          ? "bg-blue-600"
                                          : "bg-gray-500"
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
                                <h3 className="text-2xl font-bold text-black mb-2">{project.name}</h3>

                                {/* Location */}
                                <div className="flex items-center gap-1 text-gray-600 mb-4">
                                  <MapPin className="w-4 h-4" />
                                  <span>{project.location}</span>
                                </div>

                                {/* Milestones */}
                                <div className="text-sm text-gray-700 mb-3">
                                  {milestoneCount} milestones
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: isCompleted ? "100%" : isInProgress ? "75%" : "0%" }}
                                  />
                                </div>
                                <div className="text-right text-sm text-gray-600 mt-1">
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
        )}

        {/* Gantt View Placeholder */}
        {viewMode === "gantt" && (
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <p className="text-gray-600 text-lg">Gantt view coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}