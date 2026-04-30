import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";

export default function VisionaryCarousel({ projects }) {
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

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] min-w-0"
            >
              <div className="border-2 border-white/20 rounded-xl p-6 bg-white/5 hover:shadow-lg hover:shadow-purple-400/10 transition-shadow h-full flex flex-col">
                {/* Image */}
                {project.hero_image && (
                  <img
                    src={project.hero_image}
                    alt={project.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{project.name}</h3>

                {/* Location */}
                <div className="flex items-center gap-1 text-white/60 mb-4">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{project.location}</span>
                </div>

                {/* Year */}
                <div className="mt-auto">
                  <p className="text-sm text-white/70">{project.year || "Date TBD"}</p>
                </div>
              </div>
            </motion.div>
          ))}
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
  );
}