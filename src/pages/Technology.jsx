import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Waves, Droplets, Wind, Thermometer, Play, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import AdminImageUpload from "../components/home/AdminImageUpload";
import { useQueryClient } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

  React.useEffect(() => {
    base44.auth.me().then((user) => setIsAdmin(user?.role === 'admin'));
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
  }];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 pt-32 pb-24">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16">

          <div className="flex items-center gap-4 mb-6 justify-center">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Technology Innovation</span>
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
          className="mb-20">

          <div
            className="relative rounded-2xl overflow-hidden cursor-pointer group"
            onClick={() => setVideoOpen(true)}
            style={{ aspectRatio: '16/9' }}>

            <AdminImageUpload
              src={getHomeImg("tech_video_thumb", "https://img.youtube.com/vi/LqPZoQMv6vQ/maxresdefault.jpg")}
              alt="Technology Video Thumbnail"
              isAdmin={isAdmin}
              onUploaded={(url) => setHomeImg("tech_video_thumb", url)}
              className="w-full h-full"
              imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

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
        {videoOpen &&
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-6"
          onClick={() => setVideoOpen(false)}>

            <div
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}>

              <button
              onClick={() => setVideoOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">

                <X className="w-5 h-5 text-white" />
              </button>
              <div style={{ aspectRatio: '16/9' }}>
                <iframe
                src="https://www.youtube.com/embed/LqPZoQMv6vQ"
                title="How Saltwater Cooling Walls Work"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full" />

              </div>
            </div>
          </div>
        }

        {/* KPI Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
          { number: "90%", label: "Water Savings", sub: "vs. conventional irrigation" },
          { number: "27°F", label: "Temperature Reduction", sub: "ambient cooling effect" },
          { number: "50%", label: "Humidity Increase", sub: "optimal growing conditions" }].
          map((stat, idx) =>
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.1 }}
            className="p-8 rounded-xl text-center bg-white/5 border border-white/10">

              <div className="text-5xl font-bold text-amber-400 mb-2">{stat.number}</div>
              <div className="text-lg font-semibold text-white mb-1">{stat.label}</div>
              <div className="text-sm text-white/40">{stat.sub}</div>
            </motion.div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-10 mb-24">
          {mechanisms.map((m, idx) =>
          <motion.div
            key={m.key}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.1 }}>

              <AdminImageUpload
              src={getHomeImg(m.key, m.defaultImg)}
              alt={m.title}
              isAdmin={isAdmin}
              onUploaded={(url) => setHomeImg(m.key, url)}
              className="w-full rounded-xl overflow-hidden mb-5"
              imgClassName="w-full h-60 object-cover rounded-xl" />

              <div className={`flex items-center gap-2 mb-3`}>
                <m.icon className="w-5 h-5 text-white" />
                <h3 className="text-xl font-bold text-white">{m.title}</h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{m.body}</p>
            </motion.div>
          )}
        </div>

        {/* Why Traditional Desalination Won't Work */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24">

          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Why Desalination Won't Work</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* The Scale Problem */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12">

              <h2 className="text-4xl font-bold text-white mb-4">Most of our water is used in agriculture...</h2>
              <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
                Farming is where the world's water is used, and where it must be saved.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
              { crop: "Alfalfa", pct: "42%", acres: "~12M acres", water: "4-6 acre-feet/yr", key: "crop_alfalfa", defaultImage: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop" },
              { crop: "Cotton", pct: "18%", acres: "~9M acres", water: "3-4 acre-feet/yr", key: "crop_cotton", defaultImage: "https://images.unsplash.com/photo-1556756822-42d30f2d6da0?w=400&h=300&fit=crop" },
              { crop: "Vegetables & Melons", pct: "15%", acres: "~7M acres", water: "2-3 acre-feet/yr", key: "crop_veggies", defaultImage: "https://images.unsplash.com/photo-1464226184081-280282a34c6c?w=400&h=300&fit=crop" }].
              map((item, idx) =>
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all duration-300">

                   <div className="relative h-52 overflow-hidden">
                     <div className="absolute inset-0 z-0">
                       <AdminImageUpload
                       src={getHomeImg(item.key, item.defaultImage)}
                       alt={item.crop}
                       isAdmin={isAdmin}
                       onUploaded={(url) => setHomeImg(item.key, url)}
                       className="w-full h-full"
                       imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

                     </div>
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent backdrop-blur-sm z-10" />
                     <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                       <p className="text-white font-bold text-2xl mb-1">{item.crop}</p>
                       <p className="text-amber-400 font-bold text-3xl">{item.pct}</p>
                       <p className="text-white/70 text-sm mt-2">of Agricultural Water</p>
                     </div>
                   </div>
                   <div className="p-6 bg-white/[0.04]">
                     <div className="flex justify-between items-center mb-3">
                       <span className="text-white/60 text-sm">Area</span>
                       <span className="text-white font-semibold">{item.acres}</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-white/60 text-sm">Annual Use</span>
                       <span className="text-white font-semibold">{item.water}</span>
                     </div>
                   </div>
                 </motion.div>
              )}
            </div>
          </div>

          {/* The Cost Problem */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">...Where desalination is far too expensive...</h2>
             <p className="text-white/70 text-lg leading-relaxed mb-8">
               Desalination costs 5x more than crops are worth.
             </p>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative rounded-2xl overflow-hidden h-64 group">

                <div className="absolute inset-0 z-0">
                  <AdminImageUpload
                    src={getHomeImg("dessal_water_cost", "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/4c0e1db71_water.jpg")}
                    alt="Desalinated Water"
                    isAdmin={isAdmin}
                    onUploaded={(url) => setHomeImg("dessal_water_cost", url)}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover" />

                </div>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10" />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-2">Desalinated Water Cost</div>
                    <div className="text-5xl font-bold text-red-400 mb-4">$20,000+</div>
                    <p className="text-white/80 text-sm">per acre</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative rounded-2xl overflow-hidden h-64 group">

                <div className="absolute inset-0 z-0">
                  <AdminImageUpload
                    src={getHomeImg("crop_value_alfalfa", "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/8b2b8e0f0_Alfalfa.jpg")}
                    alt="Alfalfa Crop"
                    isAdmin={isAdmin}
                    onUploaded={(url) => setHomeImg("crop_value_alfalfa", url)}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover" />

                </div>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10" />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-2">Crop Value (Alfalfa)</div>
                    <div className="text-5xl font-bold text-green-400 mb-4">$4,000</div>
                    <p className="text-white/80 text-sm">per acre annually</p>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>

          {/* The Future Problem */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">...And it always will be</h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Desalination costs have flatlined. We've hit the physics limit of the process. Energy inputs dominate the cost curve, and renewable energy improvements aren't enough to bridge a 5x gap.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-sm">

              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={[
                { year: "1970s", desal: 9700, iidfarmers: 25, farmers: 25 },
                { year: "1980s", desal: 8500, iidfarmers: 25, farmers: 25 },
                { year: "1990s", desal: 6000, iidfarmers: 20, farmers: 20 },
                { year: "2000s", desal: 4500, iidfarmers: 20, farmers: 20 },
                { year: "2010s", desal: 2500, iidfarmers: 20, farmers: 20 },
                { year: "2020", desal: 2329, iidfarmers: 20, farmers: 20 },
                { year: "2024", desal: 3400, iidfarmers: 25, farmers: 25 }]
                } margin={{ top: 30, right: 30, left: 30, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="year" stroke="rgba(255,255,255,0.4)" style={{ fontSize: "12px", fontWeight: 500 }} />
                  <YAxis stroke="rgba(255,255,255,0.4)" style={{ fontSize: "12px" }} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.9)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      borderRadius: "12px",
                      padding: "12px"
                    }}
                    formatter={(value) => `$${value.toLocaleString()}/acre-ft`}
                    labelStyle={{ color: "#ffffff" }}
                    cursor={{ stroke: "rgba(59, 130, 246, 0.2)", strokeWidth: 2 }} />

                  <Line
                    type="natural"
                    dataKey="desal"
                    stroke="#3b82f6"
                    dot={false}
                    strokeWidth={3}
                    isAnimationActive={true}
                    name="Desalination Cost" />

                  <Line
                    type="linear"
                    dataKey="iidfarmers"
                    stroke="#60a5fa"
                    dot={false}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    isAnimationActive={true}
                    name="What IID Farmers Pay" />

                </LineChart>
              </ResponsiveContainer>
              <div className="mt-8 grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Current Standard (Carlsbad)</p>
                  <p className="text-2xl font-bold text-blue-400">$3,400</p>
                  <p className="text-white/40 text-xs mt-1">per acre-foot (2024)</p>
                </div>
                <div className="text-center border-l border-r border-white/10">
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-2">The Gap</p>
                  <p className="text-2xl font-bold text-white">136x</p>
                  <p className="text-white/40 text-xs mt-1">vs. what farmers pay</p>
                </div>
                <div className="text-center">
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-2">What Colorado River Farmers Pay</p>
                  <p className="text-2xl font-bold text-blue-300">$25</p>
                  <p className="text-white/40 text-xs mt-1">per acre-foot (IID 2024)</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Alternative Technologies */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">...And there are few suitable tools for saving water in these environments</h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              The farming regions we target grow large-scale field crops with mechanized equipment. Common water-saving technologies hit hard limits in this environment.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
              {
                title: "Drip Irrigation",
                problem: "Blocks heavy machinery. Incompatible with commodity crops.",
                unsuitable: "Impossible at scale",
                key: "tech_drip",
                defaultImage: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop"
              },
              {
                title: "Greenhouses",
                problem: "Block sunlight, machinery, and cost $100K+/acre.",
                unsuitable: "Only for high-value crops",
                key: "tech_greenhouses",
                defaultImage: "https://images.unsplash.com/photo-1530836369250-ef72a3f26f0d?w=400&h=300&fit=crop"
              },
              {
                title: "Pivot Irrigation",
                problem: "Optimizes efficiency but doesn't stop evaporation.",
                unsuitable: "Improves the wrong variable",
                key: "tech_precision",
                defaultImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop"
              }].
              map((tech, idx) =>
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex flex-col">

                  <div className="h-40 overflow-hidden">
                    <AdminImageUpload
                    src={getHomeImg(tech.key, tech.defaultImage)}
                    alt={tech.title}
                    isAdmin={isAdmin}
                    onUploaded={(url) => setHomeImg(tech.key, url)}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover" />

                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3">{tech.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-3">{tech.problem}</p>
                    <p className="text-red-400/80 text-xs font-semibold">{tech.unsuitable}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Saltwater Advantage */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24">

          <h2 className="text-3xl font-bold text-white mb-10">Except Saltwater Cooling Walls</h2>
          <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24">

          <AdminImageUpload
            src={getHomeImg("innovation_hero", "https://images.unsplash.com/photo-1586771107445-d3ca888129ce?w=1400&h=700&fit=crop")}
            alt="Saltwater Cooling Walls in action"
            isAdmin={isAdmin}
            onUploaded={(url) => setHomeImg("innovation_hero", url)}
            className="w-full rounded-2xl overflow-hidden"
            imgClassName="w-full h-[44.35rem] object-cover rounded-2xl" />

        </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
            { title: "What we use", icon: "💧", body: "Brackish groundwater — saline water that can't be used for drinking or irrigation. It sits unused beneath millions of acres of farmland worldwide. We pump it through our cooling panels, evaporate it, and discard the brine. It costs a fraction of freshwater." },
            { title: "What we replace", icon: "🌊", body: "Freshwater irrigation — the most precious resource on earth. By eliminating the need for fresh water in the cooling process and dramatically reducing crop transpiration, we cut total farm water demand by up to 90%." },
            { title: "The physics", icon: "🔬", body: "Evaporative cooling is the same principle as sweating. As water evaporates, it absorbs heat. Our panels maximize the surface area for evaporation, creating the most efficient natural cooling system possible at agricultural scale." },
            { title: "The scale", icon: "🌍", body: "The technology works at any scale — from a single farm to an entire region. Each wall protects a strip of land downwind. Walls can be arranged in arrays to protect hundreds of acres, creating a new form of climate infrastructure for food production." }].
            map((item, idx) =>
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10">

                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.body}</p>
              </motion.div>
            )}
          </div>
        </motion.div>

      </div>
    </div>);
}