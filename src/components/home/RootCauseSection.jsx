import React from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import AdminImageUpload from "./AdminImageUpload";

const DEFAULT_IMAGES = [
{
  key: "root_cause_img_3",
  title: "We farm in deserts",
  default: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=800&h=600&fit=crop",
  caption: "Every water-saving campaign combined barely registers. Fix farming, fix the crisis."
},
{
  key: "root_cause_img_2",
  title: "Water evaporates away",
  default: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop",
  caption: "In desert heat, crops must sweat constantly just to survive. That water evaporates into the sky, not into food."
},
{
  key: "root_cause_img_desalination",
  title: "Desalination is 10x too costly",
  default: "https://images.unsplash.com/photo-1548783300-b4f9d05cdd67?w=800&h=600&fit=crop",
  caption: "Desalination costs $20,000 per acre-foot. Alfalfa sells for $4,000 per acre. The math doesn't work."
}];



const PIE_DATA = [
{ name: "Agriculture", value: 85, color: "#f59e0b" },
{ name: "Municipal / Residential", value: 8, color: "#60a5fa" },
{ name: "Industrial & Commercial", value: 7, color: "#34d399" }];


const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight="bold">
      {value}%
    </text>);

};

export default function RootCauseSection({ isAdmin, getHomeImg, setHomeImg }) {
  const getImg = (key, fallback) => getHomeImg ? getHomeImg(key, fallback) : fallback;
  const setImg = (key, url) => setHomeImg ? setHomeImg(key, url) : null;

  return (
    <section className="py-24 px-6 sm:px-12 bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}>

          {/* Section header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Where the Water Is</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <h2 className="text-5xl font-bold text-white mb-6">Agriculture Uses 85% Of Our Water</h2>

          <p className="text-xl leading-relaxed mb-12 text-white/70">
            Desert farms are where water is used, lost, and must be saved
          </p>

          {/* Image Grid */}
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {DEFAULT_IMAGES.map((img) =>
            <div key={img.key} className="group">
                <div className="aspect-[4/3] relative rounded-2xl overflow-hidden mb-3">
                  <AdminImageUpload
                  src={getImg(img.key, img.default)}
                  alt={img.caption}
                  isAdmin={isAdmin}
                  onUploaded={(url) => setImg(img.key, url)}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{img.title}</h3>
                <p className="text-white/60 leading-relaxed">
                  {img.caption}
                </p>
              </div>
            )}
          </div>

          {/* Stat + Pie Chart layout */}
          <div className="grid md:grid-cols-2 gap-8 items-stretch mt-0">
            {/* Big stat */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center">
              <div className="text-8xl font-bold text-amber-400 mb-4">85%</div>
              <p className="text-2xl font-semibold mb-3 text-white">
                Of US Southwest freshwater goes to agriculture
              </p>
              <p className="text-lg text-white/60 mb-6">
                Top crops driving that demand:
              </p>
              <div className="space-y-3">
                {[
                { name: "Alfalfa", pct: "42%", color: "#f59e0b" },
                { name: "Cotton", pct: "18%", color: "#60a5fa" },
                { name: "Vegetables & Melons", pct: "15%", color: "#34d399" }].
                map((crop) =>
                <div key={crop.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">{crop.name}</span>
                    <span className="text-white font-semibold">{crop.pct}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div className="h-1.5 rounded-full" style={{ width: crop.pct, backgroundColor: crop.color }} />
                  </div>
                </div>
                )}
              </div>
            </div>

            {/* Pie Chart */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-center text-white/70 text-sm uppercase tracking-widest mb-4">
                US Southwest Freshwater Usage Breakdown
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
                    label={CustomLabel}>

                    {PIE_DATA.map((entry, idx) =>
                    <Cell key={idx} fill={entry.color} />
                    )}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.85)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "8px",
                      color: "#fff"
                    }}
                    itemStyle={{ color: "#fff" }}
                    labelStyle={{ color: "#fff" }} />

                  <Legend
                    formatter={(value) => <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{value}</span>} />

                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

}