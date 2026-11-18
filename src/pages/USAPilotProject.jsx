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

  const unitEconomics = [
    { metric: 'Modeled Cost per Acre-Foot', value: '~$1,374' },
    { metric: 'Alternative Supply Benchmark', value: '~$3,000/AF' },
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
            <p className="text-2xl font-bold text-white mb-4">Cool the air to reduce irrigation demand</p>
            <p className="text-white/60 text-lg">Hot, dry air increases the rate at which water evaporates from soil and leaves. The pilot will measure whether cooler, more humid air translates into net freshwater savings under field conditions.</p>
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
              <p className="text-white/60 text-sm mt-2">Illustrative outlet temperature, not a field result</p>
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

          <h2 className="text-4xl font-bold mb-10 text-white">Deployment Plan</h2>
          <div className="space-y-6">
            {[
              ['01', 'Grant-Supported Proof of Concept', 'Start with a small, instrumented field trial at a site still to be confirmed. Measure the strength and reach of cooling and check salt and brine management before committing to a larger crop trial. Grant funding is being pursued, not assumed.'],
              ['02', 'UC DREC Pilot and Conservation Eligibility', 'The proposed follow-on trial at UC Desert Research & Extension Center in Holtville would compare cooled and untreated plots. Independently measured net freshwater savings and crop economics would support a case for rebate eligibility with the Imperial Irrigation District and other water managers. No approval, rate or payment is assumed.'],
              ['03', 'Specialty Crops First, Field Crops Later', 'Start commercially with high-value, heat-sensitive crops. Test whether buffering peak temperatures extends the season, preserves quality or allows an extra harvest. Expand to larger-acreage field crops once the specialty-crop model works and a conservation payment mechanism is established.'],
            ].map(([number, title, description]) => (
              <div key={number} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
                <span className="shrink-0 text-sm text-amber-400 font-semibold">{number}</span>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                  <p className="text-white/70 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
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
              <h3 className="text-2xl font-bold text-white mb-4">Planning Assumptions, Not Rebate Rates</h3>
              <p className="text-white/70 leading-relaxed">The Saltwater Farms deck compares an illustrative cooling-wall cost with the cost of alternative water supply. Neither number is measured pilot performance or an IID payment rate. The research pilot would estimate the actual cost per acre-foot of net freshwater conserved and test payback both with and without conservation payments.</p>
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

          <h2 className="text-4xl font-bold mb-10 text-white">Business Model: Crop Value and Water Savings</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-amber-400 text-2xl font-bold mb-3">+$</p>
              <h3 className="text-xl font-bold text-white mb-3">Higher Value Crops</h3>
              <p className="text-white/60">Buffering peak heat could protect crop quality, extend the growing window, and allow additional harvests for some specialty crops.</p>
            </div>
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-amber-400 text-2xl font-bold mb-3">+$$</p>
              <h3 className="text-xl font-bold text-white mb-3">Land Value Increase</h3>
              <p className="text-white/60">A more reliable growing window could improve the value of usable acreage, but potential land appreciation is not assumed in the pilot economics.</p>
            </div>
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-amber-400 text-2xl font-bold mb-3">+$$$</p>
              <h3 className="text-xl font-bold text-white mb-3">Conservation Payments</h3>
              <p className="text-white/60">If a district recognizes the practice and pays for verified freshwater savings, that revenue could help growers recover installation costs. The project does not assume approval or a sale of water rights.</p>
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