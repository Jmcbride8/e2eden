import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { CheckCircle2, Loader2, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

export default function PhaseCarousel({ phase, projects }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const selected = emblaApi.selectedScrollSnap();
      setCurrentIndex(selected);
      setPrevBtnDisabled(!emblaApi.canScrollPrev());
      setNextBtnDisabled(!emblaApi.canScrollNext());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const phaseDescriptions = {
    "US Commercialization": "Scale farming operations across the Southwest to demonstrate economic viability and establish our production blueprint.",
    "Salton Sea Transformation": "Deploy integrated farm + tunnel infrastructure to import water at scale, transform the region's microclimate, and revitalize the Salton Sea basin.",
    "Global Deployment": "Roll out proven farm and tunnel technologies worldwide to address water scarcity and create sustainable agricultural zones globally.",
    "R&D": "Validate core technologies and configure solutions for US context deployment.",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold text-white mb-3 pb-3 border-b-2 border-white/20">
        {phase.toUpperCase()}
      </h2>
      {phaseDescriptions[phase] && (
        <p className="text-white/70 text-sm mb-6 italic">{phaseDescriptions[phase]}</p>
      )}

      <div className="relative">
        {/* Carousel Container */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {projects.map((project, idx) => {
              const isCompleted = project.status === "completed";
              const isInProgress = project.status === "active";
              const milestoneCount = project.project_updates ? project.project_updates.split(",").length : 8;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] min-w-0"
                >
                  <div className="border-2 border-white/20 rounded-xl p-6 bg-white/5 hover:shadow-lg hover:shadow-amber-400/10 transition-shadow h-full flex flex-col">
                    {/* Image */}
                    {project.hero_image && (
                      <img
                        src={project.hero_image}
                        alt={project.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}

                    {/* Status Badge */}
                    <div className="mb-3">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-bold rounded ${
                          isCompleted
                            ? "bg-white/20 text-white"
                            : isInProgress
                            ? "bg-amber-400/20 text-amber-400"
                            : "bg-white/10 text-white/70"
                        }`}
                      >
                        {isCompleted
                          ? `COMPLETED ${project.year}`
                          : isInProgress
                          ? `IN PROGRESS ${project.year}`
                          : `PLANNED ${project.year}`}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{project.name}</h3>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-white/60 mb-4">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{project.location}</span>
                    </div>

                    {/* Milestones */}
                    <div className="text-sm text-white/70 mb-4">
                      {milestoneCount} milestones
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-auto">
                      <div className="w-full bg-white/10 rounded-full h-2 mb-1">
                        <div
                          className="bg-amber-400 h-2 rounded-full"
                          style={{ width: isCompleted ? "100%" : isInProgress ? "75%" : "0%" }}
                        />
                      </div>
                      <div className="text-right text-xs text-white/50">
                        {isCompleted ? "8/8" : isInProgress ? "6/8" : "0/8"}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={scrollPrev}
          disabled={prevBtnDisabled}
          className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-amber-400/20 text-amber-400 hover:bg-amber-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={scrollNext}
          disabled={nextBtnDisabled}
          className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-amber-400/20 text-amber-400 hover:bg-amber-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {projects.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? "w-8 bg-amber-400" : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}