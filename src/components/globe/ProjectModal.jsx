import React from "react";
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

export default function ProjectModal({ project, location, onClose }) {
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
              {location && (
                <div className="flex items-center gap-1.5 text-sm text-white/40">
                  <MapPin className="w-4 h-4" />
                  {location}
                </div>
              )}
            </div>

            {/* Image Carousel */}
            {project.images && project.images.length > 0 && (
              <ProjectCarousel images={project.images} />
            )}

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

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-white/70 mb-2">About This Project</h3>
              <p className="text-sm text-white/50 leading-relaxed">{project.description}</p>
            </div>

            {/* Additional details if available */}
            {project.details && (
              <div>
                <h3 className="text-sm font-semibold text-white/70 mb-2">Details</h3>
                <p className="text-sm text-white/50 leading-relaxed">{project.details}</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}