import React, { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Award, Heart, Building2, FileText } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import DonationModal from "../components/funding/DonationModal";

export default function Funding() {
  const [donationModal, setDonationModal] = useState({ isOpen: false, projectName: null });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('sort_order'),
  });

  const impacts = [
    { value: "$127M", label: "Total Funding Secured" },
    { value: "43", label: "Active Projects" },
    { value: "250K+", label: "Lives Impacted" },
    { value: "18", label: "Partner Organizations" }
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 sm:px-8">
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

        {/* 1. Venture Investment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Venture Investment</h2>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-white/[0.06] text-blue-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    Strategic Investment
                  </h3>
                  <div className="text-xs uppercase tracking-wider text-white/40">
                    From $5M+
                  </div>
                </div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Partner with us on large-scale infrastructure projects that generate both environmental and financial returns. Clear milestones, ROI projections, and measurable impact metrics.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 2. Donate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Donate</h2>
          
          {/* (a) E2Eden General */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Support E2Eden</h3>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-white/[0.06] text-pink-400">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">
                      General Fund
                    </h3>
                    <div className="text-xs uppercase tracking-wider text-white/40">
                      Any amount
                    </div>
                  </div>
                </div>
                <p className="text-sm text-white/70 leading-relaxed mb-4">
                  Make a direct impact through donations that fund research, training, and pilot programs in underserved regions.
                </p>
                <button
                  onClick={() => setDonationModal({ isOpen: true, projectName: null })}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 font-medium transition-colors border border-pink-500/20"
                >
                  Donate to E2Eden
                </button>
              </div>
            </div>
          </div>

          {/* (b) Projects */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Support Specific Projects</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
                  className="relative group cursor-pointer rounded-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-48">
                    {project.hero_image ? (
                      <img 
                        src={project.hero_image}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        style={{ objectPosition: project.hero_image_position || 'center center' }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="text-white font-semibold text-lg leading-tight drop-shadow-lg">
                        {project.name}
                      </h4>
                      <p className="text-white/70 text-xs mt-1">{project.location}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-white/70 leading-relaxed mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    <button
                      onClick={() => setDonationModal({ isOpen: true, projectName: project.name })}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium transition-colors border border-amber-500/20 text-sm"
                    >
                      Donate to Project
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 3. Grants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Grants</h2>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-white/[0.06] text-green-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    Community & Research Grants
                  </h3>
                  <div className="text-xs uppercase tracking-wider text-white/40">
                    From $50K+
                  </div>
                </div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Support grassroots projects that empower local communities through sustainable agriculture, renewable energy, and innovative water management solutions.
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

      <DonationModal
        isOpen={donationModal.isOpen}
        onClose={() => setDonationModal({ isOpen: false, projectName: null })}
        projectName={donationModal.projectName}
      />
    </div>
  );
}