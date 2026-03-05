import React, { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Upload, Pencil } from "lucide-react";
import { base44 } from "@/api/base44Client";

const DEFAULT_IMAGES = [
  {
    key: "root_cause_img_1",
    default: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop",
    caption: "Flood irrigation wastes up to 60% of water through evaporation and runoff",
  },
  {
    key: "root_cause_img_2",
    default: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop",
    caption: "Conventional row crops across millions of acres rely on inefficient water delivery",
  },
  {
    key: "root_cause_img_3",
    default: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=800&h=600&fit=crop",
    caption: "Over-extraction of aquifers is causing land subsidence and permanent water loss",
  },
];

const PIE_DATA = [
  { name: "Agriculture", value: 85, color: "#f59e0b" },
  { name: "Municipal / Residential", value: 8, color: "#60a5fa" },
  { name: "Industrial & Commercial", value: 7, color: "#34d399" },
];

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight="bold">
      {value}%
    </text>
  );
};

export default function RootCauseSection({ isAdmin }) {
  const [imageUrls, setImageUrls] = useState({});
  const [uploading, setUploading] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const getUrl = (img) => imageUrls[img.key] || img.default;

  const handleUpload = async (imgKey, file) => {
    setUploading(imgKey);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setImageUrls((prev) => ({ ...prev, [imgKey]: file_url }));
    setUploading(null);
  };

  return (
    <section className="py-24 px-6 sm:px-12 bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Section header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">The Root Cause</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
            <h2 className="text-5xl font-bold text-white">
              The Problem: Agriculture Uses 85% of Our Water
            </h2>
            {isAdmin && (
              <button
                onClick={() => setEditMode((v) => !v)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  editMode
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                    : "bg-white/5 border-white/10 text-white/50 hover:text-white/80"
                }`}
              >
                <Pencil className="w-4 h-4" />
                {editMode ? "Done Editing" : "Edit Images"}
              </button>
            )}
          </div>

          <p className="text-xl leading-relaxed mb-12 text-white/70">
            Agriculture consumes a staggering 85% of global freshwater resources. Traditional farming methods are
            incredibly inefficient — most water evaporates or runs off before crops can even use it.
          </p>

          {/* Image Grid */}
          <div className="grid md:grid-cols-3 gap-5 mb-12">
            {DEFAULT_IMAGES.map((img) => (
              <div key={img.key} className="relative rounded-2xl overflow-hidden group">
                <div className="aspect-[4/3] relative">
                  <img
                    src={getUrl(img)}
                    alt={img.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <p className="absolute bottom-3 left-3 right-3 text-white/80 text-xs leading-snug">
                    {img.caption}
                  </p>

                  {/* Upload overlay when in edit mode */}
                  {editMode && (
                    <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 cursor-pointer z-10">
                      {uploading === img.key ? (
                        <div className="text-white/70 text-sm animate-pulse">Uploading...</div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-amber-400 mb-2" />
                          <span className="text-white text-sm font-medium">Replace Image</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files[0] && handleUpload(img.key, e.target.files[0])}
                      />
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Stat + Pie Chart layout */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Big stat */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 h-full flex flex-col justify-center">
              <div className="text-8xl font-bold text-amber-400 mb-4">85%</div>
              <p className="text-2xl font-semibold mb-3 text-white">
                Of global freshwater goes to agriculture
              </p>
              <p className="text-lg text-white/60">
                Yet billions go hungry. We can't keep farming this way.
              </p>
              <div className="mt-6 space-y-2">
                {PIE_DATA.map((d) => (
                  <div key={d.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-white/70 text-sm">{d.name}</span>
                    <span className="ml-auto text-white font-semibold text-sm">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie Chart */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-center text-white/70 text-sm uppercase tracking-widest mb-4">
                Global Freshwater Usage Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={PIE_DATA}
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    dataKey="value"
                    labelLine={false}
                    label={CustomLabel}
                  >
                    {PIE_DATA.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.85)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#fff" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend
                    formatter={(value) => <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}