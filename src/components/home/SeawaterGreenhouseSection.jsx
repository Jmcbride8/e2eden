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

  const projects = allProjects.filter(p => p.company === "Seawater Greenhouse");

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
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <p className="text-xl text-white/70 leading-relaxed">
              E2Eden is built on over 30 years of proven science and real-world deployments by our partner{" "}
              <a
                href="https://www.seawatergreenhouse.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 underline underline-offset-4 inline-flex items-center gap-1"
              >
                Seawater Greenhouse Ltd <ExternalLink className="w-4 h-4" />
              </a>
              . This technology has already transformed deserts across four continents.
            </p>
            <p className="text-xl text-white/70 leading-relaxed">
              We are not starting from scratch — we are adapting what works for the United States market and scaling it to a level never attempted before. These greenhouses have been built. They grow food. Now we bring them home.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-10">
            {[
              { number: "30+", label: "Years of R&D" },
              { number: "5", label: "Continents Deployed" },
              { number: "1st", label: "Time in the USA" },
            ].map((stat, idx) => (
              <div key={idx} className="p-6 rounded-xl text-center bg-white/5 border border-white/10">
                <div className="text-4xl font-bold text-amber-400 mb-1">{stat.number}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
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
            {PAST_PROJECTS.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="flex-shrink-0 w-72 rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 rounded-md text-xs font-semibold bg-amber-500/30 text-amber-300 border border-amber-500/30">
                      {project.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 text-white/50 text-xs font-mono">
                    {project.year}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-white font-bold text-lg mb-2">{project.name}</h3>
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