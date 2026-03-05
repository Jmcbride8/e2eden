import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Pause, Play, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPageUrl } from "../utils";
import GlobeScene from "../components/globe/GlobeScene";
import SeawaterGreenhouseSection from "../components/home/SeawaterGreenhouseSection";
import RootCauseSection from "../components/home/RootCauseSection";
import AdminImageUpload from "../components/home/AdminImageUpload";
import ProjectModal from "../components/globe/ProjectModal";
import { Button } from "@/components/ui/button";


export default function Home() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState("R&D");
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploadingBrand, setUploadingBrand] = useState(null);
  const scrollRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: homeContentRecords = [] } = useQuery({
    queryKey: ['homeContent'],
    queryFn: () => base44.entities.HomeContent.list()
  });

  // Build a map of key -> { id, image_url }
  const homeContentMap = React.useMemo(() => {
    const map = {};
    homeContentRecords.forEach((r) => {map[r.key] = r;});
    return map;
  }, [homeContentRecords]);

  const getHomeImg = (key, fallback) => homeContentMap[key]?.image_url || fallback;

  const setHomeImg = async (key, url) => {
    const existing = homeContentMap[key];
    if (existing) {
      await base44.entities.HomeContent.update(existing.id, { image_url: url });
    } else {
      await base44.entities.HomeContent.create({ key, image_url: url });
    }
    queryClient.invalidateQueries({ queryKey: ['homeContent'] });
  };

  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('sort_order')
  });

  const { data: partnerBrands = [] } = useQuery({
    queryKey: ['partnerBrands'],
    queryFn: () => base44.entities.PartnerBrand.list('sort_order')
  });

  useEffect(() => {
    const checkAdmin = async () => {
      const user = await base44.auth.me();
      setIsAdmin(user?.role === 'admin');
    };
    checkAdmin();
  }, []);

  const updateBrandMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PartnerBrand.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnerBrands'] });
      setUploadingBrand(null);
    }
  });

  const handleLogoUpload = async (brandId, file) => {
    setUploadingBrand(brandId);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      updateBrandMutation.mutate({ id: brandId, data: { logo_url: file_url } });
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadingBrand(null);
    }
  };

  const projects = allProjects.filter((project) =>
  project.phase === selectedPhase
  );

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
    <div className="relative w-full min-h-screen bg-black">
      {/* Globe Section */}
      <div className="relative w-full h-screen overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black" />



      {/* Subtitle */}
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-20 sm:top-28 left-6 sm:left-8 right-6 sm:right-auto z-10 max-w-md">

        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-white/90">
          Revolutionizing water,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400">
            to feed humanity, and turn deserts green
          </span>
        </h2>
        <p className="text-sm mt-2 leading-relaxed max-w-sm text-white/90">
          Pioneering technology to unlock abundance in agriculture, feed the next 7 billion humans, and make deserts bloom.
        </p>
        <div className="flex flex-wrap gap-3 mt-3 mb-0 lg:mb-0">
          <Button
              onClick={() => setSelectedPhase("R&D")}
              className={`px-6 py-3 text-sm font-semibold rounded-lg backdrop-blur-sm transition-all ${
              selectedPhase === "R&D" ?
              'bg-amber-500/30 hover:bg-amber-500/40 text-white border border-amber-500/50' :
              'bg-white/10 hover:bg-white/20 text-white/60 border border-white/20'}`
              }>

            R&D
          </Button>
          <Button
              onClick={() => setSelectedPhase("Commercialization")}
              className={`px-6 py-3 text-sm font-semibold rounded-lg backdrop-blur-sm transition-all ${
              selectedPhase === "Commercialization" ?
              'bg-amber-500/30 hover:bg-amber-500/40 text-white border border-amber-500/50' :
              'bg-white/10 hover:bg-white/20 text-white/60 border border-white/20'}`
              }>

            Commercialization
          </Button>
          <Button
              onClick={() => setSelectedPhase("Transformation")}
              className={`px-6 py-3 text-sm font-semibold rounded-lg backdrop-blur-sm transition-all ${
              selectedPhase === "Transformation" ?
              'bg-amber-500/30 hover:bg-amber-500/40 text-white border border-amber-500/50' :
              'bg-white/10 hover:bg-white/20 text-white/60 border border-white/20'}`
              }>

            Transformation
          </Button>
        </div>
      </motion.div>

      {/* Globe */}
      <div className="absolute inset-0">
        <GlobeScene
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={handleSelectProject}
            isPaused={isPaused} />

      </div>

      {/* Pause Button */}
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">

        <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPaused(!isPaused)}
            className="rounded-full transition-colors bg-white/10 hover:bg-white/20 text-white">

          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </Button>
      </motion.div>

      {/* Mobile Project List - Below Globe */}
      <div className="lg:hidden absolute bottom-36 left-0 right-0 z-20">
        <div className="px-6 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            {projects.map((project, idx) =>
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + idx * 0.05 }}
                onClick={() => handleSelectProject(project)}
                className="relative flex-shrink-0 w-36 h-24 rounded-lg overflow-hidden cursor-pointer group">

                {project.hero_image ?
                <img
                  src={project.hero_image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  style={{ objectPosition: project.hero_image_position || 'center center' }} /> :


                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
                }
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <h3 className="text-white font-semibold text-xs leading-tight drop-shadow-lg line-clamp-2">
                    {project.name}
                  </h3>
                  <p className="text-white/70 text-[10px] mt-0.5">{project.location}</p>
                </div>
              </motion.div>
              )}
          </div>
        </div>
      </div>

      {/* Project Cards - Right Side - Hidden on Mobile */}
      <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="hidden lg:flex absolute right-6 top-24 bottom-6 w-80 flex-col z-20">

        {/* Up Arrow */}
        <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollProjects('up')}
            className="mb-2 rounded-full self-center transition-colors bg-white/10 hover:bg-white/20 text-white">

          <ChevronUp className="w-5 h-5" />
        </Button>

        {/* Scrollable Container */}
        <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-3 pr-2 [&::-webkit-scrollbar]:hidden"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>

        {projects.map((project, idx) =>
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.9 + idx * 0.05 }}
              onClick={() => handleSelectProject(project)}
              className="relative h-40 rounded-xl overflow-hidden cursor-pointer group">

            {project.hero_image ?
              <img
                src={project.hero_image}
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                style={{ objectPosition: project.hero_image_position || 'center center' }} /> :


              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
              }
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-semibold text-lg leading-tight drop-shadow-lg">
                {project.name}
              </h3>
              <p className="text-white/70 text-xs mt-1">{project.location}</p>
            </div>
          </motion.div>
            )}
        </div>

        {/* Down Arrow */}
        <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollProjects('down')}
            className="mt-2 rounded-full self-center transition-colors bg-white/10 hover:bg-white/20 text-white">

          <ChevronDown className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject &&
          <ProjectModal
            project={selectedProject}
            location={selectedProject.location}
            onClose={handleClose} />

          }
      </AnimatePresence>

      {/* Bottom gradient fade */}
      <div className="hidden lg:block absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t pointer-events-none z-[5] from-black to-transparent" />
      </div>



      {/* Story Content Section */}
      <div className="relative z-10 bg-black">
        {/* 1. Water Shortages */}
        <section className="py-24 px-6 sm:px-12 bg-black">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16">

              <h2 className="text-5xl font-bold mb-6 text-white">
                Water Shortages
              </h2>
              <p className="text-xl text-white/60 max-w-3xl mx-auto">
                The global water crisis threatens food security, ecosystems, and human survival
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Sub-section 1: Depleting Resources */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="group">

                <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                  <AdminImageUpload
                    src={getHomeImg("shortage_1", "https://images.unsplash.com/photo-1515339760107-1952b7a08454?w=800&h=600&fit=crop")}
                    alt="Dried riverbed"
                    isAdmin={isAdmin}
                    onUploaded={(url) => setHomeImg("shortage_1", url)}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">
                  Depleting Resources
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Rivers are drying up and aquifers are depleting at alarming rates. By 2050, we'll need to feed 10 billion people with increasingly scarce freshwater resources.
                </p>
              </motion.div>

              {/* Sub-section 2: Climate Impact */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="group">

                <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                  <AdminImageUpload
                    src={getHomeImg("shortage_2", "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=600&fit=crop")}
                    alt="Drought-affected land"
                    isAdmin={isAdmin}
                    onUploaded={(url) => setHomeImg("shortage_2", url)}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">
                  Climate Impact
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Climate change is intensifying droughts and making water scarcity more severe every year. Traditional farming methods can no longer sustain our growing population.
                </p>
              </motion.div>

              {/* Sub-section 3: Food Security Crisis */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="group">

                <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                  <AdminImageUpload
                    src={getHomeImg("shortage_3", "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop")}
                    alt="Agricultural land"
                    isAdmin={isAdmin}
                    onUploaded={(url) => setHomeImg("shortage_3", url)}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">
                  Food Security Crisis
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Without water, there is no food. Without food, there is no future. We need revolutionary solutions now to prevent a global catastrophe.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 2. The Problem is Agriculture */}
        <RootCauseSection isAdmin={isAdmin} getHomeImg={getHomeImg} setHomeImg={setHomeImg} />

        {/* 3. The Solution */}
        <section className="py-24 px-6 sm:px-12 bg-black">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16">

              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Our Innovation</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <h2 className="text-5xl font-bold mb-6 text-white">Saltwater Cooling Walls

              </h2>
              <p className="text-xl mb-12 text-white/70">
                We've developed revolutionary technology that mimics nature's own cooling system
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">

                <h3 className="text-2xl font-bold mb-4 text-amber-400">Evaporative Cellulose Panels</h3>
                <p className="text-lg leading-relaxed text-white/70">
                  Our patented cooling walls use natural evaporation to reduce temperatures by up to 15°C, increase 
                  humidity by 50%, and save 90% of water compared to traditional irrigation.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">

                <h3 className="text-2xl font-bold mb-4 text-blue-400">Brine Utilization</h3>
                <p className="text-lg leading-relaxed text-white/70">
                  We turn waste into resource. By using brackish water and agricultural brines, we unlock water sources 
                  that were previously unusable, making deserts bloom where nothing could grow before.
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
              { number: "90%", label: "Water Savings" },
              { number: "15°C", label: "Temperature Reduction" },
              { number: "50%", label: "Humidity Increase" }].
              map((stat, idx) =>
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="p-6 rounded-xl text-center bg-white/5 border border-white/10">

                  <div className="text-5xl font-bold text-amber-400 mb-2">{stat.number}</div>
                  <div className="text-lg font-semibold text-white">{stat.label}</div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* 3b. Seawater Greenhouse Legacy */}
        <SeawaterGreenhouseSection />

        {/* 4. Getting Started - Imperial Valley */}
        <section className="py-24 px-6 sm:px-12 bg-black">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Where We Begin</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <h2 className="text-5xl font-bold mb-6 text-white">Imperial Valley, California

              </h2>
              <p className="text-xl leading-relaxed mb-8 text-white/70">
                We chose Imperial Valley as our proving ground—one of the hottest, driest places in North America, yet 
                one of the most productive agricultural regions in the world. If we can make it work here, we can make 
                it work anywhere.
              </p>
              <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-white/5 border border-white/10">
                <AdminImageUpload
                  src={getHomeImg("imperial_valley", "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=675&fit=crop")}
                  alt="Imperial Valley Agriculture"
                  isAdmin={isAdmin}
                  onUploaded={(url) => setHomeImg("imperial_valley", url)}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover" />

              </div>
              <p className="text-lg leading-relaxed text-white/70">
                Our first installations are already demonstrating dramatic water savings and improved crop yields. 
                This is just the beginning of a global transformation.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 5. Scale */}
        <section className="py-24 px-6 sm:px-12 bg-black">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center">

              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Global Vision</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <h2 className="text-5xl font-bold mb-6 text-white">Green the World, Feed the World

              </h2>
              <p className="text-xl leading-relaxed mb-12 text-white/70">
                From Imperial Valley to Africa to the Middle East—our technology is designed for global deployment
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                { region: "North America", projects: "Active", desc: "Imperial Valley, Salton Sea" },
                { region: "Africa", projects: "Expanding", desc: "Kenya, Tanzania" },
                { region: "Middle East", projects: "Planned", desc: "UAE, Saudi Arabia" }].
                map((location, idx) =>
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className="p-8 rounded-2xl bg-white/5 border border-white/10">

                    <h3 className="text-2xl font-bold mb-2 text-white">{location.region}</h3>
                    <div className="text-amber-400 font-semibold mb-2">{location.projects}</div>
                    <p className="text-sm text-white/60">{location.desc}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 6. Change the World */}
        <section className="py-32 px-6 sm:px-12 bg-gray-900">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Join the Mission</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <h2 className="text-6xl font-bold mb-8 text-white">
                Together, We Can Change the World
              </h2>
              <p className="text-2xl leading-relaxed mb-6 text-white/80">
                Feed 10 billion people. Save our water. Make deserts bloom.
              </p>
              <p className="text-xl leading-relaxed mb-12 text-white/70">
                This isn't just about technology—it's about survival. It's about creating abundance where there was 
                scarcity. It's about ensuring that no child goes hungry because we ran out of water.
              </p>
              <p className="text-2xl font-bold text-amber-400 mb-12">
                The next green revolution starts now. Join us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={createPageUrl("Partnerships")}>
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-7 text-xl font-semibold shadow-2xl shadow-amber-500/30">
                    Partner With Us
                  </Button>
                </Link>
                <Link to={createPageUrl("Funding")}>
                  <Button variant="outline" className="px-10 py-7 text-xl font-semibold bg-transparent border-white/20 text-white hover:bg-white/10">
                    Support Our Mission
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>);

}