import React from "react";
import { motion } from "framer-motion";
import { Zap, Droplet, Sprout, Wind, Cpu, Leaf } from "lucide-react";

export default function Technology() {
  const technologies = [
    {
      icon: Droplet,
      category: "Water Management",
      title: "Advanced Irrigation Systems",
      description: "AI-powered precision irrigation reducing water consumption by up to 40% while maximizing crop yields through sensor networks and predictive analytics.",
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400"
    },
    {
      icon: Zap,
      category: "Renewable Energy",
      title: "Hydroelectric Innovation",
      description: "Harnessing natural elevation differences to generate clean, sustainable power. Our systems integrate seamlessly with local infrastructure.",
      color: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-400"
    },
    {
      icon: Sprout,
      category: "Agriculture",
      title: "Salt-Tolerant Crop Development",
      description: "Pioneering halophyte cultivation techniques that transform challenging environments into productive farmland, working with native ecosystems.",
      color: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400"
    },
    {
      icon: Wind,
      category: "Climate Adaptation",
      title: "Microclimate Engineering",
      description: "Creating localized climate zones through strategic water management and vegetation planning, enabling agriculture in extreme conditions.",
      color: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400"
    },
    {
      icon: Cpu,
      category: "Monitoring",
      title: "IoT Sensor Networks",
      description: "Real-time environmental monitoring systems providing data-driven insights for optimal resource allocation and early intervention.",
      color: "from-indigo-500/20 to-blue-500/20",
      iconColor: "text-indigo-400"
    },
    {
      icon: Leaf,
      category: "Sustainability",
      title: "Regenerative Practices",
      description: "Implementing circular economy principles that restore soil health, increase biodiversity, and create long-term ecosystem resilience.",
      color: "from-teal-500/20 to-green-500/20",
      iconColor: "text-teal-400"
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