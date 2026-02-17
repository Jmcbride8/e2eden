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
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black">
      <div className="max-w-7xl mx-auto px-6 py-16 sm:px-8">
        
        {/* Hero Feature - Evaporative Cooling Walls */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="relative overflow-hidden rounded-3xl">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-emerald-500/10 animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            <div className="relative p-12 sm:p-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border border-cyan-400/30">
                  <Waves className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-cyan-400/70 font-semibold">
                    {heroFeature.subtitle}
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                    {heroFeature.title}
                  </h1>
                </div>
              </div>

              <p className="text-lg text-white/80 leading-relaxed max-w-4xl mb-10">
                {heroFeature.description}
              </p>

              {/* Stats */}
              <div className="grid sm:grid-cols-3 gap-6">
                {heroFeature.benefits.map((benefit, idx) => (
                  <motion.div
                    key={benefit.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] to-white/[0.04] rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl border border-white/10">
                      <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-400 mb-1">
                        {benefit.value}
                      </div>
                      <div className="text-sm font-semibold text-white mb-1">
                        {benefit.label}
                      </div>
                      <div className="text-xs text-white/50">
                        {benefit.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              The Science of Cool
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Water evaporates from vertical cooling walls, creating a continuous flow of cool, humid air that blankets crops and dramatically reduces their water needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {technologies.map((tech, idx) => (
              <motion.div
                key={tech.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 group-hover:border-white/20 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-white/[0.06] ${tech.iconColor} group-hover:scale-110 transition-transform duration-300`}>
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
        </motion.div>

        {/* Impact Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10" />
          <div className="relative p-10 rounded-3xl border border-emerald-500/20">
            <Thermometer className="w-12 h-12 text-emerald-400 mb-4" />
            <h3 className="text-3xl font-bold text-white mb-3">
              Nature-Inspired Engineering
            </h3>
            <p className="text-lg text-white/70 leading-relaxed max-w-3xl">
              By mimicking how forests create their own microclimates, our evaporative cooling technology works in harmony with natural systems. The result: thriving agriculture in the world's most challenging environments, using a fraction of the water.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}