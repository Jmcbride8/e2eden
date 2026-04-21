import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Building2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import DonationModal from "../components/funding/DonationModal";
import ContactModal from "../components/contact/ContactModal";

export default function Funding() {
  const [donationModal, setDonationModal] = useState({ isOpen: false, projectName: null });
  const [contactModal, setContactModal] = useState({ isOpen: false, defaultReason: "" });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('sort_order'),
  });

  const usePilotProject = projects.find(p => p.name && p.name.toLowerCase().includes('imperial valley'));

  const costData = [
    { name: "Infrastructure & Equipment", value: 2500000, fill: "#F59E0B" },
    { name: "Operations & Labor", value: 1500000, fill: "#FBBF24" },
    { name: "Research & Monitoring", value: 750000, fill: "#FCD34D" },
    { name: "Contingency & Admin", value: 250000, fill: "#FEF08A" }
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
            Funding & Investment
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Join us in creating sustainable solutions that benefit both people and planet.
            Every investment drives measurable environmental and social impact.
          </p>
        </motion.div>

        {/* Capital Raise Sections */}
        <div className="space-y-16">
         {/* $50K PoC Farm */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.3 }}
           className="mb-16"
         >
           <h2 className="text-3xl font-bold text-white mb-8">Capital Raise: Proof of Concept Farm</h2>
           
           {/* Main Content Grid */}
           <div className="grid lg:grid-cols-2 gap-8">
             {/* Left: Hero Image */}
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.4 }}
               className="rounded-2xl overflow-hidden border border-white/10 h-96 lg:h-full min-h-96"
             >
               <img 
                 src="https://media.base44.com/images/public/6993b7c68cee7955d3266d09/49ed4c6ca_ChatGPTImageApr21202603_30_44PM.png"
                 alt="Proof of Concept Farm"
                 className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
               />
             </motion.div>

             {/* Right: Content */}
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.4 }}
               className="relative group"
             >
               <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 h-full flex flex-col">
                 <div className="mb-8">
                   <div className="text-4xl font-bold text-amber-400 mb-2">$50,000</div>
                   <p className="text-white/70">Initial Proof of Concept Deployment</p>
                 </div>

                 {/* Donut Chart */}
                 <div className="mb-8 flex justify-center">
                   <ResponsiveContainer width="100%" height={220}>
                     <PieChart>
                       <Pie
                         data={[
                           { name: "Equipment & Setup", value: 25000, fill: "#F59E0B" },
                           { name: "Operations", value: 15000, fill: "#FBBF24" },
                           { name: "Monitoring & Analysis", value: 10000, fill: "#FCD34D" }
                         ]}
                         cx="50%"
                         cy="50%"
                         innerRadius={50}
                         outerRadius={80}
                         paddingAngle={2}
                         dataKey="value"
                       >
                         <Cell fill="#F59E0B" />
                         <Cell fill="#FBBF24" />
                         <Cell fill="#FCD34D" />
                       </Pie>
                       <Tooltip 
                         formatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                         contentStyle={{ 
                           backgroundColor: "#000000", 
                           border: "2px solid #F59E0B",
                           borderRadius: "8px",
                           padding: "12px 16px"
                         }}
                         labelStyle={{ color: "#FFFFFF", fontWeight: "700", fontSize: "16px" }}
                         wrapperStyle={{ outline: "none" }}
                       />
                     </PieChart>
                   </ResponsiveContainer>
                 </div>

                 <div className="pt-6 border-t border-white/10">
                   <p className="text-white/70 mb-4 text-sm">
                     Validate core technology with a small-scale deployment to prove concept viability and gather essential performance data.
                   </p>
                   <button
                     onClick={() => setContactModal({ isOpen: true, defaultReason: "Venture Investment" })}
                     className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors w-full"
                   >
                     Contact Investment Team
                   </button>
                 </div>
               </div>
             </motion.div>
           </div>
         </motion.div>

         {/* $5M USA Pilot */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.5 }}
           className="mb-16"
         >
           <h2 className="text-3xl font-bold text-white mb-8">Capital Raise: USA Pilot Project</h2>

           {/* Main Content Grid */}
           <div className="grid lg:grid-cols-2 gap-8">
             {/* Left: Hero Image */}
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.6 }}
               className="rounded-2xl overflow-hidden border border-white/10 h-96 lg:h-full min-h-96"
             >
               <img 
                 src="https://media.base44.com/images/public/6993b7c68cee7955d3266d09/c77b2ee30_ChatGPTImageApr21202603_25_40PM.png"
                 alt="USA Pilot Project"
                 className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
               />
             </motion.div>

             {/* Right: Content */}
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.4 }}
               className="relative group"
             >
               <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 h-full flex flex-col">
                 <div className="mb-8">
                   <div className="text-4xl font-bold text-amber-400 mb-2">$5,000,000</div>
                   <p className="text-white/70">Total Capital Target for Imperial Valley Pilot Deployment</p>
                 </div>

                 {/* Donut Chart */}
                 <div className="mb-8 flex justify-center">
                   <ResponsiveContainer width="100%" height={250}>
                     <PieChart>
                       <Pie
                         data={costData}
                         cx="50%"
                         cy="50%"
                         innerRadius={60}
                         outerRadius={90}
                         paddingAngle={2}
                         dataKey="value"
                       >
                         {costData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.fill} />
                         ))}
                       </Pie>
                       <Tooltip 
                         formatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                         contentStyle={{ 
                           backgroundColor: "#000000", 
                           border: "2px solid #F59E0B",
                           borderRadius: "8px",
                           padding: "12px 16px"
                         }}
                         labelStyle={{ color: "#FFFFFF", fontWeight: "700", fontSize: "16px" }}
                         wrapperStyle={{ outline: "none" }}
                       />
                     </PieChart>
                   </ResponsiveContainer>
                 </div>

                 <div className="pt-6 border-t border-white/10 mt-auto">
                   <p className="text-white/70 mb-4 text-sm">
                     This proof-of-concept deployment will validate technology performance, demonstrate economic viability, and establish a blueprint for global scaling.
                   </p>
                   <button
                     onClick={() => setContactModal({ isOpen: true, defaultReason: "Venture Investment" })}
                     className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors w-full"
                   >
                     Contact Investment Team
                   </button>
                 </div>
               </div>
             </motion.div>
           </div>

           {/* Cost Breakdown Below */}
           <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all">
               <h4 className="text-white font-semibold mb-2 text-sm">Infrastructure & Equipment</h4>
               <p className="text-amber-400 text-lg font-bold">$2.5M</p>
               <p className="text-white/60 text-xs mt-1">Cooling walls, irrigation & facility</p>
             </div>
             <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all">
               <h4 className="text-white font-semibold mb-2 text-sm">Operations & Labor</h4>
               <p className="text-amber-400 text-lg font-bold">$1.5M</p>
               <p className="text-white/60 text-xs mt-1">18-month operations & staffing</p>
             </div>
             <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all">
               <h4 className="text-white font-semibold mb-2 text-sm">Research & Monitoring</h4>
               <p className="text-amber-400 text-lg font-bold">$750K</p>
               <p className="text-white/60 text-xs mt-1">Data collection & verification</p>
             </div>
             <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all">
               <h4 className="text-white font-semibold mb-2 text-sm">Contingency & Admin</h4>
               <p className="text-amber-400 text-lg font-bold">$250K</p>
               <p className="text-white/60 text-xs mt-1">Risk mitigation & administration</p>
             </div>
           </div>
         </motion.div>
        </div>
      </div>

      <DonationModal
        isOpen={donationModal.isOpen}
        onClose={() => setDonationModal({ isOpen: false, projectName: null })}
        projectName={donationModal.projectName}
      />
      <ContactModal
        isOpen={contactModal.isOpen}
        onClose={() => setContactModal({ isOpen: false, defaultReason: "" })}
        defaultReason={contactModal.defaultReason}
      />
    </div>
  );
}