import React from "react";
import { motion } from "framer-motion";
import { DollarSign, Users, TrendingUp, Award, Globe2, Heart } from "lucide-react";

export default function Funding() {
  const fundingTypes = [
    {
      icon: Globe2,
      title: "Strategic Investment",
      description: "Partner with us on large-scale infrastructure projects that generate both environmental and financial returns.",
      min: "$5M+",
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400"
    },
    {
      icon: TrendingUp,
      title: "Project Financing",
      description: "Fund specific initiatives with clear milestones, ROI projections, and measurable impact metrics.",
      min: "$500K+",
      color: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-400"
    },
    {
      icon: Users,
      title: "Community Grants",
      description: "Support grassroots projects that empower local communities through sustainable agriculture and renewable energy.",
      min: "$50K+",
      color: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400"
    },
    {
      icon: Heart,
      title: "Philanthropic Support",
      description: "Make a direct impact through donations that fund research, training, and pilot programs in underserved regions.",
      min: "Any amount",
      color: "from-pink-500/20 to-rose-500/20",
      iconColor: "text-pink-400"
    }
  ];

  const impacts = [
    { value: "$127M", label: "Total Funding Secured" },
    { value: "43", label: "Active Projects" },
    { value: "250K+", label: "Lives Impacted" },
    { value: "18", label: "Partner Organizations" }
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 py-20 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
            Funding & Investment
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Join us in creating sustainable solutions that benefit both people and planet.
            Every investment drives measurable environmental and social impact.
          </p>
        </motion.div>

        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {impacts.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 text-center"
            >
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Funding Types */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {fundingTypes.map((type, idx) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${type.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-white/[0.06] ${type.iconColor}`}>
                    <type.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {type.title}
                    </h3>
                    <div className="text-xs uppercase tracking-wider text-white/40">
                      From {type.min}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  {type.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why Invest Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Why Invest in E2Eden?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-semibold text-white">Proven Track Record</h3>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                8+ years of successful project implementation across challenging environments worldwide.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Measurable Impact</h3>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Every project includes clear KPIs, regular reporting, and third-party verification of outcomes.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Sustainable Returns</h3>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Infrastructure projects designed for long-term viability with multiple revenue streams.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20"
        >
          <h3 className="text-2xl font-bold text-white mb-3">
            Ready to Make a Difference?
          </h3>
          <p className="text-white/70 mb-6">
            Contact our investment team to discuss opportunities that align with your goals and values.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:invest@e2eden.org" className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors">
              Contact Investment Team
            </a>
            <a href="mailto:partnerships@e2eden.org" className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/20">
              Explore Partnerships
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}