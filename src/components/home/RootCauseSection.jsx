import React from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import AdminImageUpload from "./AdminImageUpload";

const DEFAULT_IMAGES = [
{
  key: "root_cause_img_1",
  default: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop",
  caption: "Farmers pay a fraction of what cities do for water — sometimes less than 1% of the urban rate. When water is nearly free, there is no financial pressure to use it wisely. The incentive to conserve simply doesn't exist."
},
{
  key: "root_cause_img_2",
  default: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop",
  caption: "Desert farms apply 6 to 10 feet of water per acre every year — not because farmers love wasting it, but because plants in extreme heat suffer heat stress and must transpire constantly just to survive. Drip irrigation can't solve this; the water isn't being wasted in delivery, it's being consumed by the plant's cooling system, and lost to the sky."
},
{
  key: "root_cause_img_3",
  default: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=800&h=600&fit=crop",
  caption: "Cities, for all their size and density, consume a relatively small fraction of the world's freshwater. Every water-saving initiative aimed at households and industry combined cannot match the impact of fixing how we farm. That is where the real battle will be won or lost."
},
];


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

          <h2 className="text-5xl font-bold text-white mb-6">Agriculture Uses 85% of Our Water

          </h2>

          <p className="text-xl leading-relaxed mb-12 text-white/70">
            Agriculture consumes 85% of global freshwater — not because farmers are careless, but because feeding cities in harsh, arid climates is genuinely hard. In extreme heat, crops must continuously transpire to cool themselves or they die. That water goes into the air, not the food. Farmers aren't wasting water; they're caught in a system with no better option. Until now.
          </p>

          {/* Image Grid */}
          <div className="grid md:grid-cols-3 gap-5 mb-0 grid-rows-2">
            {DEFAULT_IMAGES.map((img) =>
            <div key={img.key} className="group">
                <div className="aspect-[4/3] relative rounded-2xl overflow-hidden">
                  <AdminImageUpload
                  src={getImg(img.key, img.default)}
                  alt={img.caption}
                  isAdmin={isAdmin}
                  onUploaded={(url) => setImg(img.key, url)}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <p className="mt-3 text-white/70 text-sm leading-snug">
                  {img.caption}
                </p>
              </div>
            )}
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
                {PIE_DATA.map((d) =>
                <div key={d.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-white/70 text-sm">{d.name}</span>
                    <span className="ml-auto text-white font-semibold text-sm">{d.value}%</span>
                  </div>
                )}
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