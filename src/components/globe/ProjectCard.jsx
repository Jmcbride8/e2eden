import React from "react";
import { motion } from "framer-motion";
import { Wrench, Leaf, MapPin, Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

export default function ProjectCard({ project, index, onClick }) {
  const config = typeConfig[project.type] || typeConfig.engineering;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      onClick={onClick}
      className={`group relative rounded-xl border ${config.border} ${config.bg} backdrop-blur-sm p-4 
        hover:border-white/20 transition-all duration-300 cursor-pointer`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.bg} border ${config.border} mt-0.5`}>
          <Icon className={`w-4 h-4 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-white truncate">{project.name}</h4>
            <Badge className={`${config.badge} text-[10px] px-1.5 py-0 border-0 font-medium`}>
              {project.type}
            </Badge>
          </div>
          <p className="text-xs text-white/50 leading-relaxed line-clamp-2 mb-3">
            {project.description}
          </p>
          <div className="flex items-center gap-4 text-[11px] text-white/35">
            {project.year && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {project.year}
              </span>
            )}
            {project.team && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {project.team}
              </span>
            )}
            <span className={`ml-auto text-[10px] font-medium ${
              project.status === "active" ? "text-emerald-400" :
              project.status === "completed" ? "text-blue-400" : "text-amber-400"
            }`}>
              {project.status?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}