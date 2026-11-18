import React from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { MapPin, ArrowDown } from "lucide-react";
import LegacyCarousel from "@/components/roadmap/LegacyCarousel";

// ─── Static narrative chapters ───────────────────────────────────────────────
const chapters = [
  {
    id: "legacy",
    act: "ACT I",
    label: "The Technology Is Proven",
    title: "Decades of Seawater Greenhouse Innovation",
    color: "blue",
    borderClass: "border-blue-400/40",
    bgClass: "bg-blue-900/15",
    accentClass: "text-blue-300",
    badgeClass: "bg-blue-400/20 text-blue-300 border border-blue-400/30",
    description:
      "Decades of Seawater Greenhouse projects show that saline water can cool protected crops in dry climates. E2Eden is building on that work to ask a different question: how much net freshwater can the same principle save in open or semi-open fields?",
    projects: "seawater_greenhouse",
  },
  {
    id: "poc",
    act: "ACT II · PHASE 1",
    label: "The US Insight",
    title: "Grant-Supported Proof of Concept",
    color: "amber",
    borderClass: "border-amber-400/40",
    bgClass: "bg-amber-900/10",
    accentClass: "text-amber-400",
    badgeClass: "bg-amber-400/20 text-amber-400 border border-amber-400/30",
    description:
      "E2Eden is pursuing grant support for a small, instrumented field test. The first site is not fixed. The goal is to measure cooling reach, check salt and brine handling, and identify which configurations merit a larger crop trial. Open-field water savings have not yet been established.",
    phase: "R&D",
  },
  {
    id: "scale",
    act: "ACT II · PHASE 2",
    label: "At-Scale Deployment",
    title: "UC Desert Research & Extension Center",
    color: "amber",
    borderClass: "border-amber-400/40",
    bgClass: "bg-amber-900/10",
    accentClass: "text-amber-400",
    badgeClass: "bg-amber-400/20 text-amber-400 border border-amber-400/30",
    description:
      "The proposed second-site pilot at UC Desert Research & Extension Center in Holtville would compare cooled and untreated plots and independently measure net freshwater savings, crop performance and costs. E2Eden would bring those results to the Imperial Irrigation District and other water managers to seek conservation incentive eligibility. No rebate or payment is assumed.",
    phase: "US Commercialization",
  },
  {
    id: "regional",
    act: "ACT II · PHASE 3",
    label: "Regional Transformation",
    title: "Commercial Deployment Across the Southwest",
    color: "amber",
    borderClass: "border-amber-400/40",
    bgClass: "bg-amber-900/10",
    accentClass: "text-amber-400",
    badgeClass: "bg-amber-400/20 text-amber-400 border border-amber-400/30",
    description:
      "Commercial deployment would start with heat-sensitive specialty crops, where a longer growing window, better quality or an additional harvest could justify the investment. Larger-acreage field crops come later, once the model works commercially and a conservation payment mechanism is in place. Any benefits for the Salton Sea would require separate hydrological and environmental study.",
    phase: "Salton Sea Transformation",
  },
];

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, accentClass }) {
  const isCompleted = project.status === "completed";
  const isActive = project.status === "active";

  return (
    <div className="border border-white/15 rounded-xl overflow-hidden bg-white/5 hover:bg-white/8 transition-all flex flex-col">
      {project.hero_image && (
        <img
          src={project.hero_image}
          alt={project.name}
          className="w-full h-44 object-cover"
          style={{ objectPosition: project.hero_image_position || "center center" }}
        />
      )}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <span
            className={`inline-block px-2 py-0.5 text-[11px] font-bold rounded ${
              isCompleted
                ? "bg-white/15 text-white/70"
                : isActive
                ? "bg-amber-400/20 text-amber-400"
                : "bg-white/8 text-white/50"
            }`}
          >
            {isCompleted ? `COMPLETED ${project.year || ""}` : isActive ? `IN PROGRESS ${project.year || ""}` : `PLANNED ${project.year || ""}`}
          </span>
        </div>
        <h3 className="text-base font-bold text-white mb-2 leading-snug">{project.name}</h3>
        {project.location && (
          <div className="flex items-center gap-1 text-white/50 mb-3">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs">{project.location}</span>
          </div>
        )}
        {project.description && (
          <p className="text-white/60 text-xs leading-relaxed line-clamp-3">{project.description}</p>
        )}
      </div>
    </div>
  );
}

// ─── Chapter Section ──────────────────────────────────────────────────────────
function ChapterSection({ chapter, projects }) {
  const chapterProjects = chapter.projects === "seawater_greenhouse"
    ? projects.filter((p) => p.company === "Seawater Greenhouse")
    : projects.filter(
        (p) =>
          (p.company === "E2Eden" || !p.company) &&
          p.phase === chapter.phase &&
          p.category !== "Visionary"
      );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
      className={`rounded-2xl border-2 ${chapter.borderClass} ${chapter.bgClass} p-8 sm:p-10`}
    >
      {/* Act label */}
      <div className="mb-4">
        <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${chapter.badgeClass}`}>
          {chapter.act}
        </span>
      </div>

      {/* Eyebrow */}
      <p className={`text-sm font-semibold uppercase tracking-widest mb-2 ${chapter.accentClass}`}>
        {chapter.label}
      </p>

      {/* Title */}
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight">{chapter.title}</h2>

      {/* Description */}
      <p className="text-white/70 text-base leading-relaxed max-w-3xl mb-8">{chapter.description}</p>

      {/* Projects Grid */}
      {chapterProjects.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {chapterProjects
            .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999) || (a.year || "").localeCompare(b.year || ""))
            .map((project) => (
              <ProjectCard key={project.id} project={project} accentClass={chapter.accentClass} />
            ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Connector Arrow ──────────────────────────────────────────────────────────
function Connector({ label }) {
  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <div className="w-px h-8 bg-white/20" />
      {label && (
        <span className="text-xs text-white/40 uppercase tracking-widest font-medium px-3 py-1 border border-white/10 rounded-full">
          {label}
        </span>
      )}
      <ArrowDown className="w-5 h-5 text-white/30" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Roadmap() {
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => base44.entities.Project.list("sort_order"),
  });

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24 sm:px-8">

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-4">The Story So Far</p>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            From Desert Labs<br />to the Colorado River
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            A proven technology. A new context. A profound outcome. Here's how we get from thirty years of global innovation to freeing up the water that powers the American Southwest.
          </p>
        </motion.div>

        {/* Narrative Chapters */}
        <div className="space-y-0">
          {chapters.map((chapter, idx) => (
            <div key={chapter.id}>
              <ChapterSection chapter={chapter} projects={projects} />
              {idx < chapters.length - 1 && (
                <Connector
                  label={idx === 0 ? "E2Eden reconfigures for the US" : idx === 1 ? "Validated → Scale" : idx === 2 ? "Blueprint → Region" : null}
                />
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}