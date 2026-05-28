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
      "This isn't a bet on an unproven idea. For over three decades, Seawater Greenhouse has designed, built, and operated evaporative cooling and integrated saltwater farming systems across some of the world's harshest deserts — Oman, Tenerife, Abu Dhabi, Somaliland, Australia. The science is solid. The results are documented. The technology works.",
    projects: "seawater_greenhouse",
  },
  {
    id: "poc",
    act: "ACT II · PHASE 1",
    label: "The US Insight",
    title: "Reconceptualizing the Idea for America",
    color: "amber",
    borderClass: "border-amber-400/40",
    bgClass: "bg-amber-900/10",
    accentClass: "text-amber-400",
    badgeClass: "bg-amber-400/20 text-amber-400 border border-amber-400/30",
    description:
      "Seawater Greenhouse was built to grow food in food-scarce regions. But the US Southwest — Imperial Valley, the Salton Sea basin — already grows food extraordinarily well. What it is catastrophically short of is water. E2Eden had the key insight: flip the value proposition. The same low-tech cooling wall technology can be deployed purely to crush freshwater consumption by 70–90%, freeing up vast quantities of Colorado River water. No high-tech. No desalination. Just physics — and profound impact. The first step: prove it works here.",
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
      "With a validated proof of concept, E2Eden deploys at the UC Desert Research & Extension Center in Imperial Valley — one of the most productive yet water-stressed agricultural regions in North America. This is where the model gets pressure-tested at commercial scale: real farms, real growers, real water savings. The goal is a repeatable blueprint that any farmer in the Southwest can adopt.",
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
      "Once the blueprint is proven, E2Eden scales across the Salton Sea basin and the broader Southwest. Thousands of acres of farmland adopt the cooling wall system. Tens of thousands of acre-feet of Colorado River water are freed up annually. The Salton Sea — a dying, toxic body of water — begins its recovery as the inflow-outflow balance shifts. A low-tech solution delivers a high-stakes outcome.",
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