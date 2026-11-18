import React from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import SaltonSeaInfrastructure from "@/components/roadmap/SaltonSeaInfrastructure";
import GlobalTransformation from "@/components/roadmap/GlobalTransformation";

// ─── Static narrative chapters ───────────────────────────────────────────────
const chapters = [
  {
    id: "legacy",
    act: "ACT I",
    label: "The Technology Is Proven",
    title: "Decades of Seawater Greenhouse Innovation",
    description:
      "Decades of Seawater Greenhouse projects show that saline water can cool protected crops in dry climates. E2Eden is building on that work to ask a different question: how much net freshwater can the same principle save in open or semi-open fields?",
    projects: "seawater_greenhouse",
  },
  {
    id: "poc",
    act: "ACT II · PHASE 1",
    label: "The US Insight",
    title: "Grant-Supported Proof of Concept",
    description:
      "E2Eden is pursuing grant support for a small, instrumented field test. The first site is not fixed. The goal is to measure cooling reach, check salt and brine handling, and identify which configurations merit a larger crop trial. Open-field water savings have not yet been established.",
    phase: "R&D",
  },
  {
    id: "scale",
    act: "ACT II · PHASE 2",
    label: "At-Scale Deployment",
    title: "UC Desert Research & Extension Center",
    description:
      "The proposed second-site pilot at UC Desert Research & Extension Center in Holtville would compare cooled and untreated plots and independently measure net freshwater savings, crop performance and costs. E2Eden would bring those results to the Imperial Irrigation District and other water managers to seek conservation incentive eligibility. No rebate or payment is assumed.",
    phase: "US Commercialization",
  },
  {
    id: "regional",
    act: "ACT II · PHASE 3",
    label: "Regional Transformation",
    title: "Commercial Deployment Across the Southwest",
    description:
      "Commercial deployment would start with heat-sensitive specialty crops, where a longer growing window, better quality or an additional harvest could justify the investment. Larger-acreage field crops come later, once the model works commercially and a conservation payment mechanism is in place. Any benefits for the Salton Sea would require separate hydrological and environmental study.",
    phase: "Salton Sea Transformation",
  },
];

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project }) {
  const isCompleted = project.status === "completed";
  const isActive = project.status === "active";

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border/[0.15] bg-muted/5">
      {project.hero_image && (
        <img
          src={project.hero_image}
          alt={project.name}
          className="aspect-[16/10] w-full object-cover"
          style={{ objectPosition: project.hero_image_position || "center center" }}
        />
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-secondary/60">
          {isCompleted ? "COMPLETED" : isActive ? "IN PROGRESS" : "PLANNED"}
          {project.year && ` · ${project.year}`}
        </p>
        <h3 className="mb-2 text-lg font-semibold leading-snug text-background">{project.name}</h3>
        {project.location && (
          <div className="mb-3 flex items-center gap-1.5 text-secondary/60">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="text-xs">{project.location}</span>
          </div>
        )}
        {project.description && (
          <p className="text-sm leading-relaxed text-secondary/75">{project.description}</p>
        )}
      </div>
    </article>
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
    <section aria-labelledby={`roadmap-${chapter.id}`}>
      <header className="mb-7 max-w-3xl sm:mb-9">
        <p className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs">
          <span className="font-semibold tracking-[0.16em] text-secondary/[0.85]">{chapter.act}</span>
          <span className="text-secondary/60">{chapter.label}</span>
        </p>
        <h2 id={`roadmap-${chapter.id}`} className="mb-3 text-2xl font-semibold leading-tight tracking-tight text-background sm:text-4xl">
          {chapter.title}
        </h2>
        <p className="max-w-[68ch] text-base leading-relaxed text-secondary/75">{chapter.description}</p>
      </header>

      {/* Projects Grid */}
      {chapterProjects.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {chapterProjects
            .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999) || (a.year || "").localeCompare(b.year || ""))
            .map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
        </div>
      )}
      {chapter.id === "regional" && <SaltonSeaInfrastructure />}
    </section>
  );
}

// ─── Chapter Transition ──────────────────────────────────────────────────────────
function Connector({ label }) {
  return (
    <div className="flex items-center gap-4 py-10 sm:py-14">
      <span className="shrink-0 text-xs text-secondary/60">{label}</span>
      <div className="h-px flex-1 bg-border/20" aria-hidden="true" />
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
    <div className="min-h-screen bg-foreground">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 sm:px-8 sm:pt-40">

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10 border-b border-border/20 pb-8 sm:mb-12 sm:pb-12"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">The Story So Far</p>
          <h1 className="mb-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-background sm:text-6xl">
            From Desert Labs to the Colorado River
          </h1>
          <p className="max-w-[62ch] text-base leading-relaxed text-secondary/75 sm:text-lg">
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
          <Connector label="From farms to global basins" />
          <GlobalTransformation />
        </div>

      </div>
    </div>
  );
}