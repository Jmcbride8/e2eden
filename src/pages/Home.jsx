import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { createPageUrl } from "../utils";
import GlobeScene from "../components/globe/GlobeScene";
import ProjectModal from "../components/globe/ProjectModal";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDark, setIsDark] = useState(true);

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
  });

  const handleSelectProject = useCallback((project) => {
    setSelectedProject(project);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return (
    <div className={`relative w-full h-screen overflow-hidden transition-colors duration-700 ${isDark ? 'bg-black' : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50'}`}>
      {/* Backdrop */}
      <div className={`absolute inset-0 transition-colors duration-700 ${isDark ? 'bg-black' : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50'}`} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-0 left-0 right-0 z-10 p-6 sm:p-8 pr-20 sm:pr-24"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/38ce93810_Brand_Icon_White.png"
              alt="E2Eden"
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className={`text-lg font-bold tracking-tight transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>E2Eden</h1>
              <p className={`text-xs transition-colors ${isDark ? 'text-white/30' : 'text-gray-500'}`}>The Next Green Revolution</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <nav className="hidden sm:flex items-center gap-1">
              <Link to={createPageUrl("Technology")} className={`px-4 py-2 text-sm rounded-lg transition-all ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/50'}`}>
                Technology
              </Link>
              <Link to={createPageUrl("Roadmap")} className={`px-4 py-2 text-sm rounded-lg transition-all ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/50'}`}>
                Roadmap
              </Link>
              <Link to={createPageUrl("Funding")} className={`px-4 py-2 text-sm rounded-lg transition-all ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/50'}`}>
                Funding
              </Link>
            </nav>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDark(!isDark)}
              className={`rounded-full transition-colors ${isDark ? 'text-amber-400 hover:bg-white/10' : 'text-blue-600 hover:bg-gray-200/50'}`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-24 sm:top-28 left-6 sm:left-8 z-10 max-w-md"
      >
        <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight leading-tight transition-colors ${isDark ? 'text-white/90' : 'text-gray-900'}`}>
          Cultivating tomorrow,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
            sustaining today
          </span>
        </h2>
        <p className={`text-sm mt-3 leading-relaxed max-w-sm transition-colors ${isDark ? 'text-white/90' : 'text-gray-700'}`}>
          Pioneering sustainable engineering and regenerative agriculture across six continents, transforming communities through innovation.
        </p>
      </motion.div>

      {/* Globe */}
      <div className="absolute inset-0">
        <GlobeScene
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={handleSelectProject}
        />
      </div>

      {/* Project Cards - Right Side */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute right-6 top-32 bottom-6 w-80 overflow-y-auto z-20 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
      >
        {projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 + idx * 0.05 }}
            onClick={() => handleSelectProject(project)}
            className="relative h-40 rounded-xl overflow-hidden cursor-pointer group"
          >
            {project.hero_image ? (
              <img 
                src={project.hero_image}
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-semibold text-lg leading-tight drop-shadow-lg">
                {project.name}
              </h3>
              <p className="text-white/70 text-xs mt-1">{project.location}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            location={selectedProject.location}
            onClose={handleClose} 
          />
        )}
      </AnimatePresence>

      {/* Bottom gradient fade */}
      <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t pointer-events-none z-[5] transition-colors duration-700 ${isDark ? 'from-black to-transparent' : 'from-blue-50 to-transparent'}`} />
    </div>
  );
}