import React from "react";
import { motion } from "framer-motion";
import { Waves, Droplets, Wind, Thermometer, Sprout, Zap } from "lucide-react";

export default function Technology() {
  const heroFeature = {
    title: "Evaporative Cooling Walls",
    subtitle: "Revolutionary Climate Technology",
    description: "Our patented evaporative cooling wall system transforms arid environments into thriving agricultural zones. By harnessing the natural cooling power of water evaporation, these vertical structures create a blanket of cool, humid air that sweeps across farmland, dramatically reducing plant transpiration and water loss.",
    benefits: [
      { label: "Water Savings", value: "60%", description: "Reduced irrigation needs" },
      { label: "Temperature Drop", value: "15°C", description: "Ambient cooling effect" },
      { label: "Humidity Increase", value: "40%", description: "Optimal crop conditions" }
    ]
  };

  const technologies = [
    {
      icon: Wind,
      category: "Climate Engineering",
      title: "Microclimate Management",
      description: "Strategic placement of cooling walls creates localized climate zones, enabling cultivation in previously impossible conditions.",
      color: "from-cyan-500/20 to-blue-500/20",
      iconColor: "text-cyan-400"
    },
    {
      icon: Droplets,
      category: "Water Conservation",
      title: "Transpiration Control",
      description: "The humid air envelope reduces plant water stress, minimizing transpiration rates and maximizing water efficiency across the entire farm.",
      color: "from-blue-500/20 to-indigo-500/20",
      iconColor: "text-blue-400"
    },
    {
      icon: Sprout,
      category: "Agriculture",
      title: "Salt-Tolerant Crops",
      description: "Pioneering halophyte cultivation that thrives in our engineered microclimates, transforming saline environments into productive farmland.",
      color: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400"
    },
    {
      icon: Zap,
      category: "Renewable Energy",
      title: "Hydroelectric Integration",
      description: "Water circulation through cooling systems doubles as micro-hydroelectric generation, powering monitoring equipment sustainably.",
      color: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-400"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 py-20 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
            Our Technology
          </h1>
          <p className="text-xl text-white/70 max-w-3xl">
            Combining cutting-edge engineering with nature-based solutions to create
            sustainable systems that work with the environment, not against it.
          </p>
        </motion.div>

        {/* Technology Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {technologies.map((tech, idx) => (
            <motion.div
              key={tech.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-white/[0.06] ${tech.iconColor}`}>
                    <tech.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-wider text-white/40 mb-1">
                      {tech.category}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {tech.title}
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {tech.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20"
        >
          <h3 className="text-2xl font-bold text-white mb-2">
            Innovation in Action
          </h3>
          <p className="text-white/70">
            Every technology we deploy is field-tested and refined through years of
            real-world application across diverse environments and communities.
          </p>
        </motion.div>
      </div>
    </div>
  );
}