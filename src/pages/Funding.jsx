import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Building2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import DonationModal from "../components/funding/DonationModal";
import ContactModal from "../components/contact/ContactModal";

export default function Funding() {
  const [donationModal, setDonationModal] = useState({ isOpen: false, projectName: null });
  const [contactModal, setContactModal] = useState({ isOpen: false, defaultReason: "" });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('sort_order'),
  });

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
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                Partner with us on large-scale infrastructure projects that generate both environmental and financial returns. Clear milestones, ROI projections, and measurable impact metrics.
              </p>
              <button
                onClick={() => setContactModal({ isOpen: true, defaultReason: "Venture Investment" })}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-medium transition-colors border border-blue-500/20"
              >
                <TrendingUp className="w-4 h-4" />
                Contact Us
              </button>
            </div>
          </div>
        </motion.div>

        {/* 2. Project Fundraising */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Project Opportunities</h2>
            <h3 className="text-lg font-semibold text-white mb-4 text-white/80">Support our two flagship projects driving climate impact</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.filter(p => p.status !== "completed" && p.phase !== "Transformation").map((project, idx) => (
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
              </motion.div>

        {/* Capital Raise Target */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Capital Raise: USA Pilot Project</h2>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="mb-8">
                <div className="text-4xl font-bold text-amber-400 mb-2">$5,000,000</div>
                <p className="text-white/70">Total Capital Target for Imperial Valley Pilot Deployment</p>
              </div>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-white font-semibold mb-2">Infrastructure & Equipment</h4>
                    <p className="text-amber-400 text-lg font-bold mb-1">$2,500,000</p>
                    <p className="text-white/60 text-sm">Cooling wall systems, irrigation infrastructure, and facility construction</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-white font-semibold mb-2">Operations & Labor</h4>
                    <p className="text-amber-400 text-lg font-bold mb-1">$1,500,000</p>
                    <p className="text-white/60 text-sm">18-month operational costs, staffing, and maintenance</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-white font-semibold mb-2">Research & Monitoring</h4>
                    <p className="text-amber-400 text-lg font-bold mb-1">$750,000</p>
                    <p className="text-white/60 text-sm">Data collection, analysis, and third-party verification</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-white font-semibold mb-2">Contingency & Admin</h4>
                    <p className="text-amber-400 text-lg font-bold mb-1">$250,000</p>
                    <p className="text-white/60 text-sm">Risk mitigation and project administration</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-white/70 mb-4">
                  This proof-of-concept deployment will validate technology performance, demonstrate economic viability, and establish a blueprint for global scaling.
                </p>
                <button
                  onClick={() => setContactModal({ isOpen: true, defaultReason: "Venture Investment" })}
                  className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors"
                >
                  Contact Investment Team
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <DonationModal
        isOpen={donationModal.isOpen}
        onClose={() => setDonationModal({ isOpen: false, projectName: null })}
        projectName={donationModal.projectName}
      />
      <ContactModal
        isOpen={contactModal.isOpen}
        onClose={() => setContactModal({ isOpen: false, defaultReason: "" })}
        defaultReason={contactModal.defaultReason}
      />
    </div>
  );
}