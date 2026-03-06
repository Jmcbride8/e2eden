import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Waves, Droplets, Wind, Thermometer, Play, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import AdminImageUpload from "../components/home/AdminImageUpload";
import { useQueryClient } from "@tanstack/react-query";
import SeawaterGreenhouseSection from "../components/home/SeawaterGreenhouseSection";

export default function Technology() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const queryClient = useQueryClient();

  const { data: homeContentRecords = [] } = useQuery({
    queryKey: ['homeContent'],
    queryFn: () => base44.entities.HomeContent.list()
  });

  const homeContentMap = React.useMemo(() => {
    const map = {};
    homeContentRecords.forEach((r) => { map[r.key] = r; });
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

  React.useEffect(() => {
    base44.auth.me().then(user => setIsAdmin(user?.role === 'admin'));
  }, []);

  const mechanisms = [
    {
      key: "wind_slow",
      icon: Wind,
      title: "Slows the Wind",
      color: "text-sky-400",
      defaultImg: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/41eb3c992_generated_image.png",
      body: "Hot desert wind strips the layer of moisture above the fields. Our cooling walls act as a windbreak, protecting this critical moisture layer and reducing the drying effect on crops."
    },
    {
      key: "wind_cool",
      icon: Thermometer,
      title: "Cools the Wind",
      color: "text-cyan-400",
      defaultImg: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/d10c5cc70_generated_image.png",
      body: "As saltwater evaporates through the panels, it steals heat from the air. That cooled air is denser — it sinks, smothering the field in a cool, protective blanket that drops temperatures by up to 27°F."
    },
    {
      key: "wind_humid",
      icon: Droplets,
      title: "Humidifies the Wind",
      color: "text-emerald-400",
      defaultImg: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/e96f645e7_generated_image.png",
      body: "The moisture doesn't vanish — it stays. Humid air clings to the field, slowing evaporation from soil and plant alike. Crops stop fighting the heat and start putting their energy into growth."
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 pt-32 pb-24">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center gap-4 mb-6 justify-center">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">The Breakthrough Innovation</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">Saltwater Cooling Walls</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            We substitute saltwater for fresh — cooling farms with the briny, unusable water hiding beneath our feet, unleashing abundance where the world thought only dust could exist.
          </p>
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div
            className="relative rounded-2xl overflow-hidden cursor-pointer group"
            onClick={() => setVideoOpen(true)}
            style={{ aspectRatio: '16/9' }}
          >
            <AdminImageUpload
              src={getHomeImg("tech_video_thumb", "https://img.youtube.com/vi/LqPZoQMv6vQ/maxresdefault.jpg")}
              alt="Technology Video Thumbnail"
              isAdmin={isAdmin}
              onUploaded={(url) => setHomeImg("tech_video_thumb", url)}
              className="w-full h-full"
              imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6">
              <p className="text-white/60 text-sm uppercase tracking-widest mb-1">Watch</p>
              <h3 className="text-white text-2xl font-bold">How Saltwater Cooling Walls Work</h3>
            </div>
          </div>
        </motion.div>

        {/* Video Modal */}
        {videoOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-6"
            onClick={() => setVideoOpen(false)}
          >
            <div
              className="relative w-full max-w-4xl rounded-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setVideoOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div style={{ aspectRatio: '16/9' }}>
                <iframe
                  src="https://www.youtube.com/embed/LqPZoQMv6vQ"
                  title="How Saltwater Cooling Walls Work"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* KPI Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            { number: "90%", label: "Water Savings", sub: "vs. conventional irrigation" },
            { number: "27°F", label: "Temperature Reduction", sub: "ambient cooling effect" },
            { number: "50%", label: "Humidity Increase", sub: "optimal growing conditions" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="p-8 rounded-xl text-center bg-white/5 border border-white/10"
            >
              <div className="text-5xl font-bold text-amber-400 mb-2">{stat.number}</div>
              <div className="text-lg font-semibold text-white mb-1">{stat.label}</div>
              <div className="text-sm text-white/40">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* One Wall. Three Ways. */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">How It Works</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">One wall. Three ways it fights water loss.</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Plants lose water to wind, heat, and dry air. These saltwater cooling walls attack all three — simultaneously.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10 mb-24">
          {mechanisms.map((m, idx) => (
            <motion.div
              key={m.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
            >
              <AdminImageUpload
                src={getHomeImg(m.key, m.defaultImg)}
                alt={m.title}
                isAdmin={isAdmin}
                onUploaded={(url) => setHomeImg(m.key, url)}
                className="w-full rounded-xl overflow-hidden mb-5"
                imgClassName="w-full h-60 object-cover rounded-xl"
              />
              <div className={`flex items-center gap-2 mb-3`}>
                <m.icon className={`w-5 h-5 ${m.color}`} />
                <h3 className={`text-xl font-bold ${m.color}`}>{m.title}</h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{m.body}</p>
            </motion.div>
          ))}
        </div>

        {/* The Problem It Solves */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">The Problem It Solves</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Agriculture Uses 85% of Our Water</h2>
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                In desert heat, crops constantly lose water to evaporation—it never becomes food. Desalination seems promising until you see the math: $20,000 per acre of desalinated water versus $4,000 per acre of yield. The economics don't work.
              </p>
              <p className="text-white/70 text-lg leading-relaxed">
                Saltwater cooling walls use what's already there—saline groundwater beneath millions of acres of farmland—transforming it into a climate weapon without the cost.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-8xl font-bold text-amber-400 mb-4">85%</div>
              <p className="text-2xl font-semibold text-white mb-4">Of freshwater goes to agriculture</p>
              <div className="space-y-4">
                {[
                  { name: "Alfalfa", pct: "42%", color: "#f59e0b" },
                  { name: "Cotton", pct: "18%", color: "#60a5fa" },
                  { name: "Vegetables & Melons", pct: "15%", color: "#34d399" },
                ].map((crop) => (
                  <div key={crop.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">{crop.name}</span>
                      <span className="text-white font-semibold">{crop.pct}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10">
                      <div className="h-1.5 rounded-full" style={{ width: crop.pct, backgroundColor: crop.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Saltwater Advantage */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">The Saltwater Advantage</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "What we use", icon: "💧", body: "Brackish groundwater — saline water that can't be used for drinking or irrigation. It sits unused beneath millions of acres of farmland worldwide. We pump it through our cooling panels, evaporate it, and discard the brine. It costs a fraction of freshwater." },
              { title: "What we replace", icon: "🌊", body: "Freshwater irrigation — the most precious resource on earth. By eliminating the need for fresh water in the cooling process and dramatically reducing crop transpiration, we cut total farm water demand by up to 90%." },
              { title: "The physics", icon: "🔬", body: "Evaporative cooling is the same principle as sweating. As water evaporates, it absorbs heat. Our panels maximize the surface area for evaporation, creating the most efficient natural cooling system possible at agricultural scale." },
              { title: "The scale", icon: "🌍", body: "The technology works at any scale — from a single farm to an entire region. Each wall protects a strip of land downwind. Walls can be arranged in arrays to protect hundreds of acres, creating a new form of climate infrastructure for food production." },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <AdminImageUpload
            src={getHomeImg("innovation_hero", "https://images.unsplash.com/photo-1586771107445-d3ca888129ce?w=1400&h=700&fit=crop")}
            alt="Saltwater Cooling Walls in action"
            isAdmin={isAdmin}
            onUploaded={(url) => setHomeImg("innovation_hero", url)}
            className="w-full rounded-2xl overflow-hidden"
            imgClassName="w-full h-[40.32rem] object-cover rounded-2xl"
          />
        </motion.div>

        {/* The Mind Behind It All - Charlie Paton */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Honoring The Mind Behind It All</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Portrait + identity */}
            <div className="flex-shrink-0 flex flex-col items-center md:items-start">
              <div className="w-[308px] h-[308px] rounded-2xl overflow-hidden border border-white/10 mb-4">
                <img
                  src="https://greenhouse.agency/wp-content/uploads/charlie-paton-copy.jpg"
                  alt="Charlie Paton"
                  className="w-full h-full object-cover"
                />
              </div>
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/fba830cbc_seawater_greenhouse_logo_white.png"
                alt="Seawater Greenhouse"
                className="h-6 object-contain opacity-70 mb-3"
              />
              <h3 className="text-2xl font-bold text-white mb-1">Charlie Paton</h3>
              <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">Founder & Director, Seawater Greenhouse Ltd</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs">Royal Designer for Industry</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs">30+ Years of Innovation</span>
              </div>
            </div>

            {/* Bio */}
            <div className="flex-1 min-w-0">
              <blockquote className="text-lg font-light text-white/80 italic leading-relaxed mb-5 border-l-2 border-amber-400 pl-6">
                "Solving problems is fun and interesting. Light and photosynthesis fascinate me, and I enjoy creating the right environment for things to grow."
              </blockquote>
              <p className="text-white/70 leading-relaxed mb-3">
                Charlie Paton is a British designer, inventor, and the visionary behind Seawater Greenhouse technology. Trained at the Central School of Art and Design in London, he spent years as a lighting and special effects designer before a bus ride through Morocco sparked an idea that would change the course of desert agriculture.
              </p>
              <p className="text-white/70 leading-relaxed mb-3">
                In the early 1990s, Paton developed a greenhouse system using sunshine and seawater to create cool, humid growing environments in the harshest climates. Over three decades, he deployed this across three continents — from Abu Dhabi to Australia — proving the concept at scale. His work has produced thousands of tonnes of crops where nature said nothing could grow.
              </p>
              <p className="text-white/70 leading-relaxed">
                In 2012, Charlie was elected a Royal Designer for Industry by the Royal Society for the Encouragement of Arts. E2Eden is proud to stand on his shoulders as we bring this proven technology to the United States and to the world's most vulnerable farming communities.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Our Strategic Approach */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Our Strategic Approach</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          
          <p className="text-center text-white/70 text-lg max-w-3xl mx-auto mb-12 leading-relaxed">
            The business model is as important as the technology. We're bringing the Silicon Valley entrepreneurial playbook to agriculture — focusing on profitability, capital efficiency, and market-driven innovation.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                key: "approach_covers",
                title: "Removing the Covers",
                subtitle: "Open-Air Cooling Walls",
                body: "The USA grows mechanized field crops that require heavy equipment and large spaces. Traditional greenhouse covers would block machinery and reduce efficiency. Our open-air saltwater cooling walls provide the climate benefits without the infrastructure constraints — designed for American agriculture.",
                defaultImg: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop"
              },
              {
                key: "approach_brines",
                title: "Underground Brines",
                subtitle: "Abundant, Useless Water",
                body: "3/4th of Arizona's underground water is brines — mineral-rich saltwater that can't be used for drinking or irrigation. California, Nevada, and the Southwest have millions of acres underlain with these reserves. We've flipped the equation: instead of expensive freshwater desalination, we use abundant brines as a free resource for cooling.",
                defaultImg: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop"
              },
              {
                key: "approach_profit",
                title: "Built for Profit",
                subtitle: "Water as Revenue",
                body: "We don't measure success by crops grown — we measure it by water saved and sold. The real business model isn't agriculture; it's water markets. By creating a verified, bankable water savings asset, we enable farmers to monetize conservation. Massive profit drives scale.",
                defaultImg: "https://images.unsplash.com/photo-1460925895917-afdab36c3a3f?w=600&h=400&fit=crop"
              },
              {
                key: "approach_capital",
                title: "Capital Markets Access",
                subtitle: "Silicon Valley Velocity",
                body: "California's venture capital ecosystem enables us to access capital at speed and scale. We're not constrained by ag-industry timelines or traditional farm finance. We move like a tech company — rapidly deploying capital, iterating at scale, and capturing markets before competition emerges.",
                defaultImg: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
              }
            ].map((card, idx) => (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all duration-300 group flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <AdminImageUpload
                    src={getHomeImg(card.key, card.defaultImg)}
                    alt={card.title}
                    isAdmin={isAdmin}
                    onUploaded={(url) => setHomeImg(card.key, url)}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
                </div>
                <div className="flex-1 p-6 flex flex-col">
                  <div className="mb-4">
                    <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-1">{card.subtitle}</p>
                    <h3 className="text-2xl font-bold text-white">{card.title}</h3>
                  </div>
                  <p className="text-white/70 leading-relaxed flex-1">{card.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Seawater Greenhouse Legacy - Moved from Home */}
        <SeawaterGreenhouseSection />

      </div>
    </div>
  );
}