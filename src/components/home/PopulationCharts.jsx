import React from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine, ReferenceDot, Tooltip
} from "recharts";

// World population data (in billions) from 1000 AD to 2025
const populationData = [
  { year: 1000, pop: 0.31 },
  { year: 1100, pop: 0.36 },
  { year: 1200, pop: 0.40 },
  { year: 1300, pop: 0.43 },
  { year: 1400, pop: 0.37 },
  { year: 1500, pop: 0.46 },
  { year: 1600, pop: 0.55 },
  { year: 1700, pop: 0.60 },
  { year: 1750, pop: 0.79 },
  { year: 1800, pop: 0.98 },
  { year: 1850, pop: 1.26 },
  { year: 1900, pop: 1.60 },
  { year: 1913, pop: 1.80 },
  { year: 1930, pop: 2.07 },
  { year: 1950, pop: 2.50 },
  { year: 1960, pop: 3.02 },
  { year: 1970, pop: 3.70 },
  { year: 1980, pop: 4.43 },
  { year: 1990, pop: 5.31 },
  { year: 2000, pop: 6.09 },
  { year: 2010, pop: 6.92 },
  { year: 2020, pop: 7.80 },
  { year: 2025, pop: 8.20 },
];

// Future projection for the second chart
const populationDataWithFuture = [
  ...populationData,
  { year: 2027, pop: 8.30, evaporative: 8.30 },
  { year: 2035, pop: null, evaporative: 9.20 },
  { year: 2045, pop: null, evaporative: 10.50 },
  { year: 2055, pop: null, evaporative: 12.00 },
  { year: 2060, pop: null, evaporative: 13.00 },
];

const CustomDot = ({ cx, cy, color }) => (
  <g>
    <circle cx={cx} cy={cy} r={8} fill={color} stroke="white" strokeWidth={2} />
    <circle cx={cx} cy={cy} r={4} fill="white" />
  </g>
);

export function FertilizerChart() {
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
      <p className="text-white/40 text-xs mb-6">– Oxford Scientist</p>

      <div className="relative" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={populationData} margin={{ top: 20, right: 90, left: 0, bottom: 10 }}>
            <XAxis
              dataKey="year"
              type="number"
              domain={[1000, 2025]}
              ticks={[1000, 1200, 1400, 1600, 1800, 2000]}
              tickFormatter={(v) => `${v} AD`}
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
            />
            <YAxis hide domain={[0, 9]} />
            <Tooltip
              formatter={(v) => [`${v}B`, "Population"]}
              contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#fff" }}
              labelStyle={{ color: "rgba(255,255,255,0.6)" }}
            />
            {/* Main population curve */}
            <Line
              dataKey="pop"
              stroke="white"
              strokeWidth={2.5}
              dot={false}
              activeDot={false}
            />
            {/* Green dot at 1913 */}
            <ReferenceDot
              x={1913}
              y={1.80}
              r={7}
              fill="#22c55e"
              stroke="white"
              strokeWidth={2}
              label={null}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Annotation: 1913 */}
        <div className="absolute" style={{ left: "61%", top: "52%", transform: "translate(-100%, -50%)" }}>
          <p className="text-white font-bold text-xs italic">1913</p>
          <p className="text-white/70 text-xs italic leading-tight">Industrialization of<br />the Haber-Bosch<br />process</p>
          <svg width="40" height="30" className="mt-1">
            <path d="M 30 0 Q 35 15 38 28" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" markerEnd="url(#arrow1)" />
            <defs>
              <marker id="arrow1" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M 0 0 L 6 3 L 0 6 z" fill="rgba(255,255,255,0.5)" />
              </marker>
            </defs>
          </svg>
        </div>

        {/* Right-side bracket annotation */}
        <div className="absolute top-3 right-0 flex flex-col items-end" style={{ width: 80 }}>
          <span className="text-green-400 font-bold text-sm">8.2 billion</span>
          <span className="text-white/40 text-xs">World Population</span>
        </div>
        <div className="absolute right-4 flex flex-col items-center justify-center" style={{ top: "8%", bottom: "28%", width: 24 }}>
          <span
            className="text-green-400 text-xs font-semibold"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", letterSpacing: "0.05em" }}
          >
            Ammonia Fertilizers
          </span>
        </div>
        {/* Bracket lines */}
        <div className="absolute right-2" style={{ top: "8%", height: "60%", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div className="w-3 border-t border-r border-b border-green-500/60" style={{ height: "100%", borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />
        </div>

        {/* 6.2B label */}
        <div className="absolute right-0 text-green-400 font-bold text-xs" style={{ top: "44%", transform: "translateY(-50%)" }}>
          6.2B
        </div>
        {/* 1.8B label */}
        <div className="absolute right-0 text-white/60 font-bold text-xs" style={{ bottom: "22%" }}>
          1.8B
        </div>
      </div>
    </motion.div>
  );
}

export function SaltwaterChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.15 }}
      className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8"
    >
      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
        Saltwater Farms could feed<br />
        <span className="text-amber-400">the next 6 billion</span>
      </h3>

      <div className="relative" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={populationDataWithFuture} margin={{ top: 20, right: 90, left: 0, bottom: 10 }}>
            <XAxis
              dataKey="year"
              type="number"
              domain={[1000, 2060]}
              ticks={[1000, 1200, 1400, 1600, 1800, 2000]}
              tickFormatter={(v) => v <= 2000 ? `${v} AD` : ""}
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
            />
            <YAxis hide domain={[0, 14]} />
            <Tooltip
              formatter={(v, name) => v ? [`${v}B`, name === "pop" ? "Population" : "With Evaporative Cooling"] : [null]}
              contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#fff" }}
              labelStyle={{ color: "rgba(255,255,255,0.6)" }}
            />
            {/* Historical population curve */}
            <Line
              dataKey="pop"
              stroke="white"
              strokeWidth={2.5}
              dot={false}
              activeDot={false}
              connectNulls={false}
            />
            {/* Future evaporative cooling projection */}
            <Line
              dataKey="evaporative"
              stroke="#38bdf8"
              strokeWidth={2.5}
              strokeDasharray="0"
              dot={false}
              activeDot={false}
              connectNulls={true}
            />
            {/* Green dot at 1913 */}
            <ReferenceDot
              x={1913}
              y={1.80}
              r={7}
              fill="#22c55e"
              stroke="white"
              strokeWidth={2}
              label={null}
            />
            {/* Blue dot at 2027 */}
            <ReferenceDot
              x={2027}
              y={8.30}
              r={7}
              fill="#38bdf8"
              stroke="white"
              strokeWidth={2}
              label={null}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Annotation: 1913 */}
        <div className="absolute" style={{ left: "55%", top: "55%", transform: "translate(-100%, -50%)" }}>
          <p className="text-white font-bold text-xs italic">1913</p>
          <p className="text-white/70 text-xs italic leading-tight">Industrialization of<br />the Haber-Bosch<br />process</p>
        </div>

        {/* Annotation: 2027 */}
        <div className="absolute" style={{ right: "14%", top: "12%" }}>
          <p className="text-sky-400 font-bold text-xs italic">2027</p>
          <p className="text-white/70 text-xs italic leading-tight">Commercialization<br />of salt water<br />evaporative-cooling</p>
        </div>

        {/* Right-side labels */}
        <div className="absolute right-4 flex flex-col items-center justify-center" style={{ top: "5%", bottom: "30%", width: 24 }}>
          <span
            className="text-sky-400 text-xs font-semibold"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", letterSpacing: "0.05em" }}
          >
            Evaporative Cooling
          </span>
        </div>
        <div className="absolute right-4 flex flex-col items-center justify-center" style={{ top: "45%", bottom: "15%", width: 24 }}>
          <span
            className="text-green-400 text-xs font-semibold"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", letterSpacing: "0.05em" }}
          >
            Ammonia Fertilizers
          </span>
        </div>
      </div>
    </motion.div>
  );
}