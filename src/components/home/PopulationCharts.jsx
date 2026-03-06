import React from "react";
import { motion } from "framer-motion";
import AdminImageUpload from "./AdminImageUpload";

export function FertilizerChart({ isAdmin, getHomeImg, setHomeImg }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
    >
      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
        Fertilizer fed <span className="text-green-400">6 billion people</span>
      </h3>
      <p className="text-white/50 text-sm italic mb-1 max-w-md">
        "It is estimated that a third of annual global food production uses ammonia from the Haber–Bosch process, and that this food supports nearly half the world's population"
      </p>
      <p className="text-white/30 text-xs mb-4">– Oxford Scientist</p>
      <AdminImageUpload
        src={getHomeImg("fertilizer_chart", "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/c524cc5fd_Fertilizer_population.png")}
        alt="Fertilizer population chart"
        isAdmin={isAdmin}
        onUploaded={(url) => setHomeImg("fertilizer_chart", url)}
        className="w-full"
        imgClassName="w-full object-contain"
      />
    </motion.div>
  );
}

export function SaltwaterChart({ isAdmin, getHomeImg, setHomeImg }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.15 }}
      className="rounded-2xl border border-amber-500/30 bg-white p-6 sm:p-8"
    >
      <h3 className="text-2xl sm:text-3xl font-bold text-black mb-6">
        Saltwater Farms could feed<br />
        <span className="text-sky-500">the next 6 billion</span>
      </h3>
      <AdminImageUpload
        src={getHomeImg("saltwater_chart", "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/60e566c7d_Water_population.png")}
        alt="Saltwater population chart"
        isAdmin={isAdmin}
        onUploaded={(url) => setHomeImg("saltwater_chart", url)}
        className="w-full"
        imgClassName="w-full object-contain"
      />
    </motion.div>
  );
}