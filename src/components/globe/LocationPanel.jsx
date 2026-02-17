import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

export default function LocationPanel({ location, onClose }) {
  const [selectedProject, setSelectedProject] = useState(null);
  
  if (!location) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={location.name}
        initial={{ opacity: 0, x: 60, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 60, scale: 0.95 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="absolute right-0 top-0 bottom-0 w-full sm:w-[420px] z-20 flex items-center"
      >
        <div className="relative w-full max-h-[85vh] mx-4 sm:mr-8 rounded-2xl overflow-hidden">
          {/* Glass background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl" />
          
          <div className="relative p-6 overflow-y-auto max-h-[85vh] custom-scrollbar">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span className="text-[11px] uppercase tracking-[0.2em] text-amber-400/70 font-medium">
                    {location.region}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {location.name}
                </h2>
                <p className="text-sm text-white/40 mt-1">{location.country}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white/40 hover:text-white hover:bg-white/10 rounded-full h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Stats bar */}
            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-white/[0.06]">
              <div>
                <div className="text-xl font-bold text-white">{location.projects.length}</div>
                <div className="text-[11px] text-white/30 uppercase tracking-wider">Projects</div>
              </div>
              <div>
                <div className="text-xl font-bold text-emerald-400">
                  {location.projects.filter(p => p.status === "active").length}
                </div>
                <div className="text-[11px] text-white/30 uppercase tracking-wider">Active</div>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-400">
                  {location.projects.filter(p => p.status === "completed").length}
                </div>
                <div className="text-[11px] text-white/30 uppercase tracking-wider">Completed</div>
              </div>
            </div>

            {/* Description */}
            {location.description && (
              <p className="text-sm text-white/90 leading-relaxed mb-6">
                {location.description}
              </p>
            )}

            {/* Projects */}
            <div className="space-y-3">
              {location.projects.map((project, idx) => (
                <ProjectCard 
                  key={project.name} 
                  project={project} 
                  index={idx}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          location={location.name}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </AnimatePresence>
  );
}