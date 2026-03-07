import React, { useMemo } from "react";
import { motion } from "framer-motion";

const PHASE_COLORS = {
  "R&D":             { bar: "from-violet-500/80 to-purple-600/60",  dot: "bg-violet-400",  text: "text-violet-300" },
  "Commercialization":{ bar: "from-amber-500/80 to-orange-500/60",  dot: "bg-amber-400",   text: "text-amber-300" },
  "Transformation":  { bar: "from-emerald-500/80 to-teal-500/60",   dot: "bg-emerald-400", text: "text-emerald-300" },
};

const STATUS_OPACITY = {
  completed: "opacity-100",
  active:    "opacity-80",
  planned:   "opacity-40",
};

export default function GanttChart({ projects, milestones }) {
  // Collect all milestone dates to determine the time range
  const { minYear, maxYear, years } = useMemo(() => {
    const allDates = milestones
      .filter(m => m.date)
      .map(m => new Date(m.date).getFullYear());

    const now = new Date().getFullYear();
    const min = Math.min(...allDates, now - 1);
    const max = Math.max(...allDates, now + 2);

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

  // Group milestones by project, compute bar start/end
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

  if (rows.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="mb-14 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden backdrop-blur-sm"
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-3 border-b border-white/[0.06]">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/30">Project Timeline</p>
      </div>

      {/* Year axis */}
      <div className="px-6 pt-4 pb-2 relative">
        <div className="flex ml-[140px] sm:ml-[180px]">
          {years.map(y => (
            <div key={y} className="flex-1 text-center">
              <span className="text-[10px] text-white/20 font-mono">{y}</span>
            </div>
          ))}
        </div>

        {/* Grid lines */}
        <div className="absolute top-0 bottom-0 left-[140px] sm:left-[180px] right-6 flex pointer-events-none">
          {years.map((y, i) => (
            <div key={y} className="flex-1 border-l border-white/[0.05] first:border-0" />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="px-6 pb-6 space-y-3">
        {rows.map(({ project, ms, colors }, rowIdx) => {
          const firstDate = ms[0]?.date;
          const lastDate  = ms[ms.length - 1]?.date;
          const barLeft   = firstDate ? getLeft(firstDate) : null;
          const barRight  = lastDate  ? 100 - getLeft(lastDate) : null;

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: rowIdx * 0.06 }}
              className="flex items-center gap-3 group"
            >
              {/* Project label */}
              <div className="w-[140px] sm:w-[180px] flex-shrink-0 pr-3">
                <p className={`text-xs font-semibold truncate ${colors.text} group-hover:text-white transition-colors`}>
                  {project.name}
                </p>
                <p className="text-[10px] text-white/20 truncate">{project.phase}</p>
              </div>

              {/* Bar track */}
              <div className="relative flex-1 h-7">
                {/* Background track */}
                <div className="absolute inset-0 rounded-full bg-white/[0.03] border border-white/[0.06]" />

                {/* Filled bar */}
                {barLeft !== null && barRight !== null && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: rowIdx * 0.06 + 0.3, ease: "easeOut" }}
                    style={{
                      left: `${barLeft}%`,
                      right: `${barRight}%`,
                      transformOrigin: "left center",
                    }}
                    className={`absolute top-1 bottom-1 rounded-full bg-gradient-to-r ${colors.bar}`}
                  />
                )}

                {/* Milestone dots */}
                {ms.map((m, i) => {
                  const left = getLeft(m.date);
                  if (left === null) return null;
                  const opacity = STATUS_OPACITY[m.status] || "opacity-40";
                  return (
                    <div
                      key={m.id}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group/dot"
                      style={{ left: `${left}%` }}
                      title={`${m.title}${m.date ? " · " + new Date(m.date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full border-2 border-black ${colors.dot} ${opacity} ring-2 ring-transparent group-hover/dot:ring-white/20 transition-all`} />
                    </div>
                  );
                })}

                {/* "Now" line */}
                {nowLeft !== null && (
                  <div
                    className="absolute top-0 bottom-0 w-px bg-amber-400/40"
                    style={{ left: `${nowLeft}%` }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}

        {/* "Now" label at bottom */}
        {nowLeft !== null && (
          <div className="relative flex-1 ml-[140px] sm:ml-[180px]">
            <div
              className="absolute text-[9px] text-amber-400/60 font-mono -translate-x-1/2 mt-1"
              style={{ left: `${nowLeft}%` }}
            >
              now
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}