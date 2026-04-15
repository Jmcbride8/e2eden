import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Tag } from "lucide-react";
import { createPageUrl } from "../utils";

export default function ProjectDetails() {
  const { id } = useParams();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => base44.entities.Project.filter({ id }),
    select: (data) => data?.[0],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/60">
        Project not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div className="relative h-[60vh] overflow-hidden">
        {project.hero_image ? (
          <img
            src={project.hero_image}
            alt={project.name}
            className="w-full h-full object-cover"
            style={{ objectPosition: project.hero_image_position || "center center" }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-6 z-10">
          <Link
            to={createPageUrl("Home")}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap gap-3 mb-4">
              {project.phase && (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-semibold uppercase tracking-widest">
                  {project.phase}
                </span>
              )}
              {project.company && (
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/70 text-xs font-semibold">
                  {project.company}
                </span>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">{project.name}</h1>
            <div className="flex flex-wrap gap-4 text-white/60 text-sm">
              {project.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {project.location}, {project.country}
                </span>
              )}
              {project.year && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {project.year}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 sm:px-12 py-16 space-y-20">

        {/* Overview */}
        {project.description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl text-white/70 leading-relaxed border-l-4 border-amber-500/50 pl-6"
          >
            {project.description}
          </motion.p>
        )}

        {/* 1. History / Backstory */}
        {project.backstory && (
          <Section index={1} label="History" title="How It Began">
            <p className="text-white/70 leading-relaxed text-lg">{project.backstory}</p>
          </Section>
        )}

        {/* 2. Challenge */}
        {project.details && (
          <Section index={2} label="Challenge" title="The Challenge">
            <p className="text-white/70 leading-relaxed text-lg">{project.details}</p>
          </Section>
        )}

        {/* 3. How We Solve */}
        {project.our_solution && (
          <Section index={3} label="How We Solve It" title="Our Solution">
            <p className="text-white/70 leading-relaxed text-lg">{project.our_solution}</p>
          </Section>
        )}

        {/* Updates */}
        {project.project_updates && (
          <Section index={4} label="Updates" title="Project Updates">
            <p className="text-white/70 leading-relaxed text-lg">{project.project_updates}</p>
          </Section>
        )}

        {/* Image Gallery */}
        {project.images?.length > 0 && (
          <div>
            <SectionHeader index={5} label="Gallery" title="Gallery" />
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              {project.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${project.name} ${i + 1}`}
                  className="w-full h-56 object-cover rounded-xl"
                />
              ))}
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="pt-8 border-t border-white/10 grid sm:grid-cols-2 gap-6 text-sm text-white/50">
          {project.funding && (
            <div>
              <p className="text-white/30 uppercase tracking-widest text-xs mb-1">Funding</p>
              <p className="text-white/70">{project.funding}</p>
            </div>
          )}
          {project.partners && (
            <div>
              <p className="text-white/30 uppercase tracking-widest text-xs mb-1">Partners</p>
              <p className="text-white/70">{project.partners}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ label, title }) {
  return (
    <div className="mb-6">
      <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">{label}</span>
      <h2 className="text-3xl font-bold text-white mt-1">{title}</h2>
    </div>
  );
}

function Section({ label, title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <SectionHeader label={label} title={title} />
      {children}
    </motion.div>
  );
}