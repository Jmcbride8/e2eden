import React, { useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import DonationModal from "../components/funding/DonationModal";
import ContactModal from "../components/contact/ContactModal";

const pocData = [
  { name: "Equipment & Setup", value: 25000, fill: "#F59E0B" },
  { name: "Operations", value: 15000, fill: "#FBBF24" },
  { name: "Monitoring & Analysis", value: 10000, fill: "#FCD34D" },
];

const pilotData = [
  { name: "Infrastructure & Equipment", value: 2500000, fill: "#F59E0B" },
  { name: "Operations & Labor", value: 1500000, fill: "#FBBF24" },
  { name: "Research & Monitoring", value: 750000, fill: "#FCD34D" },
  { name: "Contingency & Admin", value: 250000, fill: "#FEF08A" },
];

const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "#000",
    border: "1.5px solid #F59E0B",
    borderRadius: "8px",
    padding: "10px 14px",
  },
  labelStyle: { color: "#fff", fontWeight: "700", fontSize: "14px" },
  itemStyle: { color: "#F59E0B", fontWeight: "600" },
  wrapperStyle: { outline: "none" },
};

function CapitalRaiseCard({ delay, image, tag, amount, subtitle, description, chartData, chartFormatter, breakdown, onContact }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
      className="relative rounded-3xl overflow-hidden border border-white/10 group"
    >
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={tag}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 grid lg:grid-cols-2 min-h-[520px]">
        {/* Left: Text content */}
        <div className="flex flex-col justify-between p-10 lg:p-14">
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-400 border border-amber-400/40 bg-amber-400/10 px-3 py-1 rounded-full mb-6">
              {tag}
            </span>
            <div className="text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight">
              {amount}
            </div>
            <p className="text-white/60 text-base mb-8 max-w-xs">{subtitle}</p>
            <p className="text-white/80 text-sm leading-relaxed max-w-sm">{description}</p>
          </div>

          {/* Breakdown */}
          {breakdown && (
            <div className="mt-8 space-y-2">
              {breakdown.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-white/60">{item.label}</span>
                  </div>
                  <span className="text-white font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={onContact}
            className="mt-10 self-start px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30"
          >
            Contact Investment Team →
          </button>
        </div>

        {/* Right: Donut chart */}
        <div className="hidden lg:flex items-center justify-center p-10">
          <div className="w-full max-w-xs">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={chartFormatter}
                  {...TOOLTIP_STYLE}
                />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-white/40 text-xs mt-2 tracking-wide uppercase">Budget Allocation</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Funding() {
  const [donationModal, setDonationModal] = useState({ isOpen: false, projectName: null });
  const [contactModal, setContactModal] = useState({ isOpen: false, defaultReason: "" });

  const openContact = () => setContactModal({ isOpen: true, defaultReason: "Venture Investment" });

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-24 sm:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-5 tracking-tight">
            Funding & Investment
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Join us in creating sustainable solutions that benefit both people and planet.
            Every investment drives measurable environmental and social impact.
          </p>
        </motion.div>

        {/* Capital Raise Cards */}
        <div className="space-y-10">

          <CapitalRaiseCard
            delay={0.2}
            image="https://media.base44.com/images/public/6993b7c68cee7955d3266d09/49ed4c6ca_ChatGPTImageApr21202603_30_44PM.png"
            tag="Capital Raise · Proof of Concept"
            amount="$50,000"
            subtitle="Initial Proof of Concept Deployment"
            description="Validate core technology with a small-scale deployment to prove concept viability and gather essential performance data before scaling."
            chartData={pocData}
            chartFormatter={(value) => [`$${(value / 1000).toFixed(0)}K`, ""]}
            breakdown={[
              { label: "Equipment & Setup", value: "$25K", color: "#F59E0B" },
              { label: "Operations", value: "$15K", color: "#FBBF24" },
              { label: "Monitoring & Analysis", value: "$10K", color: "#FCD34D" },
            ]}
            onContact={openContact}
          />

          <CapitalRaiseCard
            delay={0.35}
            image="https://media.base44.com/images/public/6993b7c68cee7955d3266d09/c77b2ee30_ChatGPTImageApr21202603_25_40PM.png"
            tag="Capital Raise · USA Pilot Project"
            amount="$5,000,000"
            subtitle="Imperial Valley Pilot Deployment"
            description="Validate technology performance at scale, demonstrate economic viability, and establish a repeatable blueprint for global expansion."
            chartData={pilotData}
            chartFormatter={(value) => [`$${(value / 1000000).toFixed(1)}M`, ""]}
            breakdown={[
              { label: "Infrastructure & Equipment", value: "$2.5M", color: "#F59E0B" },
              { label: "Operations & Labor", value: "$1.5M", color: "#FBBF24" },
              { label: "Research & Monitoring", value: "$750K", color: "#FCD34D" },
              { label: "Contingency & Admin", value: "$250K", color: "#FEF08A" },
            ]}
            onContact={openContact}
          />

        </div>
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