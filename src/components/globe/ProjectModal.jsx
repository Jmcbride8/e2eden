import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, MapPin, Wrench, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";

const typeConfig = {
  Farming: {
    icon: Leaf,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    badge: "bg-emerald-500/20 text-emerald-300",
  },
  Tunnels: {
    icon: Wrench,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    badge: "bg-amber-500/20 text-amber-300",
  },
  Minerals: {
    icon: Wrench,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    badge: "bg-purple-500/20 text-purple-300",
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
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();
  
  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);
  
  if (!project) return null;

  const types = Array.isArray(project.type) ? project.type : [project.type].filter(Boolean);
  const isAdmin = user?.role === 'admin';

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
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {types.map((type) => {
                  const config = typeConfig[type] || typeConfig.Tunnels;
                  const Icon = config.icon;
                  return (
                    <Badge key={type} className={`${config.badge} text-xs px-2 py-0.5 border-0 flex items-center gap-1`}>
                      <Icon className="w-3 h-3" />
                      {type}
                    </Badge>
                  );
                })}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{project.name}</h2>
              
              {/* Image Carousel */}
               {project.hero_image || (project.images && project.images.length > 0) ? (
                 <div className="relative w-full h-64 rounded-xl overflow-hidden mb-3">
                   <Carousel className="w-full h-full">
                     <CarouselContent className="h-full">
                       {project.hero_image && (
                         <CarouselItem className="h-64">
                           <img 
                             src={project.hero_image}
                             alt={`${project.name} - Hero`}
                             className="w-full h-full object-cover rounded-xl"
                             style={{ objectPosition: project.hero_image_position || 'center center' }}
                           />
                         </CarouselItem>
                       )}
                       {project.images && project.images.map((image, index) => (
                         <CarouselItem key={index} className="h-64">
                           <img 
                             src={image}
                             alt={`${project.name} - Image ${index + 1}`}
                             className="w-full h-full object-cover rounded-xl"
                           />
                         </CarouselItem>
                       ))}
                     </CarouselContent>
                     {project.images && project.images.length > 0 && (
                      <>
                        <CarouselPrevious className="left-4 bg-black/50 hover:bg-black/70 border-white/20 text-white" />
                        <CarouselNext className="right-4 bg-black/50 hover:bg-black/70 border-white/20 text-white" />
                      </>
                     )}
                  </Carousel>
                </div>
              ) : null}
              
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