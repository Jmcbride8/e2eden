import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Waves, Droplets, Wind, Thermometer, Play, X, Droplet, Zap, Hexagon, Grid3X3 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import AdminImageUpload from "../components/home/AdminImageUpload";
import { useQueryClient } from "@tanstack/react-query";
import ScienceFrontier from "../components/science/ScienceFrontier";

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
    body: "As saltwater evaporates through the panels, it absorbs heat from the air, so the air leaving the wall is cooler than ambient. How much of that drop persists downwind at crop height — and how it varies with wind, humidity and wall design — is the central measurement of our field trials."
  },
  {
    key: "wind_humid",
    icon: Droplets,
    title: "Humidifies the Wind",
    color: "text-emerald-400",
    defaultImg: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/e96f645e7_generated_image.png",
    body: "The moisture does not vanish — it leaves the wall in the air. Higher humidity lowers the vapor-pressure deficit that drives transpiration, which is where any freshwater saving would come from. Whether that holds at field scale is the research question."
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
            We substitute saltwater for fresh — cooling farms with brackish water unsuitable for drinking or irrigation, where a site has a usable supply. The cooling physics is established. The open-field application is what we are setting out to prove.
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

        {/* Research objectives */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
          { status: "To Be Validated", label: "Net Freshwater Savings", sub: "Controlled field trials will measure whether cooling reduces irrigation demand after accounting for salinity-management water." },
          { status: "Under Investigation", label: "Cooling Reach", sub: "Measuring temperature reduction and its persistence at increasing distances from the wall." },
          { status: "Under Investigation", label: "Microclimate Modification", sub: "Measuring changes in relative humidity, vapor-pressure deficit, and crop-level conditions." }].
          map((stat, idx) =>
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.1 }}
            className="p-8 rounded-xl bg-white/5 border border-white/10">

              <div className="text-2xl font-bold text-amber-400 mb-2 leading-tight">{stat.status}</div>
              <div className="text-lg font-semibold text-white mb-3">{stat.label}</div>
              <div className="text-sm text-white/50 leading-relaxed">{stat.sub}</div>
            </motion.div>
          )}
        </div>

        <ScienceFrontier embedded />

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

              <h2 className="text-4xl font-bold text-white mb-4">Most of the West's water is used in agriculture...</h2>
              <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
                Irrigated farming is the largest consumptive water user in the Southwest, and where the savings have to come from. The ranges below are published low-desert applied-water estimates; actual use varies by season, soil and practice.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
              { crop: "Alfalfa", water: "4–6 acre-feet", note: "Multi-cut forage with a long growing season — the highest-volume irrigated crop in the lower Colorado basin.", key: "crop_alfalfa", defaultImage: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop" },
              { crop: "Cotton", water: "3–4 acre-feet", note: "Heat-tolerant, but still dependent on a reliable seasonal supply to establish and finish.", key: "crop_cotton", defaultImage: "https://images.unsplash.com/photo-1556756822-42d30f2d6da0?w=400&h=300&fit=crop" },
              { crop: "Vegetables & Melons", water: "2–3 acre-feet", note: "Heat-sensitive and high-value — the crops most likely to benefit from buffering peak temperatures.", key: "crop_veggies", defaultImage: "https://images.unsplash.com/photo-1464226184081-280282a34c6c?w=400&h=300&fit=crop" }].
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
                       <p className="text-amber-400 font-bold text-3xl">{item.water}</p>
                       <p className="text-white/70 text-sm mt-2">per acre, per year</p>
                     </div>
                   </div>
                   <div className="p-6 bg-white/[0.04]">
                     <p className="text-white/60 text-sm leading-relaxed">{item.note}</p>
                   </div>
                 </motion.div>
              )}
            </div>
          </div>

          {/* The Cost Problem */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">...Where desalinated water is hard to justify...</h2>
             <p className="text-white/70 text-lg leading-relaxed mb-8">
               Delivered desalinated supply costs roughly five times more per acre-foot than an irrigated field crop can pay for its water.
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
                    <div className="text-2xl font-bold text-white mb-2">Desalinated Municipal Supply</div>
                    <div className="text-5xl font-bold text-red-400 mb-4">$3,400</div>
                    <p className="text-white/80 text-sm">per acre-foot · Carlsbad, 2024</p>
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
                    <div className="text-2xl font-bold text-white mb-2">What Alfalfa Can Pay</div>
                    <div className="text-5xl font-bold text-green-400 mb-4">$700–1,000</div>
                    <p className="text-white/80 text-sm">gross value per acre-foot used</p>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>

          {/* The Future Problem */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">...And that gap is unlikely to close soon</h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Desalination continues to advance, but its cost and energy requirements can make it economically challenging for low-value, water-intensive agricultural applications. E2Eden is investigating an alternative approach: reducing freshwater demand rather than producing additional freshwater.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-sm">

              <div className="space-y-6">
                {[
                { label: "Desalinated municipal supply (Carlsbad, 2024)", value: "$3,400", bar: 100, color: "#3b82f6" },
                { label: "Gross value an acre of alfalfa can return per acre-foot used", value: "$700–1,000", bar: 26, color: "#34d399" },
                { label: "Colorado River farm rate (IID tier rates)", value: "$20–25", bar: 1, color: "#f59e0b" }].
                map((item) =>
                <div key={item.label}>
                    <div className="flex justify-between items-baseline gap-4 mb-2">
                      <span className="text-white/70 text-sm">{item.label}</span>
                      <span className="font-bold text-lg whitespace-nowrap" style={{ color: item.color }}>{item.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full" style={{ width: `${item.bar}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                )}
              </div>
              <p className="text-white/40 text-xs mt-6">All figures in dollars per acre-foot. Indicative published benchmarks, not project measurements.</p>
              <p className="mt-8 text-white/70 text-sm leading-relaxed">
                Desalinated supply costs well over <span className="text-white font-semibold">100x</span> what a Colorado River farm pays for the same acre-foot of water — and roughly five times what a field crop can return on it.
              </p>
            </motion.div>
          </div>

          {/* Alternative Technologies */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">...And there are few suitable tools for saving water in these environments</h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              The tools available to large, mechanized field farming mostly deliver water more efficiently. They rarely change the crop's underlying demand for water.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
              {
                title: "Drip Irrigation",
                problem: "Complex to run under large-scale mechanized field operations, so it remains uncommon on commodity crops.",
                unsuitable: "Rarely used on field crops",
                key: "tech_drip",
                defaultImage: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop"
              },
              {
                title: "Greenhouses",
                problem: "Covered structures are capital-intensive and restrict field-scale mechanization.",
                unsuitable: "Built for high-value crops",
                key: "tech_greenhouses",
                defaultImage: "https://images.unsplash.com/photo-1530836369250-ef72a3f26f0d?w=400&h=300&fit=crop"
              },
              {
                title: "Pivot Irrigation",
                problem: "Delivers water efficiently, but does not reduce evaporative demand on the crop.",
                unsuitable: "Addresses delivery, not demand",
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
            imgClassName="w-full h-[35.48rem] object-cover rounded-2xl" />

        </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
            { 
              title: "What we use", 
              icon: <Droplet className="w-8 h-8 text-cyan-400" />,
              body: "Brackish groundwater — saline water that cannot be used for drinking or irrigation without treatment. Where a site has a usable supply, it is a far cheaper cooling input than freshwater. Availability varies by location, and assessing it is part of our field program." 
            },
            { 
              title: "What we replace", 
              icon: <Waves className="w-8 h-8 text-blue-400" />,
              body: "Freshwater irrigation — the resource that actually constrains agriculture. If cooling lowers evaporative demand, some of the water a crop currently loses to the atmosphere would not need to be replaced. How large that saving is in an open field is precisely what our trials are designed to measure." 
            },
            { 
              title: "The physics", 
              icon: <Zap className="w-8 h-8 text-amber-400" />,
              body: "Evaporative cooling is the same principle as sweating. As water evaporates, it absorbs heat from the air. Large wetted surface area lets that happen at scale with low-grade energy — the part of the system that is genuinely well established." 
            },
            { 
              title: "The scale", 
              icon: <Grid3X3 className="w-8 h-8 text-emerald-400" />,
              body: "Each wall conditions the air that passes through it. How far that cooled air persists downwind determines how much land a wall can serve. Spacing, height and orientation are design variables our research will test at farm scale before any claim about regional systems can be made." 
            }].
            map((item, idx) =>
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10">

                <div className="text-white/70 mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.body}</p>
              </motion.div>
            )}
          </div>
        </motion.div>

      </div>
    </div>);
}