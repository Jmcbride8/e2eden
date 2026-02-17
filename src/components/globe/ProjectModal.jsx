import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, MapPin, Wrench, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProjectCarousel from "./ProjectCarousel";

const typeConfig = {
  engineering: {
    icon: Wrench,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    badge: "bg-blue-500/20 text-blue-300",
  },
  farming: {
    icon: Leaf,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    badge: "bg-emerald-500/20 text-emerald-300",
  },
};

const tabs = [
  { id: "backstory", label: "Backstory" },
  { id: "our_solution", label: "Our Solution" },
  { id: "project_updates", label: "Project Updates" },
  { id: "funding", label: "Funding" },
  { id: "partners", label: "Partners" }
];

export default function ProjectModal({ project, location, onClose }) {
  const [activeTab, setActiveTab] = useState("backstory");
  
  if (!project) return null;

  const config = typeConfig[project.type] || typeConfig.engineering;
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl border border-white/10 p-6"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 z-10"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-2 rounded-lg ${config.bg} border ${config.border}`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <Badge className={`${config.badge} text-xs px-2 py-0.5 border-0`}>
                  {project.type}
                </Badge>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{project.name}</h2>
              
              {/* Hero Image */}
              {project.hero_image && (
                <div className="relative w-full h-64 rounded-xl overflow-hidden mb-3">
                  <img 
                    src={project.hero_image} 
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {location && (
                <div className="flex items-center gap-1.5 text-sm text-white/40">
                  <MapPin className="w-4 h-4" />
                  {location}
                </div>
              )}
            </div>

            {/* Meta info */}
            <div className="flex items-center gap-6 text-sm">
              {project.year && (
                <div className="flex items-center gap-2 text-white/60">
                  <Calendar className="w-4 h-4" />
                  <span>{project.year}</span>
                </div>
              )}
              {project.team && (
                <div className="flex items-center gap-2 text-white/60">
                  <Users className="w-4 h-4" />
                  <span>{project.team}</span>
                </div>
              )}
              <div className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
                project.status === "active" ? "bg-emerald-500/20 text-emerald-400" :
                project.status === "completed" ? "bg-blue-500/20 text-blue-400" : 
                "bg-amber-500/20 text-amber-400"
              }`}>
                {project.status?.toUpperCase()}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-white/10">
              <div className="flex gap-1 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors relative ${
                      activeTab === tab.id
                        ? "text-white"
                        : "text-white/50 hover:text-white/70"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-white/90 leading-relaxed"
                >
                  {activeTab === "backstory" && (
                    <div>
                      {project.backstory ? (
                        <p className="whitespace-pre-wrap">{project.backstory}</p>
                      ) : (
                        <p className="text-white/40 italic">No backstory added yet.</p>
                      )}
                    </div>
                  )}
                  {activeTab === "our_solution" && (
                    <div>
                      {project.our_solution ? (
                        <p className="whitespace-pre-wrap">{project.our_solution}</p>
                      ) : (
                        <p className="text-white/40 italic">No solution details added yet.</p>
                      )}
                    </div>
                  )}
                  {activeTab === "project_updates" && (
                    <div>
                      {project.project_updates ? (
                        <p className="whitespace-pre-wrap">{project.project_updates}</p>
                      ) : (
                        <p className="text-white/40 italic">No updates available yet.</p>
                      )}
                    </div>
                  )}
                  {activeTab === "funding" && (
                    <div>
                      {project.funding ? (
                        <p className="whitespace-pre-wrap">{project.funding}</p>
                      ) : (
                        <p className="text-white/40 italic">No funding information available yet.</p>
                      )}
                    </div>
                  )}
                  {activeTab === "partners" && (
                    <div>
                      {project.partners ? (
                        <p className="whitespace-pre-wrap">{project.partners}</p>
                      ) : (
                        <p className="text-white/40 italic">No partners listed yet.</p>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}