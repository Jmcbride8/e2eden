import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import AdminImageUpload from "../components/home/AdminImageUpload";
import { useQueryClient } from "@tanstack/react-query";

export default function Innovators() {
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
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Meet the Team</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">The Minds Behind the Innovation</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Decades of expertise, vision, and dedication to transforming agriculture and water security.
          </p>
        </motion.div>

        {/* The Mind Behind It All - Charlie Paton */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24">

          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Honoring The Mind Behind It All</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Portrait + identity */}
            <div className="flex-shrink-0 flex flex-col items-center md:items-start">
              <div
                className="w-[308px] h-[308px] rounded-2xl overflow-hidden border border-white/10 mb-4 relative cursor-pointer group"
                onClick={() => window.open("https://youtu.be/P4YCZgfchO0?si=H4k0zZHMp1PgCri1", "_blank")}
              >
                <img
                  src={getHomeImg("charlie_paton_portrait", "https://greenhouse.agency/wp-content/uploads/charlie-paton-copy.jpg")}
                  alt="Charlie Paton"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
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

        {/* Whitepapers Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <div className="text-center mb-10">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">Research & Literature</p>
            <h2 className="text-3xl font-bold text-white">Whitepapers & Academic Research</h2>
            <p className="text-white/50 mt-3 max-w-xl mx-auto text-sm">Peer-reviewed research and technical papers underpinning the science behind Seawater Greenhouse technology.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: "The Seawater Greenhouse: Background, Theory and Current Status",
                authors: "Paton & Davies",
                year: "2005",
                description: "Foundational paper describing the theory of the Seawater Greenhouse and deriving the minimum condenser effectiveness required for net freshwater production.",
                tag: "Core Theory",
                url: "https://scispace.com/pdf/the-seawater-greenhouse-background-theory-and-current-status-3fj8fjqr00.pdf",
              },
              {
                title: "The Seawater Greenhouse: Cooling, Fresh Water and Fresh Produce from Salt Water",
                authors: "Paton",
                year: "2006",
                description: "Technical overview of how seawater and solar energy combine to produce desalination and cooling, with applications for arid coastal regions.",
                tag: "Technology Overview",
                url: "https://icwrae-psipw.org/papers/2006/Water/18.pdf",
              },
              {
                title: "Review of Seawater Greenhouses: Integrating Sustainable Agriculture into Green Building",
                authors: "Multiple Authors",
                year: "2025",
                description: "Comprehensive review synthesizing research on SWGH operational principles, design evolution, and integration into green building strategies for food security.",
                tag: "Review Paper",
                url: "https://www.researchgate.net/publication/393684185_Review_of_Seawater_Greenhouses_Integrating_Sustainable_Agriculture_into_Green_Building",
              },
              {
                title: "Integrating Renewable Energy Technologies into Seawater Greenhouses",
                authors: "Multiple Authors",
                year: "2025",
                description: "Critical review of renewable energy integration pathways into Seawater Greenhouse systems, presenting sustainable routes to zero-emission food production.",
                tag: "Energy Integration",
                url: "https://www.sciencedirect.com/science/article/pii/S2590174525004854",
              },
              {
                title: "Seawater Greenhouse – Impact on Sustainable Food Production in Arid Regions",
                authors: "REF Impact Case Study",
                year: "2021",
                description: "Impact assessment of prototype solar-driven desalination and fan ventilation systems, addressing food security and climate resilience in arid environments.",
                tag: "Impact Study",
                url: "https://results2021.ref.ac.uk/impact/c08ec50a-ac5c-4f76-b521-087856e2656e/pdf",
              },
              {
                title: "Saltwater Greenhouse Cooling System for Agricultural Drainage",
                authors: "UC eScholarship",
                year: "2023",
                description: "Study of a spray-drying evaporative system that intakes agricultural drainage water to cool greenhouses, lowering freshwater dependency.",
                tag: "Water Recycling",
                url: "https://escholarship.org/uc/item/5nb5d75s",
              },
            ].map((paper, i) => (
              <a
                key={i}
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-3 p-5 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-amber-400/30 hover:bg-white/[0.06] transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">{paper.tag}</span>
                  <span className="text-white/30 text-xs flex-shrink-0">{paper.year}</span>
                </div>
                <h4 className="text-sm font-semibold text-white leading-snug group-hover:text-amber-300 transition-colors">{paper.title}</h4>
                <p className="text-xs text-white/40 leading-relaxed flex-1">{paper.description}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-white/30 italic">{paper.authors}</span>
                  <span className="text-xs text-amber-400/70 group-hover:text-amber-400 transition-colors">Read paper →</span>
                </div>
              </a>
            ))}
          </div>
        </motion.div>

      </div>
    </div>);
}