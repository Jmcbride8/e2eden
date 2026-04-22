import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Pencil, Check, X, Plus, Trash2 } from "lucide-react";
import DonationModal from "../components/funding/DonationModal";
import ContactModal from "../components/contact/ContactModal";

const FILLS = ["#F59E0B", "#FBBF24", "#FCD34D", "#FEF08A", "#D97706", "#B45309"];

const TOOLTIP_STYLE = {
  contentStyle: { backgroundColor: "#000", border: "1.5px solid #F59E0B", borderRadius: "8px", padding: "10px 14px" },
  labelStyle: { color: "#fff", fontWeight: "700", fontSize: "14px" },
  itemStyle: { color: "#F59E0B", fontWeight: "600" },
  wrapperStyle: { outline: "none" },
};

function formatAmount(value, raise) {
  if (raise === "poc") return `$${(value / 1000).toFixed(0)}K`;
  return value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` : `$${(value / 1000).toFixed(0)}K`;
}

function EditableBreakdown({ items, raise, isAdmin, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(items);

  useEffect(() => { setDraft(items); }, [items]);

  const updateDraft = (idx, field, val) => {
    setDraft(prev => prev.map((it, i) => i === idx ? { ...it, [field]: val } : it));
  };
  const removeDraft = (idx) => setDraft(prev => prev.filter((_, i) => i !== idx));
  const addDraft = () => setDraft(prev => [...prev, { label: "New Category", amount: 0, color: FILLS[prev.length % FILLS.length], raise, sort_order: prev.length + 1 }]);

  const handleSave = () => { onSave(draft); setEditing(false); };
  const handleCancel = () => { setDraft(items); setEditing(false); };

  return (
    <div className="mt-8 space-y-2">
      {(editing ? draft : items).map((item, idx) => (
        <div key={idx} className="flex items-center justify-between text-sm gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
            {editing ? (
              <input
                className="bg-white/10 text-white text-sm rounded px-2 py-0.5 border border-white/20 focus:outline-none focus:border-amber-400 flex-1 min-w-0"
                value={item.label}
                onChange={e => updateDraft(idx, "label", e.target.value)}
              />
            ) : (
              <span className="text-white/60 truncate">{item.label}</span>
            )}
          </div>
          {editing ? (
            <div className="flex items-center gap-1">
              <span className="text-white/50 text-xs">$</span>
              <input
                type="number"
                className="bg-white/10 text-white text-sm rounded px-2 py-0.5 border border-white/20 focus:outline-none focus:border-amber-400 w-28"
                value={item.amount}
                onChange={e => updateDraft(idx, "amount", Number(e.target.value))}
              />
              <button onClick={() => removeDraft(idx)} className="text-red-400 hover:text-red-300 ml-1">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <span className="text-white font-semibold flex-shrink-0">{formatAmount(item.amount, raise)}</span>
          )}
        </div>
      ))}

      {isAdmin && (
        <div className="pt-3 flex items-center gap-2">
          {editing ? (
            <>
              <button onClick={addDraft} className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add row
              </button>
              <div className="flex-1" />
              <button onClick={handleCancel} className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors">
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button onClick={handleSave} className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition-colors">
                <Check className="w-3.5 h-3.5" /> Save
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-xs text-white/30 hover:text-amber-400 transition-colors">
              <Pencil className="w-3 h-3" /> Edit breakdown
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function CapitalRaiseCard({ delay, image, tag, amount, subtitle, description, items, raise, isAdmin, onSaveItems, onContact }) {
  const chartData = items.map(it => ({ name: it.label, value: it.amount, fill: it.color }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
      className="relative rounded-3xl overflow-hidden border border-white/10 group"
    >
      <div className="absolute inset-0">
        <img src={image} alt={tag} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
      </div>

      <div className="relative z-10 grid lg:grid-cols-2 min-h-[520px]">
        {/* Left */}
        <div className="flex flex-col justify-between p-10 lg:p-14">
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-400 border border-amber-400/40 bg-amber-400/10 px-3 py-1 rounded-full mb-6">
              {tag}
            </span>
            <div className="text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight">{amount}</div>
            <p className="text-white/60 text-base mb-8 max-w-xs">{subtitle}</p>
            <p className="text-white/80 text-sm leading-relaxed max-w-sm">{description}</p>
          </div>

          <EditableBreakdown items={items} raise={raise} isAdmin={isAdmin} onSave={onSaveItems} />

          <button
            onClick={onContact}
            className="mt-10 self-start px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30"
          >
            Contact Investment Team →
          </button>
        </div>

        {/* Right: Chart */}
        <div className="hidden lg:flex items-center justify-center p-10">
          <div className="w-full max-w-xs">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [formatAmount(value, raise), name]} {...TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-white/40 text-xs mt-2 tracking-wide uppercase">Budget Allocation</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Funding() {
  const [donationModal, setDonationModal] = useState({ isOpen: false, projectName: null });
  const [contactModal, setContactModal] = useState({ isOpen: false, defaultReason: "" });
  const [isAdmin, setIsAdmin] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user && (user.role === "admin" || (user.company && user.company.toLowerCase().includes("e2eden")))) {
        setIsAdmin(true);
      }
    }).catch(() => {});
  }, []);

  const { data: fundingItems = [] } = useQuery({
    queryKey: ["funding-items"],
    queryFn: () => base44.entities.FundingItem.list("sort_order"),
  });

  const pocItems = fundingItems.filter(i => i.raise === "poc");
  const pilotItems = fundingItems.filter(i => i.raise === "pilot");

  const saveItems = async (raise, draft) => {
    const existing = fundingItems.filter(i => i.raise === raise);
    // Delete removed items
    for (const ex of existing) {
      if (!draft.find(d => d.id === ex.id)) {
        await base44.entities.FundingItem.delete(ex.id);
      }
    }
    // Update or create
    for (let i = 0; i < draft.length; i++) {
      const item = { ...draft[i], sort_order: i + 1, raise };
      if (item.id) {
        await base44.entities.FundingItem.update(item.id, { label: item.label, amount: item.amount, color: item.color, sort_order: item.sort_order });
      } else {
        await base44.entities.FundingItem.create({ raise, label: item.label, amount: item.amount, color: item.color, sort_order: item.sort_order });
      }
    }
    queryClient.invalidateQueries({ queryKey: ["funding-items"] });
  };

  const openContact = () => setContactModal({ isOpen: true, defaultReason: "Venture Investment" });

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-24 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-5 tracking-tight">Funding & Investment</h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Join us in creating sustainable solutions that benefit both people and planet.
            Every investment drives measurable environmental and social impact.
          </p>
        </motion.div>

        <div className="space-y-10">
          <CapitalRaiseCard
            delay={0.2}
            image="https://media.base44.com/images/public/6993b7c68cee7955d3266d09/49ed4c6ca_ChatGPTImageApr21202603_30_44PM.png"
            tag="Capital Raise · Proof of Concept"
            amount="$50,000"
            subtitle="Initial Proof of Concept Deployment"
            description="Validate core technology with a small-scale deployment to prove concept viability and gather essential performance data before scaling."
            items={pocItems}
            raise="poc"
            isAdmin={isAdmin}
            onSaveItems={(draft) => saveItems("poc", draft)}
            onContact={openContact}
          />
          <CapitalRaiseCard
            delay={0.35}
            image="https://media.base44.com/images/public/6993b7c68cee7955d3266d09/c77b2ee30_ChatGPTImageApr21202603_25_40PM.png"
            tag="Capital Raise · USA Pilot Project"
            amount="$5,000,000"
            subtitle="Imperial Valley Pilot Deployment"
            description="Validate technology performance at scale, demonstrate economic viability, and establish a repeatable blueprint for global expansion."
            items={pilotItems}
            raise="pilot"
            isAdmin={isAdmin}
            onSaveItems={(draft) => saveItems("pilot", draft)}
            onContact={openContact}
          />
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