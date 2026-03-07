import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function SeawaterGreenhouseSection() {
  const scrollRef = useRef(null);

  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('sort_order'),
  });

  const projects = allProjects
    .filter(p => p.company === "Seawater Greenhouse")
    .sort((a, b) => (a.year || 0) - (b.year || 0));

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 px-6 sm:px-12 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Built on Decades of Proof</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <h2 className="text-5xl font-bold text-white mb-6">
            Standing on the Shoulders of Giants
          </h2>
          <p className="text-xl text-white/70 leading-relaxed w-full">
            Built on 30+ years of proven science by our partner{" "}
            <a
              href="https://www.seawatergreenhouse.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 underline underline-offset-4 inline-flex items-center gap-1"
            >
              Seawater Greenhouse Ltd <ExternalLink className="w-4 h-4" />
            </a>
            , this technology has transformed deserts across three continents. We're not starting from scratch — we're bringing what works to the United States at a scale never attempted before.
          </p>


        </motion.div>

        {/* Scrollable Cards */}
        <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            {projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="flex-shrink-0 w-72 rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  {project.hero_image ? (
                    <img
                      src={project.hero_image}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      style={{ objectPosition: project.hero_image_position || 'center center' }}
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {project.phase && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 rounded-md text-xs font-semibold bg-amber-500/30 text-amber-300 border border-amber-500/30">
                        {project.phase}
                      </span>
                    </div>
                  )}
                  {project.year && (
                    <div className="absolute bottom-3 right-3 text-white/50 text-xs font-mono">
                      {project.year}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/fba830cbc_seawater_greenhouse_logo_white.png"
                    alt="Seawater Greenhouse"
                    className="h-5 object-contain opacity-60 mb-3"
                  />
                  <h3 className="text-white font-bold text-lg mb-1">{project.name}</h3>
                  <p className="text-white/40 text-xs mb-2">{project.location}{project.country ? `, ${project.country}` : ''}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{project.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}