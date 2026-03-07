import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Clock } from "lucide-react";

const PHASE_COLORS = {
  "R&D":             { bar: "from-violet-500/80 to-purple-600/60",  text: "text-violet-300" },
  "Commercialization":{ bar: "from-amber-500/80 to-orange-500/60",  text: "text-amber-300" },
  "Transformation":  { bar: "from-emerald-500/80 to-teal-500/60",   text: "text-emerald-300" },
};

// Match the Timeline's statusConfig colors
const STATUS_CONFIG = {
  completed: { icon: CheckCircle2, color: "text-green-400",  bg: "bg-green-500/20",  border: "border-green-500/30",  dot: "bg-green-400",  label: "Completed" },
  active:    { icon: Clock,        color: "text-amber-400",  bg: "bg-amber-500/20",  border: "border-amber-500/30",  dot: "bg-amber-400",  label: "In Progress" },
  planned:   { icon: Circle,       color: "text-blue-400",   bg: "bg-blue-500/20",   border: "border-blue-500/30",   dot: "bg-blue-400",   label: "Planned" },
};

const COMPANY_LOGOS = {
  "E2Eden": "https://base44.app/api/apps/6993b7c68cee7955d3266d09/files/public/6993b7c68cee7955d3266d09/78e62a5b6_Brand_Yellow.png",
  "Seawater Greenhouse": "https://base44.app/api/apps/6993b7c68cee7955d3266d09/files/public/6993b7c68cee7955d3266d09/6120500fd_seawater_greenhouse_logo_white.png",
  "Global Green": "https://base44.app/api/apps/6993b7c68cee7955d3266d09/files/public/6993b7c68cee7955d3266d09/c0468d7cc_Global-Green-Logo.png",
};

export default function GanttChart({ projects, milestones }) {
  const [expandedRows, setExpandedRows] = useState({});
  const [yearRange, setYearRange] = useState([2, 5]); // [pastBuffer, futureBuffer]

  const { minYear, maxYear, years } = useMemo(() => {
    const allDates = milestones
      .filter(m => m.date)
      .map(m => new Date(m.date).getFullYear());

    const now = new Date().getFullYear();
    const min = Math.min(...allDates, now) - yearRange[0];
    const max = Math.max(...allDates, now) + yearRange[1];

    const yrs = [];
    for (let y = min; y <= max; y++) yrs.push(y);
    return { minYear: min, maxYear: max, years: yrs };
  }, [milestones]);

  const totalSpan = maxYear - minYear + 1;

  const getLeft = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const frac = (d.getFullYear() + d.getMonth() / 12 - minYear) / totalSpan;
    return Math.max(0, Math.min(100, frac * 100));
  };

  const rows = useMemo(() => {
    return projects.map(project => {
      const ms = milestones
        .filter(m => m.project_id === project.id && m.date)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      const colors = PHASE_COLORS[project.phase] || PHASE_COLORS["R&D"];
      return { project, ms, colors };
    });
  }, [projects, milestones]);

  const nowLeft = getLeft(new Date().toISOString());

  const toggleRow = (id) => setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));

  if (rows.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="mb-14 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden backdrop-blur-sm"
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-white/[0.06] flex flex-wrap items-center gap-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/30">Project Timeline</p>
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/30 whitespace-nowrap">Past: {yearRange[0]}y</span>
            <input
              type="range" min={0} max={10} step={1}
              value={yearRange[0]}
              onChange={e => setYearRange(r => [+e.target.value, r[1]])}
              className="w-20 accent-amber-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/30 whitespace-nowrap">Future: {yearRange[1]}y</span>
            <input
              type="range" min={0} max={15} step={1}
              value={yearRange[1]}
              onChange={e => setYearRange(r => [r[0], +e.target.value])}
              className="w-20 accent-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Year axis */}
      <div className="px-6 pt-4 pb-2 relative">
        <div className="flex ml-[180px] sm:ml-[220px]">
          {years.map(y => (
            <div key={y} className="flex-1 text-center">
              <span className="text-[10px] text-white/20 font-mono">{y}</span>
            </div>
          ))}
        </div>
        <div className="absolute top-0 bottom-0 left-[180px] sm:left-[220px] right-6 flex pointer-events-none">
          {years.map((y) => (
            <div key={y} className="flex-1 border-l border-white/[0.05] first:border-0" />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="px-6 pb-6 space-y-1">
        {rows.map(({ project, ms, colors }, rowIdx) => {
          const firstDate = ms[0]?.date;
          const lastDate  = ms[ms.length - 1]?.date;
          const barLeft   = firstDate ? getLeft(firstDate) : null;
          const barRight  = lastDate  ? 100 - getLeft(lastDate) : null;
          const isExpanded = !!expandedRows[project.id];
          const hasMilestones = ms.length > 0;
          const statusCfg = STATUS_CONFIG[project.status] || STATUS_CONFIG.planned;

          return (
            <div key={project.id}>
              {/* Project row */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: rowIdx * 0.06 }}
                className={`flex items-center gap-3 group rounded-xl py-1.5 px-2 -mx-2 transition-colors ${hasMilestones ? "cursor-pointer hover:bg-white/[0.03]" : ""}`}
                onClick={() => hasMilestones && toggleRow(project.id)}
              >
                {/* Label */}
                <div className="w-[180px] sm:w-[220px] flex-shrink-0 pr-3 flex items-center gap-2">
                  {/* Company logo */}
                  <div className="w-6 h-6 flex-shrink-0 rounded-full bg-black border border-white/10 overflow-hidden p-0.5">
                    <img
                      src={COMPANY_LOGOS[project.company] || COMPANY_LOGOS["E2Eden"]}
                      alt={project.company || "E2Eden"}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${statusCfg.color} group-hover:text-white transition-colors`}>
                      {project.name}
                    </p>
                    <p className={`text-[10px] truncate ${statusCfg.color} opacity-70`}>{statusCfg.label}</p>
                  </div>
                  {hasMilestones && (
                    <div className="flex-shrink-0 text-white/20">
                      {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </div>
                  )}
                </div>

                {/* Bar track */}
                <div className="relative flex-1 h-7">
                  <div className="absolute inset-0 rounded-full bg-white/[0.03] border border-white/[0.06]" />

                  {barLeft !== null && barRight !== null && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: rowIdx * 0.06 + 0.3, ease: "easeOut" }}
                      style={{ left: `${barLeft}%`, right: `${barRight}%`, transformOrigin: "left center" }}
                      className={`absolute top-1 bottom-1 rounded-full ${statusCfg.bg} border ${statusCfg.border}`}
                    />
                  )}

                  {/* Milestone dots colored by status */}
                  {ms.map((m) => {
                    const left = getLeft(m.date);
                    if (left === null) return null;
                    const msCfg = STATUS_CONFIG[m.status] || STATUS_CONFIG.planned;
                    return (
                      <div
                        key={m.id}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group/dot"
                        style={{ left: `${left}%` }}
                        title={`${m.title}${m.date ? " · " + new Date(m.date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}`}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full border-2 border-black ${msCfg.dot} ring-2 ring-transparent group-hover/dot:ring-white/20 transition-all`} />
                      </div>
                    );
                  })}

                  {nowLeft !== null && (
                    <div className="absolute top-0 bottom-0 w-px bg-amber-400/40" style={{ left: `${nowLeft}%` }} />
                  )}
                </div>
              </motion.div>

              {/* Expanded milestones */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="py-2 space-y-1.5 border-l border-white/10 ml-[44px] sm:ml-[44px] pl-3">
                      {ms.map((m) => {
                        const msCfg = STATUS_CONFIG[m.status] || STATUS_CONFIG.planned;
                        const Icon = msCfg.icon;
                        return (
                          <div key={m.id} className="flex items-start gap-2">
                            <div className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded-full ${msCfg.bg} border ${msCfg.border} flex items-center justify-center`}>
                              <Icon className={`w-2.5 h-2.5 ${msCfg.color}`} />
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-white">{m.title}</span>
                              {m.date && (
                                <span className="text-[10px] text-white/30 ml-2">
                                  {new Date(m.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                </span>
                              )}
                              {m.description && (
                                <p className="text-[10px] text-white/40 mt-0.5 leading-relaxed">{m.description}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* "Now" label */}
        {nowLeft !== null && (
          <div className="relative flex-1 ml-[180px] sm:ml-[220px]">
            <div className="absolute text-[9px] text-amber-400/60 font-mono -translate-x-1/2 mt-1" style={{ left: `${nowLeft}%` }}>
              now
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}