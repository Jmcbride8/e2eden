import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Search, Phone, Mail, Globe, Calendar, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LeadModal from "../components/crm/LeadModal";

const leadTypeConfig = {
  "Customer": { color: "bg-blue-500/20 text-blue-300 border-blue-500/30", icon: "💼" },
  "Partnership": { color: "bg-purple-500/20 text-purple-300 border-purple-500/30", icon: "🤝" },
  "Investor": { color: "bg-green-500/20 text-green-300 border-green-500/30", icon: "💰" },
  "University": { color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30", icon: "🎓" },
  "Government": { color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30", icon: "🏛️" },
  "NGO/Foundation": { color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", icon: "🌍" },
  "Media/Reporter": { color: "bg-orange-500/20 text-orange-300 border-orange-500/30", icon: "📰" },
  "Supplier/Vendor": { color: "bg-amber-500/20 text-amber-300 border-amber-500/30", icon: "📦" },
  "Community Leader": { color: "bg-pink-500/20 text-pink-300 border-pink-500/30", icon: "👥" },
  "Consultant/Advisor": { color: "bg-violet-500/20 text-violet-300 border-violet-500/30", icon: "💡" }
};

export default function CRM() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list('-created_date'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Lead.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLead(null);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || lead.lead_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: leads.length,
    customers: leads.filter(l => l.lead_type === "Customer").length,
    investors: leads.filter(l => l.lead_type === "Investor").length,
    partnerships: leads.filter(l => l.lead_type === "Partnership").length
  };

  return (
    <div className="min-h-screen bg-black p-6 sm:p-8 pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to={createPageUrl("Home")}>
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/[0.08] mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2">CRM</h1>
            <p className="text-white/60">Manage leads and partnerships</p>
          </div>
          <Button 
            onClick={() => setShowModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Leads", value: stats.total, color: "text-white" },
            { label: "Customers", value: stats.customers, color: "text-blue-400" },
            { label: "Investors", value: stats.investors, color: "text-green-400" },
            { label: "Partnerships", value: stats.partnerships, color: "text-purple-400" }
          ].map((stat, idx) => (
            <Card key={idx} className="bg-white/[0.04] border-white/10 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/[0.04] border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 rounded-md bg-white/[0.04] border border-white/10 text-white text-sm [&>option]:bg-gray-900 [&>option]:text-white"
          >
            <option value="all" className="bg-gray-900 text-white">All Types</option>
            {Object.keys(leadTypeConfig).map((type) => (
              <option key={type} value={type} className="bg-gray-900 text-white">{type}</option>
            ))}
          </select>
        </div>

        {/* Leads Table */}
        {isLoading ? (
          <div className="text-white/60 text-center py-12">Loading...</div>
        ) : filteredLeads.length === 0 ? (
          <Card className="bg-white/[0.04] border-white/10 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <p className="text-white/40">No leads found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white/[0.04] border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/[0.04] border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Website</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Last Engaged</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-white/70 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredLeads.map((lead) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="text-white font-medium">{lead.name}</div>
                        {lead.company && (
                          <div className="text-sm text-white/50 mt-1">{lead.company}</div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {lead.lead_type && (
                          <Badge className={`${leadTypeConfig[lead.lead_type]?.color || "bg-gray-500/20 text-gray-300 border-gray-500/30"} text-xs border whitespace-nowrap`}>
                            {leadTypeConfig[lead.lead_type]?.icon} {lead.lead_type}
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {lead.email ? (
                          <a href={`mailto:${lead.email}`} className="text-sm text-white/70 hover:text-amber-400 transition-colors">
                            {lead.email}
                          </a>
                        ) : (
                          <span className="text-sm text-white/40">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {lead.website ? (
                          <a 
                            href={lead.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-1 text-sm text-white/70 hover:text-amber-400 transition-colors"
                          >
                            <Globe className="w-3 h-3" />
                            <span className="max-w-[150px] truncate">
                              {lead.website.replace(/^https?:\/\//, '')}
                            </span>
                          </a>
                        ) : (
                          <span className="text-sm text-white/40">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {lead.last_engaged ? (
                          <div className="flex items-center gap-1 text-sm text-white/70">
                            <Calendar className="w-3 h-3" />
                            {new Date(lead.last_engaged).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-sm text-white/40">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10"
                            onClick={() => handleEdit(lead)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white/40 hover:text-red-400 hover:bg-red-500/10"
                            onClick={() => handleDelete(lead.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <LeadModal
          lead={editingLead}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}