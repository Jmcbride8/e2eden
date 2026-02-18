import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, ChevronUp, ChevronDown, Pause, Play } from "lucide-react";
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
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('sort_order'),
  });

  const handleSelectProject = useCallback((project) => {
    setSelectedProject(project);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedProject(null);
  }, []);

  const scrollProjects = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        top: direction === 'up' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`relative w-full min-h-screen transition-colors duration-700 ${isDark ? 'bg-black' : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50'}`}>
      {/* Globe Section */}
      <div className="relative w-full h-screen overflow-hidden">
      {/* Backdrop */}
      <div className={`absolute inset-0 transition-colors duration-700 ${isDark ? 'bg-black' : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50'}`} />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6 sm:p-8 pr-20 sm:pr-24">
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
              <Link to={createPageUrl("Partnerships")} className={`px-4 py-2 text-sm rounded-lg transition-all ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/50'}`}>
                Partnerships
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
      </div>

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-24 sm:top-28 left-6 sm:left-8 z-10 max-w-md"
      >
        <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight leading-tight transition-colors ${isDark ? 'text-white/90' : 'text-gray-900'}`}>
          Revolutionizing water,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400">
            to feed humanity, and save Earth
          </span>
        </h2>
        <p className={`text-sm mt-3 leading-relaxed max-w-sm transition-colors ${isDark ? 'text-white/90' : 'text-gray-700'}`}>
          Pioneering technology to unlock abundance in agriculture, feed the next 7 billion humans, and make deserts bloom.
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <Button className={`px-6 py-3 text-sm font-semibold rounded-lg ${isDark ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' : 'bg-gray-900/10 hover:bg-gray-900/20 text-gray-900 border border-gray-300'} backdrop-blur-sm`}>
            Farms
          </Button>
          <Button className={`px-6 py-3 text-sm font-semibold rounded-lg ${isDark ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' : 'bg-gray-900/10 hover:bg-gray-900/20 text-gray-900 border border-gray-300'} backdrop-blur-sm`}>
            Tunnels
          </Button>
          <Button className={`px-6 py-3 text-sm font-semibold rounded-lg ${isDark ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' : 'bg-gray-900/10 hover:bg-gray-900/20 text-gray-900 border border-gray-300'} backdrop-blur-sm`}>
            Seas
          </Button>
        </div>
      </motion.div>

      {/* Globe */}
      <div className="absolute inset-0">
        <GlobeScene
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={handleSelectProject}
          isPaused={isPaused}
        />
      </div>

      {/* Pause Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsPaused(!isPaused)}
          className={`rounded-full transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/10 hover:bg-black/20 text-black'}`}
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </Button>
      </motion.div>

      {/* Project Cards - Right Side */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute right-6 top-32 bottom-6 w-80 flex flex-col z-20"
      >
        {/* Up Arrow */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scrollProjects('up')}
          className={`mb-2 rounded-full self-center transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/10 hover:bg-black/20 text-black'}`}
        >
          <ChevronUp className="w-5 h-5" />
        </Button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-3 pr-2 [&::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
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
                style={{ objectPosition: project.hero_image_position || 'center center' }}
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
        </div>

        {/* Down Arrow */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scrollProjects('down')}
          className={`mt-2 rounded-full self-center transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/10 hover:bg-black/20 text-black'}`}
        >
          <ChevronDown className="w-5 h-5" />
        </Button>
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

      {/* Story Content Section */}
      <div className={`relative z-10 ${isDark ? 'bg-black' : 'bg-white'} transition-colors duration-700`}>
        {/* 1. Running Out of Water */}
        <section className={`py-24 px-6 sm:px-12 ${isDark ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-b from-white via-gray-50 to-white'}`}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className={`text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                We're Running Out of Water
              </h2>
              <p className={`text-xl leading-relaxed mb-8 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                By 2050, the world will need to feed 10 billion people. But there's a crisis looming: we're running out 
                of fresh water. Rivers are drying up, aquifers are depleting, and climate change is making water scarcity 
                more severe every year.
              </p>
              <p className={`text-xl leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                Without water, there is no food. Without food, there is no future. The clock is ticking, and we need 
                solutions now.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 2. The Problem is Agriculture */}
        <section className={`py-24 px-6 sm:px-12 ${isDark ? 'bg-gradient-to-b from-gray-900 to-black' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className={`text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                The Problem: Agriculture Uses 85% of Our Water
              </h2>
              <p className={`text-xl leading-relaxed mb-8 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                Agriculture consumes a staggering 85% of global freshwater resources. Traditional farming methods are 
                incredibly inefficient—most water evaporates or runs off before crops can even use it.
              </p>
              <div className={`p-8 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border border-gray-200'}`}>
                <div className="text-7xl font-bold text-amber-400 mb-4">85%</div>
                <p className={`text-2xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Of global freshwater goes to agriculture
                </p>
                <p className={`text-lg ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                  Yet billions go hungry. We can't keep farming this way.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. The Solution */}
        <section className={`py-24 px-6 sm:px-12 ${isDark ? 'bg-black' : 'bg-white'}`}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className={`text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                The Solution: Evaporative Cellulose Panels + Brines
              </h2>
              <p className={`text-xl mb-12 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                We've developed revolutionary technology that mimics nature's own cooling system
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`p-8 rounded-2xl ${isDark ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20' : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200'}`}
              >
                <h3 className="text-2xl font-bold mb-4 text-amber-400">Evaporative Cellulose Panels</h3>
                <p className={`text-lg leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                  Our patented cooling walls use natural evaporation to reduce temperatures by up to 15°C, increase 
                  humidity by 50%, and save 90% of water compared to traditional irrigation.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`p-8 rounded-2xl ${isDark ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200'}`}
              >
                <h3 className="text-2xl font-bold mb-4 text-blue-400">Brine Utilization</h3>
                <p className={`text-lg leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                  We turn waste into resource. By using brackish water and agricultural brines, we unlock water sources 
                  that were previously unusable, making deserts bloom where nothing could grow before.
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { number: "90%", label: "Water Savings" },
                { number: "15°C", label: "Temperature Reduction" },
                { number: "50%", label: "Humidity Increase" }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className={`p-6 rounded-xl text-center ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}
                >
                  <div className="text-5xl font-bold text-amber-400 mb-2">{stat.number}</div>
                  <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Getting Started - Imperial Valley */}
        <section className={`py-24 px-6 sm:px-12 ${isDark ? 'bg-gradient-to-b from-black to-gray-900' : 'bg-gradient-to-b from-white to-gray-50'}`}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className={`text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Getting Started: Imperial Valley, California
              </h2>
              <p className={`text-xl leading-relaxed mb-8 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                We chose Imperial Valley as our proving ground—one of the hottest, driest places in North America, yet 
                one of the most productive agricultural regions in the world. If we can make it work here, we can make 
                it work anywhere.
              </p>
              <div className={`aspect-video rounded-2xl overflow-hidden mb-6 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border border-gray-200'}`}>
                <img 
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=675&fit=crop"
                  alt="Imperial Valley Agriculture"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                Our first installations are already demonstrating dramatic water savings and improved crop yields. 
                This is just the beginning of a global transformation.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 5. Scale */}
        <section className={`py-24 px-6 sm:px-12 ${isDark ? 'bg-gradient-to-b from-gray-900 to-black' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h2 className={`text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Built to Scale
              </h2>
              <p className={`text-xl leading-relaxed mb-12 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                From Imperial Valley to Africa to the Middle East—our technology is designed for global deployment
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { region: "North America", projects: "Active", desc: "Imperial Valley, Salton Sea" },
                  { region: "Africa", projects: "Expanding", desc: "Kenya, Tanzania" },
                  { region: "Middle East", projects: "Planned", desc: "UAE, Saudi Arabia" }
                ].map((location, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className={`p-8 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border border-gray-200'}`}
                  >
                    <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{location.region}</h3>
                    <div className="text-amber-400 font-semibold mb-2">{location.projects}</div>
                    <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>{location.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 6. Change the World */}
        <section className={`py-32 px-6 sm:px-12 ${isDark ? 'bg-gradient-to-b from-black via-amber-950/20 to-black' : 'bg-gradient-to-b from-white via-amber-50 to-white'}`}>
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className={`text-6xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Together, We Can Change the World
              </h2>
              <p className={`text-2xl leading-relaxed mb-6 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                Feed 10 billion people. Save our water. Make deserts bloom.
              </p>
              <p className={`text-xl leading-relaxed mb-12 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                This isn't just about technology—it's about survival. It's about creating abundance where there was 
                scarcity. It's about ensuring that no child goes hungry because we ran out of water.
              </p>
              <p className={`text-2xl font-bold text-amber-400 mb-12`}>
                The next green revolution starts now. Join us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={createPageUrl("Partnerships")}>
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-7 text-xl font-semibold shadow-2xl shadow-amber-500/30">
                    Partner With Us
                  </Button>
                </Link>
                <Link to={createPageUrl("Funding")}>
                  <Button variant="outline" className={`px-10 py-7 text-xl font-semibold ${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-900 hover:bg-gray-100'}`}>
                    Support Our Mission
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}