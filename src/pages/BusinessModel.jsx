import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import AdminImageUpload from "../components/home/AdminImageUpload";
import { useQueryClient } from "@tanstack/react-query";
import SeawaterGreenhouseSection from "../components/home/SeawaterGreenhouseSection";

export default function BusinessModel() {
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
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Business Model Innovation</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">Make Money to Make a Difference</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Our business model aligns profit with purpose, turning water conservation into a bankable asset.
          </p>
        </motion.div>

        {/* Our Strategic Approach */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24">

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
            }].
            map((card, idx) =>
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all duration-300 group flex flex-col">

                <div className="relative h-48 overflow-hidden">
                  <AdminImageUpload
                  src={getHomeImg(card.key, card.defaultImg)}
                  alt={card.title}
                  isAdmin={isAdmin}
                  onUploaded={(url) => setHomeImg(card.key, url)}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

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
            )}
          </div>
        </motion.div>

        <SeawaterGreenhouseSection />

        {/* Evolving Proven Technology */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24">

          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Evolving Proven Technology</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 flex flex-col items-center md:items-start">
              <div className="w-[308px] h-[308px] rounded-2xl overflow-hidden border border-white/10 mb-4 relative cursor-pointer group"
                onClick={() => window.open("https://youtu.be/P4YCZgfchO0?si=H4k0zZHMp1PgCri1", "_blank")}>
                <img
                  src="https://greenhouse.agency/wp-content/uploads/charlie-paton-copy.jpg"
                  alt="Charlie Paton"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                    <svg className="w-6 h-6 text-white fill-white ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Charlie Paton</h3>
              <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">Founder and Director</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs">Royal Designer for Industry</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs">30+ Years of Innovation</span>
              </div>
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/fba830cbc_seawater_greenhouse_logo_white.png"
                alt="Seawater Greenhouse"
                className="h-6 object-contain opacity-70" />
            </div>

            <div className="flex-1 min-w-0">
              <blockquote className="text-lg font-light text-white/80 italic leading-relaxed mb-5 border-l-2 border-amber-400 pl-6">
                "Solving problems is fun and interesting. Light and photosynthesis fascinate me, and I enjoy creating the right environment for things to grow."
              </blockquote>
              <p className="text-white/70 leading-relaxed mb-3">
                Charlie Paton is a British designer, inventor, and the visionary behind Seawater Greenhouse technology. Over three decades he has deployed this technology across three continents — from Abu Dhabi to Australia — building a body of proven, real-world deployments that demonstrate the core science works at scale.
              </p>
              <p className="text-white/70 leading-relaxed mb-3">
                E2Eden is evolving that foundation in a crucial way: we are re-engineering the business model to solve industrialized agriculture at scale. Where traditional Seawater Greenhouse projects served niche, high-value crops, we target the vast open-field commodity farming that consumes 70% of the world's fresh water. Our model monetizes the water saved — selling conserved water back into drought-stressed markets — while simultaneously improving crop quality through consistently cooler, more humid growing conditions.
              </p>
              <p className="text-white/70 leading-relaxed">
                The technology is proven. The missing piece was a business model that could deploy it at the scale the water crisis demands. That is what E2Eden is building.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>);
}