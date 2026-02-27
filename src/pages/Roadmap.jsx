import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";

export default function Roadmap() {
  const milestones = [
    {
      year: "2023",
      status: "completed",
      items: [
        { title: "Dead Sea Restoration Initiative Completed", description: "Successfully implemented water management systems in Israel" },
        { title: "Lake Turkana Pilot Program", description: "Launched sustainable fishing and solar power project in Kenya" },
        { title: "Amazon Basin Partnership", description: "Established collaboration with indigenous communities in Brazil" }
      ]
    },
    {
      year: "2024",
      status: "completed",
      items: [
        { title: "Qattara Feasibility Study", description: "Comprehensive analysis of hydroelectric potential in Egypt" },
        { title: "Expanded to 6 Continents", description: "Reached operational presence across all inhabited continents" },
        { title: "Technology Platform Launch", description: "Released open-source monitoring tools for partner organizations" }
      ]
    },
    {
      year: "2025",
      status: "active",
      items: [
        { title: "Lake Eyre Salt Harvest Project", description: "Sustainable mineral extraction and halophyte agriculture in Australia" },
        { title: "Sahel Green Belt Expansion", description: "Scaling regenerative agriculture across 5 African nations" },
        { title: "Pacific Island Climate Resilience", description: "Implementing coastal protection and food security systems" }
      ]
    },
    {
      year: "2026",
      status: "planned",
      items: [
        { title: "Qattara Phase 1 Construction", description: "Breaking ground on hydroelectric infrastructure in Egypt" },
        { title: "South Asian Water Initiative", description: "Large-scale irrigation modernization across India and Bangladesh" },
        { title: "Carbon Credit Platform", description: "Launch blockchain-based verification system for regenerative projects" }
      ]
    },
    {
      year: "2027",
      status: "planned",
      items: [
        { title: "Aral Sea Restoration Pilot", description: "Collaborative effort with Central Asian governments" },
        { title: "Global Knowledge Network", description: "Establishing training centers on all continents" },
        { title: "1 Million Hectares Milestone", description: "Reaching one million hectares of restored and productive land" }
      ]
    }
  ];

  const statusConfig = {
    completed: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/30" },
    active: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30" },
    planned: { icon: Circle, color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30" }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 sm:px-8 sm:pt-28">
         {/* Header */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="text-center mb-16"
         >
           <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
             Our Roadmap
           </h1>
           <p className="text-xl text-white/70 max-w-3xl mx-auto">
             A strategic vision for sustainable development spanning from foundational
             projects to global transformation initiatives.
           </p>
         </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/10" />

          <div className="space-y-12">
            {milestones.map((milestone, idx) => {
              const config = statusConfig[milestone.status];
              const Icon = config.icon;
              
              return (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="relative"
                >
                  {/* Year marker */}
                  <div className="flex items-center gap-6 mb-6">
                    <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full ${config.bg} border-2 ${config.border}`}>
                      <Icon className={`w-7 h-7 ${config.color}`} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{milestone.year}</h2>
                      <span className={`text-sm uppercase tracking-wider ${config.color}`}>
                        {milestone.status}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="ml-24 space-y-4">
                    {milestone.items.map((item, itemIdx) => (
                      <motion.div
                        key={itemIdx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.15 + itemIdx * 0.1 }}
                        className="p-5 rounded-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300"
                      >
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-white/60 leading-relaxed">
                          {item.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 flex flex-wrap gap-6 p-6 rounded-xl bg-white/[0.03] border border-white/10"
        >
          {Object.entries(statusConfig).map(([status, config]) => {
            const Icon = config.icon;
            return (
              <div key={status} className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${config.color}`} />
                <span className="text-sm text-white/70 capitalize">{status}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}