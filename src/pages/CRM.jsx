import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Search, Filter, Phone, Mail, Globe, Calendar, DollarSign, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LeadModal from "../components/crm/LeadModal";

const statusConfig = {
  new: { label: "New", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  contacted: { label: "Contacted", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  qualified: { label: "Qualified", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  proposal: { label: "Proposal", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  negotiation: { label: "Negotiation", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  closed_won: { label: "Closed Won", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  closed_lost: { label: "Closed Lost", color: "bg-red-500/20 text-red-400 border-red-500/30" }
};

const priorityConfig = {
  low: { color: "text-gray-400" },
  medium: { color: "text-amber-400" },
  high: { color: "text-red-400" }
};

export default function CRM() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === "new").length,
    qualified: leads.filter(l => l.status === "qualified").length,
    won: leads.filter(l => l.status === "closed_won").length
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
            { label: "Total Leads", value: stats.total, color: "text-blue-400" },
            { label: "New", value: stats.new, color: "text-purple-400" },
            { label: "Qualified", value: stats.qualified, color: "text-cyan-400" },
            { label: "Won", value: stats.won, color: "text-emerald-400" }
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-md bg-white/[0.04] border border-white/10 text-white text-sm"
          >
            <option value="all">All Status</option>
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>

        {/* Leads Grid */}
        {isLoading ? (
          <div className="text-white/60 text-center py-12">Loading...</div>
        ) : filteredLeads.length === 0 ? (
          <Card className="bg-white/[0.04] border-white/10 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <p className="text-white/40">No leads found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLeads.map((lead) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-white/[0.04] border-white/10 backdrop-blur-sm hover:bg-white/[0.06] transition-colors h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg mb-2">{lead.name}</CardTitle>
                        <Badge className={`${statusConfig[lead.status]?.color || statusConfig.new.color} text-xs border`}>
                          {statusConfig[lead.status]?.label || "New"}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
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
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {lead.contact_person && (
                      <div className="text-sm text-white/60">{lead.contact_person}</div>
                    )}
                    {lead.company && (
                      <div className="text-sm text-white/50">{lead.company}</div>
                    )}
                    {lead.email && (
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Mail className="w-4 h-4 text-white/40" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                    )}
                    {lead.phone && (
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Phone className="w-4 h-4 text-white/40" />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                    {lead.website && (
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Globe className="w-4 h-4 text-white/40" />
                        <a href={lead.website} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors truncate">
                          {lead.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                    {lead.next_follow_up && (
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Calendar className="w-4 h-4 text-white/40" />
                        <span>Follow up: {new Date(lead.next_follow_up).toLocaleDateString()}</span>
                      </div>
                    )}
                    {lead.estimated_value && (
                      <div className="flex items-center gap-2 text-sm text-emerald-400">
                        <DollarSign className="w-4 h-4" />
                        <span>${lead.estimated_value.toLocaleString()}</span>
                      </div>
                    )}
                    {lead.priority && (
                      <div className={`text-xs ${priorityConfig[lead.priority]?.color || 'text-white/40'}`}>
                        Priority: {lead.priority.toUpperCase()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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