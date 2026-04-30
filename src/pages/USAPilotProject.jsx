import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AdminImageUpload from "../components/home/AdminImageUpload";

export default function USAPilotProject() {
  const [isAdmin, setIsAdmin] = useState(false);
  const queryClient = useQueryClient();

  const { data: homeContentRecords = [] } = useQuery({
    queryKey: ['homeContent'],
    queryFn: () => base44.entities.HomeContent.list()
  });

  const homeContentMap = useMemo(() => {
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

  useEffect(() => {
    base44.auth.me().then((user) => setIsAdmin(user?.role === 'admin'));
  }, []);

  const timelineData = [
    { phase: "Proof of Concept", acres: 5, cost: "$50K", quarter: "2Q 2026" },
    { phase: "UC DREC Research", acres: 50, cost: "$5M", quarter: "3Q 2026" },
    { phase: "IID Board Pitch", acres: 50, cost: "$5M", quarter: "1Q 2027" },
    { phase: "Commercial Scale", acres: 1000, cost: "$TBD", quarter: "1Q 2028" }
  ];

  const unitEconomics = [
    { metric: "Total Cost", value: "$1,374/AF" },
    { metric: "Market Value", value: "$3,000/AF" },
    { metric: "Gross Profit", value: "$1,626/AF" },
    { metric: "Profit Margin", value: "~118%" }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 pt-32 pb-24">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16">

          <div className="flex items-center gap-4 mb-6 justify-center">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">USA Pilot Program</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-white">Saltwater Farms</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Bringing water-saving technology to the USA, using evaporative cooling to use an infinite resource – saltwater – to save an infinitely important one – freshwater.
          </p>
        </motion.div>

        {/* The Crisis Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24">

          <h2 className="text-4xl font-bold mb-10 text-white">The Crisis. Here. Now.</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-2xl font-bold text-red-400 mb-4">$20,000/year</p>
              <p className="text-white/60 text-lg">Cost of desalinated water per acre — too expensive for crops</p>
            </div>
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-2xl font-bold text-amber-400 mb-4">$2,400/year</p>
              <p className="text-white/60 text-lg">Value of alfalfa per acre — the economic mismatch is unsustainable</p>
            </div>
          </div>
          <div className="mt-8 p-8 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-2xl font-bold text-white mb-4">90% of Agricultural Water</p>
            <p className="text-white/60 text-lg">is used to cool crops, not grow them — this is our opportunity</p>
          </div>
        </motion.div>

        {/* The Solution */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24">

          <h2 className="text-4xl font-bold mb-10 text-white">The Solution: Saltwater Cooling Walls</h2>
          <div className="rounded-2xl overflow-hidden">
            <AdminImageUpload
              src={getHomeImg("saltwater_cooling", "https://images.unsplash.com/photo-1578496322380-0e3dd4e9c94e?w=1400&h=700&fit=crop")}
              alt="Saltwater Cooling Wall Technology"
              isAdmin={isAdmin}
              onUploaded={(url) => setHomeImg("saltwater_cooling", url)}
              className="w-full"
              imgClassName="w-full h-auto object-cover" />
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white font-bold mb-2">Hot Dry Air</p>
              <p className="text-4xl font-bold text-red-400">113°F</p>
              <p className="text-white/60 text-sm mt-2">Desert summertime</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white font-bold mb-2">Through Cooling Wall</p>
              <p className="text-sm text-white/60">Saltwater passes through CelDek™ Cellulose Membranes</p>
              <p className="text-white font-bold mt-4">Evaporative Cooling</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white font-bold mb-2">Cool Moist Air</p>
              <p className="text-4xl font-bold text-blue-400">86°F</p>
              <p className="text-white/60 text-sm mt-2">Life-giving oasis effect</p>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24">

          <h2 className="text-4xl font-bold mb-10 text-white">Project Timeline</h2>
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-24 text-center">
                  <p className="text-sm text-amber-400 font-semibold uppercase">2Q 2026</p>
                  <p className="text-2xl font-bold text-white mt-1">$50K</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Proof of Concept Farm</h3>
                  <p className="text-white/70 mb-3">5 acres in Thermal, CA</p>
                  <ul className="text-white/60 text-sm space-y-1">
                    <li>• Establish viability and de-risk technology</li>
                    <li>• Measure cooling effect, oasis radius, water savings</li>
                    <li>• Build credibility with UC DREC and farming community</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-24 text-center">
                  <p className="text-sm text-amber-400 font-semibold uppercase">3Q 2026</p>
                  <p className="text-2xl font-bold text-white mt-1">$5M</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">UC DREC Research Farm</h3>
                  <p className="text-white/70 mb-3">50 acres in Holtville, CA</p>
                  <ul className="text-white/60 text-sm space-y-1">
                    <li>• Full-scale pilot with rigorous economic validation</li>
                    <li>• Third-party data collection on yields, water savings, crop economics</li>
                    <li>• Led by Jairo Diaz-Ramirez, UC DREC Director</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-24 text-center">
                  <p className="text-sm text-amber-400 font-semibold uppercase">1Q 2027</p>
                  <p className="text-2xl font-bold text-white mt-1">$5M</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">IID Board Pitch</h3>
                  <p className="text-white/70 mb-3">Monetize Water Initiative</p>
                  <ul className="text-white/60 text-sm space-y-1">
                    <li>• Secure IID approval for conservation technology rebate list</li>
                    <li>• Present data package to Imperial Irrigation District board</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-24 text-center">
                  <p className="text-sm text-amber-400 font-semibold uppercase">1Q 2028</p>
                  <p className="text-2xl font-bold text-white mt-1">Scale</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Commercial Operations</h3>
                  <p className="text-white/70 mb-3">Thousands of acres</p>
                  <ul className="text-white/60 text-sm space-y-1">
                    <li>• Deploy Saltwater Cooling Walls to commercial operations</li>
                    <li>• Drive profit and save water at scale</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Unit Economics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24">

          <h2 className="text-4xl font-bold mb-10 text-white">Unit Economics: Per Acre-Foot (AF)</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {unitEconomics.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/70 text-sm mb-1">{item.metric}</p>
                  <p className="text-2xl font-bold text-amber-400">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Key Insights</h3>
              <ul className="space-y-3 text-white/70 text-sm">
                <li className="flex gap-3">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>Total cost is ~$1,374 per acre-foot</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>Market value benchmark is ~$3,000 per acre-foot</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>Gross profit per AF: ~$1,626 (118% margin)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>Strong unit economics support scalability and resilience</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Business Model */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24">

          <h2 className="text-4xl font-bold mb-10 text-white">Business Model: Three Revenue Streams</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-amber-400 text-2xl font-bold mb-3">+$</p>
              <h3 className="text-xl font-bold text-white mb-3">Higher Value Crops</h3>
              <p className="text-white/60">Improved environment conditions increase yields and enable upgrade to higher value-add crops.</p>
            </div>
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-amber-400 text-2xl font-bold mb-3">+$$</p>
              <h3 className="text-xl font-bold text-white mb-3">Land Value Increase</h3>
              <p className="text-white/60">Infrastructure improvements drive higher land values for resale and initial investment recoup.</p>
            </div>
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-amber-400 text-2xl font-bold mb-3">+$$$</p>
              <h3 className="text-xl font-bold text-white mb-3">Water Rights Sales</h3>
              <p className="text-white/60">Reduction in freshwater consumption enables resale at 99% margins for environmental regulation.</p>
            </div>
          </div>
          <div className="mt-8 p-8 rounded-2xl bg-gradient-to-r from-blue-500/20 to-teal-500/20 border border-blue-400/30">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-sm text-white/60 uppercase tracking-wider mb-2">Regenerative Agriculture</p>
                <p className="text-green-400 font-semibold">Builds resilient food systems</p>
              </div>
              <div>
                <p className="text-sm text-white/60 uppercase tracking-wider mb-2">Economic Value</p>
                <p className="text-green-400 font-semibold">Creates multiple revenue streams</p>
              </div>
              <div>
                <p className="text-sm text-white/60 uppercase tracking-wider mb-2">Water Security</p>
                <p className="text-green-400 font-semibold">Protects and conserves resources</p>
              </div>
              <div>
                <p className="text-sm text-white/60 uppercase tracking-wider mb-2">Global Impact</p>
                <p className="text-green-400 font-semibold">Solutions for a sustainable future</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24">

          <h2 className="text-4xl font-bold mb-10 text-white">Leadership Team</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">Jason McBride</h3>
              <p className="text-amber-400 text-sm font-semibold mb-3">CEO, Design & Ops</p>
              <ul className="text-white/60 text-sm space-y-1">
                <li>• UCLA – MBA</li>
                <li>• Georgia Tech – Industrial Engineering</li>
                <li>• Toshiba, Kioxia, SanDisk</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">Bobby Gonzalez</h3>
              <p className="text-amber-400 text-sm font-semibold mb-3">COO, Infrastructure/Construction</p>
              <ul className="text-white/60 text-sm space-y-1">
                <li>• UCLA – MBA</li>
                <li>• MS C.E., M.B.A., P.E.</li>
                <li>• $B+ megaproject experience at AECOM, US Army</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">Charlie Paton</h3>
              <p className="text-amber-400 text-sm font-semibold mb-3">Advisor, Technology</p>
              <ul className="text-white/60 text-sm space-y-1">
                <li>• Founder of Seawater Greenhouse LLC</li>
                <li>• Pioneered saltwater cooling technology</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">Jairo Diaz-Ramirez</h3>
              <p className="text-amber-400 text-sm font-semibold mb-3">Advisor, Agricultural Operations</p>
              <ul className="text-white/60 text-sm space-y-1">
                <li>• UC Desert Research Center Director</li>
                <li>• PhD in Water Resources & Agricultural Technology</li>
              </ul>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}