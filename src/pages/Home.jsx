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
import { FertilizerChart, SaltwaterChart } from "../components/home/PopulationCharts";


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
        {/* 0. Water - The Next Great Leap */}
        <section className="py-24 px-6 sm:px-12 bg-black">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12">

              <h2 className="text-5xl font-bold mb-6 text-white">
                The Next Giant Leap for Mankind
              </h2>
              <p className="text-xl text-white/60 max-w-3xl mx-auto">
                Unlocking Earth's abundance—turning deserts into gardens and securing water as the foundation for feeding 10 billion people.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 items-end">
              <FertilizerChart isAdmin={isAdmin} getHomeImg={getHomeImg} setHomeImg={setHomeImg} />
              <SaltwaterChart isAdmin={isAdmin} getHomeImg={getHomeImg} setHomeImg={setHomeImg} />
            </div>
          </div>
        </section>

        {/* 1. The Solution */}
        <section className="py-24 px-6 sm:px-12 bg-black">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-10">

              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">The Breakthrough Innovation</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <h2 className="text-5xl font-bold mb-6 text-white">Saltwater Cooling Walls</h2>
              <p className="text-xl mb-0 text-white/70">
                We substitute saltwater for fresh — cooling farms with the briny, unusable water hiding beneath our feet, unleashing abundance.
              </p>
            </motion.div>

            {/* KPI Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
              { number: "90%", label: "Water Savings" },
              { number: "27°F", label: "Temperature Reduction" },
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

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-12">
              <AdminImageUpload
                src={getHomeImg("innovation_hero", "https://images.unsplash.com/photo-1586771107445-d3ca888129ce?w=1400&h=700&fit=crop")}
                alt="Saltwater Cooling Walls"
                isAdmin={isAdmin}
                onUploaded={(url) => setHomeImg("innovation_hero", url)}
                className="w-full rounded-2xl overflow-hidden"
                imgClassName="w-full h-[44.2rem] object-cover rounded-2xl" />
            </motion.div>



            {/* Why It Works */}
            <div className="text-center mt-12 mb-10">
              <h3 className="text-3xl font-bold text-white mb-3">One wall. Three ways it fights water loss.</h3>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">Plants lose water to wind, heat, and dry air. These saltwater cooling walls attack all three — simultaneously.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  key: "wind_slow",
                  title: "Slows the Wind",
                  defaultImg: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/41eb3c992_generated_image.png",
                  body: "Hot desert wind strips the layer of moisture above the fields. Slowing the wind protects this layer."
                },
                {
                  key: "wind_cool",
                  title: "Cools the Wind",
                  defaultImg: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/d10c5cc70_generated_image.png",
                  body: "As salty water evaporates through the panels, it steals heat from the air. That cooled air is denser — it sinks, smothering the field in a cool, protective layer."
                },
                {
                  key: "wind_humid",
                  title: "Humidifies the Wind",
                  defaultImg: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/e96f645e7_generated_image.png",
                  body: "The moisture doesn't vanish — it stays. Humid air clings to the field, slowing evaporation from soil and plant alike. Crops stop fighting the heat and start putting their energy into growth."
                }
              ].map((card, idx) =>
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}>
                <AdminImageUpload
                  src={getHomeImg(card.key, card.defaultImg)}
                  alt={card.title}
                  isAdmin={isAdmin}
                  onUploaded={(url) => setHomeImg(card.key, url)}
                  className="w-full rounded-xl overflow-hidden mb-5"
                  imgClassName="w-full h-60 object-cover rounded-xl" />
                <h3 className="text-xl font-bold mb-3 text-white">{card.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{card.body}</p>
              </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* 2. Water Shortages */}
        <section className="py-24 px-6 sm:px-12 bg-black">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16">

              <h2 className="text-5xl font-bold mb-6 text-white">
                A Story Written in Water
              </h2>
              <p className="text-xl text-white/60 max-w-3xl mx-auto">
                Humanity's greatest triumphs were built on water. Now, the bill is due.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  key: "shortage_1",
                  defaultImg: "https://images.unsplash.com/photo-1515339760107-1952b7a08454?w=800&h=600&fit=crop",
                  alt: "Tamed rivers",
                  title: "We Tamed Mighty Rivers",
                  body: "We dammed the Colorado, the Nile, the Yangtze. We redirected the forces of nature itself — bending rivers to our will to power cities and quench a growing world's thirst."
                },
                {
                  key: "shortage_2",
                  defaultImg: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
                  alt: "Water brought to desert",
                  title: "We Brought Water to the Desert",
                  body: "Canals stretching hundreds of miles. Aqueducts defying gravity. We moved water where nature never intended it to go — and turned wasteland into farmland."
                },
                {
                  key: "shortage_3",
                  defaultImg: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop",
                  alt: "Desert farms feeding millions",
                  title: "We Fed Millions from Desert Sand",
                  body: "Imperial Valley. The Negev. The Arabian Peninsula. Deserts bloomed. Harvests exploded. Supermarkets filled. We fed a civilization from land that was once considered dead."
                },
                {
                  key: "shortage_4",
                  defaultImg: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop",
                  alt: "Cities in the desert",
                  title: "We Built Cities Where Nothing Could Live",
                  body: "Las Vegas. Phoenix. Dubai. Cairo. Great civilizations rose in the harshest places on Earth — monuments to human ingenuity, all of it standing on a foundation of borrowed water."
                },
                {
                  key: "shortage_5",
                  defaultImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
                  alt: "Hoover Dam and drained Colorado River",
                  title: "Now the Colorado Runs Dry",
                  body: "Hoover Dam's waterline has fallen over 180 feet. The Colorado River no longer reaches the sea. Lake Mead is a ghost of itself. We spent centuries of stored water in decades."
                },
                {
                  key: "shortage_6",
                  defaultImg: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&h=600&fit=crop",
                  alt: "Water wars",
                  title: "The Water Wars Have Begun",
                  body: "States sue states. Nations threaten nations. Farmers vs. cities. Present vs. future. The fights over what's left are already here — and they will only get fiercer."
                },
                {
                  key: "shortage_7",
                  defaultImg: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop",
                  alt: "Fallowed farmland",
                  title: "Cities Buy the Farms",
                  body: "When cities can't build more supply, they buy it. Water districts and Wall Street investors purchase farmland and fallow it — permanently taking land out of production. Farmers are offered a check and told to walk away from everything their family built."
                },
                {
                  key: "shortage_8",
                  defaultImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
                  alt: "Rural town decay",
                  title: "Then the Towns Die",
                  body: "When the farms go, so does everything else. The feed stores, the equipment dealers, the packing sheds, the restaurants. As one farmer put it: \"City folk need to understand — we don't grow food because we like it as a hobby. We are your food supply.\" Without farming, rural communities collapse into poverty."
                },
                {
                  key: "shortage_9",
                  defaultImg: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800&h=600&fit=crop",
                  alt: "Salton Sea environmental collapse",
                  title: "And the Land Turns to Dust",
                  body: "Removing water doesn't just end farming — it ends ecosystems. The Salton Sea and Owens Lake are cautionary tales: once water was diverted to cities, exposed lakebeds became toxic dust bowls, triggering public health crises and environmental collapse that haunt those regions to this day."
                }
              ].map((card, idx) =>
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: (idx % 3) * 0.1 }}
                className="group">
                <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                  <AdminImageUpload
                    src={getHomeImg(card.key, card.defaultImg)}
                    alt={card.alt}
                    isAdmin={isAdmin}
                    onUploaded={(url) => setHomeImg(card.key, url)}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-amber-500/90 flex items-center justify-center text-black font-bold text-sm">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{card.title}</h3>
                <p className="text-white/60 leading-relaxed">{card.body}</p>
              </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* 3. The Problem is Agriculture */}
        <RootCauseSection isAdmin={isAdmin} getHomeImg={getHomeImg} setHomeImg={setHomeImg} />



        {/* 3. The Solution */}
        <section className="py-24 px-6 sm:px-12 bg-black">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-10">

              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">The Breakthrough Innovation</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <h2 className="text-5xl font-bold mb-6 text-white">Saltwater Cooling Walls</h2>
              <p className="text-xl mb-0 text-white/70">
                We substitute saltwater for fresh — cooling farms with the briny, unusable water hiding beneath our feet, unleashing abundance.
              </p>
            </motion.div>

            {/* KPI Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
              { number: "90%", label: "Water Savings" },
              { number: "27°F", label: "Temperature Reduction" },
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

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-12">
              <AdminImageUpload
                src={getHomeImg("innovation_hero", "https://images.unsplash.com/photo-1586771107445-d3ca888129ce?w=1400&h=700&fit=crop")}
                alt="Saltwater Cooling Walls"
                isAdmin={isAdmin}
                onUploaded={(url) => setHomeImg("innovation_hero", url)}
                className="w-full rounded-2xl overflow-hidden"
                imgClassName="w-full h-[44.2rem] object-cover rounded-2xl" />
            </motion.div>



            {/* Why It Works */}
            <div className="text-center mt-12 mb-10">
              <h3 className="text-3xl font-bold text-white mb-3">One wall. Three ways it fights water loss.</h3>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">Plants lose water to wind, heat, and dry air. These saltwater cooling walls attack all three — simultaneously.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  key: "wind_slow",
                  title: "Slows the Wind",
                  defaultImg: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/41eb3c992_generated_image.png",
                  body: "Hot desert wind strips the layer of moisture above the fields. Slowing the wind protects this layer."
                },
                {
                  key: "wind_cool",
                  title: "Cools the Wind",
                  defaultImg: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/d10c5cc70_generated_image.png",
                  body: "As salty water evaporates through the panels, it steals heat from the air. That cooled air is denser — it sinks, smothering the field in a cool, protective layer."
                },
                {
                  key: "wind_humid",
                  title: "Humidifies the Wind",
                  defaultImg: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/e96f645e7_generated_image.png",
                  body: "The moisture doesn't vanish — it stays. Humid air clings to the field, slowing evaporation from soil and plant alike. Crops stop fighting the heat and start putting their energy into growth."
                }
              ].map((card, idx) =>
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}>
                <AdminImageUpload
                  src={getHomeImg(card.key, card.defaultImg)}
                  alt={card.title}
                  isAdmin={isAdmin}
                  onUploaded={(url) => setHomeImg(card.key, url)}
                  className="w-full rounded-xl overflow-hidden mb-5"
                  imgClassName="w-full h-60 object-cover rounded-xl" />
                <h3 className="text-xl font-bold mb-3 text-white">{card.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{card.body}</p>
              </motion.div>
              )}
            </div>
          </div>
        </section>

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
              <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-6" style={{ minHeight: '400px' }}>
                <AdminImageUpload
                  src={getHomeImg("imperial_valley", "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=675&fit=crop")}
                  alt="Imperial Valley Agriculture"
                  isAdmin={isAdmin}
                  onUploaded={(url) => setHomeImg("imperial_valley", url)}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover" />
              </div>
              {/* Three image cards with flip animation */}
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { key: "iv_what_it_is", title: "What It Is", defaultImg: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop", blurb: "Imperial Valley is one of the most water-stressed yet productive farming regions in North America — a paradox held together by aging infrastructure and borrowed time." },
                  { key: "iv_what_it_will_be", title: "What It Will Be", defaultImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop", blurb: "Without intervention, the Colorado River compact collapses, water allocations are slashed, and hundreds of thousands of acres are permanently fallowed. Farms fail. Towns empty. The food supply shrinks." },
                  { key: "iv_what_we_can_make_it", title: "What We Can Make It", defaultImg: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=400&fit=crop", blurb: "A thriving, resilient agricultural region that produces more food with a fraction of the water — a model for every arid farming community in the world." },
                ].map((card) => (
                  <div key={card.key} className="h-48 group" style={{ perspective: '1000px' }}>
                    <div
                      className="relative w-full h-full transition-transform duration-500"
                      style={{ transformStyle: 'preserve-3d', transform: 'rotateY(0deg)' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'rotateY(180deg)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'rotateY(0deg)'}
                    >
                      {/* Front */}
                      <div className="absolute inset-0 rounded-xl overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                        <AdminImageUpload
                          src={getHomeImg(card.key, card.defaultImg)}
                          alt={card.title}
                          isAdmin={isAdmin}
                          onUploaded={(url) => setHomeImg(card.key, url)}
                          className="w-full h-full"
                          imgClassName="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h4 className="text-white font-bold text-base">{card.title}</h4>
                        </div>
                      </div>
                      {/* Back */}
                      <div
                        className="absolute inset-0 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col items-center justify-center p-5 text-center"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <h4 className="text-amber-400 font-bold text-base mb-3">{card.title}</h4>
                        <p className="text-white/80 text-sm leading-relaxed">{card.blurb}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pilot Project Spotlight */}
              <div className="mt-10 grid md:grid-cols-2 gap-8 items-center rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                <div className="p-8">
                  <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">Pilot Project</span>
                  <h3 className="text-2xl font-bold text-white mt-2 mb-3">UC Desert Research &amp; Extension Center</h3>
                  <p className="text-amber-400/80 text-sm mb-4">Imperial Valley, CA · United States</p>
                  <p className="text-white/70 leading-relaxed">Our Proof of Concept farm in Imperial Valley to deploy and demonstrate the feasibility of the Evaporative Cooling Wall technology in the USA — one of the hottest, driest agricultural regions on Earth.</p>
                </div>
                <div className="h-64 md:h-full min-h-[260px]">
                  <AdminImageUpload
                    src={getHomeImg("iv_pilot_project", "https://base44.app/api/apps/6993b7c68cee7955d3266d09/files/public/6993b7c68cee7955d3266d09/fa3b93fe7_darla-hueske-fqoq39Jj5us-unsplash.jpg")}
                    alt="UC Desert Research Center Pilot Farm"
                    isAdmin={isAdmin}
                    onUploaded={(url) => setHomeImg("iv_pilot_project", url)}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover" />
                </div>
              </div>
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
              <p className="text-xl leading-relaxed mb-8 text-white/70">
                From Imperial Valley to Africa to the Middle East—our technology is designed for global deployment
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {allProjects.filter(p => p.phase === "Transformation").sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).map((project, idx) =>
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  onClick={() => handleSelectProject(project)}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group h-64">

                  {project.hero_image ?
                    <img
                      src={project.hero_image}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ objectPosition: project.hero_image_position || 'center center' }} /> :
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                    <h3 className="text-white font-bold text-lg leading-tight">{project.name}</h3>
                    <p className="text-amber-400 text-sm mt-1">{project.location}</p>
                    <p className="text-white/60 text-xs mt-1 line-clamp-2">{project.description}</p>
                  </div>
                </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 6. Change the World */}
        <section className="py-32 px-6 sm:px-12 bg-black">
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