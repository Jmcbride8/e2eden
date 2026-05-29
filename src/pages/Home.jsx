import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Pause, Play, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPageUrl } from "../utils";
import GlobeScene from "../components/globe/GlobeScene";

import RootCauseSection from "../components/home/RootCauseSection";
import AdminImageUpload from "../components/home/AdminImageUpload";
import { Button } from "@/components/ui/button";
import { FertilizerChart, SaltwaterChart } from "../components/home/PopulationCharts";


export default function Home() {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState("Saltwater Farms");
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

  const getHomeImg = (key) => homeContentMap[key]?.image_url || null;

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
    selectedPhase === "Seawater Greenhouse"
      ? project.company === "Seawater Greenhouse"
      : project.company === "E2Eden" || !project.company
  );

  const handleSelectProject = useCallback((project) => {
    navigate(`/project/${project.id}`);
  }, [navigate]);

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
        <div className="mt-3 mb-0 lg:mb-0">
          <div className="flex flex-wrap gap-3">
            <Button
                onClick={() => setSelectedPhase("Seawater Greenhouse")}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg backdrop-blur-sm transition-all ${
                selectedPhase === "Seawater Greenhouse" ?
                'bg-amber-500/30 hover:bg-amber-500/40 text-white border border-amber-500/50' :
                'bg-white/10 hover:bg-white/20 text-white/60 border border-white/20'}`
                }>
              <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/aba199569_Brand_Yellow.png" alt="SGH" className="w-5 h-5 object-contain" />
              Seawater Greenhouse
            </Button>
            <Button
                onClick={() => setSelectedPhase("Saltwater Farms")}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg backdrop-blur-sm transition-all ${
                selectedPhase === "Saltwater Farms" ?
                'bg-amber-500/30 hover:bg-amber-500/40 text-white border border-amber-500/50' :
                'bg-white/10 hover:bg-white/20 text-white/60 border border-white/20'}`
                }>
              <img src="https://media.base44.com/images/public/6993b7c68cee7955d3266d09/387064630_SaltwaterFarming_Transparent.png" alt="Saltwater Farms" className="w-5 h-5 object-contain" />
              Saltwater Farms
            </Button>
          </div>
          {selectedPhase === "Seawater Greenhouse" && (
            <p className="text-white/40 text-[11px] mt-2 max-w-[260px]">
              The pioneer. Decades of global deployments that proved the science.
            </p>
          )}
          {selectedPhase === "Saltwater Farms" && (
            <p className="text-white/40 text-[11px] mt-2 max-w-[260px]">
              The successor — reconfigured for the US, field crops at scale, and global transformation.
            </p>
          )}
        </div>
      </motion.div>

      {/* Globe */}
      <div className="absolute inset-0">
        <GlobeScene
            projects={projects}
            selectedProject={null}
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

      {/* Bottom gradient fade */}
      <div className="hidden lg:block absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t pointer-events-none z-[5] from-black to-transparent" />
      </div>



      {/* Story Content Section */}
      <div className="relative z-10 bg-black">
        {/* 1. The Next Giant Leap */}
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
                Revolutionizing desert agriculture to unlock water abundance, make the desert bloom and feed the next 6 billion people.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col justify-end">
                <FertilizerChart isAdmin={isAdmin} getHomeImg={getHomeImg} setHomeImg={setHomeImg} />
              </div>
              <div className="flex flex-col justify-end">
                <SaltwaterChart isAdmin={isAdmin} getHomeImg={getHomeImg} setHomeImg={setHomeImg} />
              </div>
            </div>
          </div>
        </section>

        {/* 2. The Solution - Saltwater Cooling Walls */}
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
                A powerfully simple solution - A cardboard wall continuously drenched in saltwater, turning blistering desert heat into a smothering blanket of cool, humid air to dramatically crush freshwater use by an astonishing 70-90% - a real difference that matters
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
                imgClassName="w-full h-auto object-cover rounded-2xl" />
            </motion.div>
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
                  body: "As salty water evaporates through the panels, it steals heat from the air. That cooled air is denser, sinking and smothering the field in a cool, protective layer."
                },
                {
                  key: "wind_humid",
                  title: "Humidifies the Wind",
                  defaultImg: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/e96f645e7_generated_image.png",
                  body: "The drenched walls saturate the desert air, smothering the fields and returning moisture to the ground instead of stealing it"
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

        {/* 3. The Problem is Agriculture */}
        <RootCauseSection isAdmin={isAdmin} getHomeImg={getHomeImg} setHomeImg={setHomeImg} />

        {/* 4. Water Shortages */}
        <section className="py-24 px-6 sm:px-12 bg-black" id="water-shortages">
...
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16">

              <h2 className="text-5xl font-bold mb-6 text-white">
                The Water Wars Have Begun
              </h2>
              <p className="text-xl text-white/60 max-w-3xl mx-auto">
                With water we conquered the desert. But there are no more untapped rivers. The struggle has just begun.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  key: "shortage_1",
                  defaultImg: "https://images.unsplash.com/photo-1515339760107-1952b7a08454?w=800&h=600&fit=crop",
                  alt: "Tamed rivers",
                  title: "We Tamed Mighty Rivers",
                  body: "We dammed the Colorado, Nile, and Yangtze—bending nature's power to feed our cities."
                },
                {
                   key: "shortage_2",
                   defaultImg: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
                   alt: "Water brought to desert",
                   title: "We Watered The Desert",
                   body: "Aqueducts and canals stretched hundreds of miles. We moved water to where nature never intended—turning wasteland into farmland."
                },
                {
                   key: "shortage_3",
                   defaultImg: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop",
                   alt: "Desert farms feeding millions",
                   title: "We Fed Millions From Sand",
                   body: "Imperial Valley, the Negev, the Arabian Peninsula—deserts bloomed, harvests exploded, and we fed billions from once-barren land."
                },
                {
                   key: "shortage_4",
                   defaultImg: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop",
                   alt: "Cities in the desert",
                   title: "And Built Cities From Nothing",
                   body: "Las Vegas, Phoenix, Dubai, Cairo—great civilizations rose in Earth's harshest places, all standing on borrowed water."
                },
                {
                   key: "shortage_5",
                   defaultImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
                   alt: "Hoover Dam and drained Colorado River",
                   title: "But Our Rivers Are Dry",
                   body: "Lake Mead has fallen 180 feet. The Colorado no longer reaches the sea. We spent centuries of water in decades."
                },
                {
                  key: "shortage_6",
                  defaultImg: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&h=600&fit=crop",
                  alt: "Water wars",
                  title: "The Water Wars Have Begun",
                  body: "States sue states. Nations threaten nations. The fights over what's left are already here—and only getting fiercer."
                },
                {
                   key: "shortage_7",
                   defaultImg: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop",
                   alt: "Fallowed farmland",
                   title: "Now Cities Buyout The Farmers",
                   body: "Unable to find more water, cities and investors buy farmland and fallow it permanently. Farmers walk away with a check and no future."
                },
                {
                   key: "shortage_8",
                   defaultImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
                   alt: "Rural town decay",
                   title: "Leaving The Towns To Die",
                   body: "When farms go, everything goes—feed stores, equipment dealers, restaurants, jobs. Rural communities collapse into poverty."
                },
                {
                  key: "shortage_9",
                  defaultImg: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800&h=600&fit=crop",
                  alt: "Salton Sea environmental collapse",
                  title: "As The Land Turns To Dust",
                  body: "The Salton Sea and Owens Lake show the cost: exposed lakebeds become toxic wastelands, leaving public health crises and environmental collapse."
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
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-amber-500/90 flex items-center justify-center text-black font-bold text-base">
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

        {/* 5. Getting Started - Imperial Valley */}
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
                Together, We Can Change THIS World
              </h2>
              <p className="text-2xl leading-relaxed mb-6 text-white/80">
                Feed 10 billion people. Save our water. Make deserts bloom.
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