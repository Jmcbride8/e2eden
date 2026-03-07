import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Clock, ChevronDown, ChevronRight, Plus, Pencil, Trash2, X, Save, LayoutList, BarChart2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import GanttChart from "../components/roadmap/GanttChart";

const PHASES = ["All", "R&D", "Commercialization", "Transformation"];

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/30", label: "Completed" },
  active:    { icon: Clock,         color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30", label: "In Progress" },
  planned:   { icon: Circle,        color: "text-blue-400",  bg: "bg-blue-500/20",  border: "border-blue-500/30",  label: "Planned" },
};

function MilestoneForm({ projectId, milestone, onSave, onCancel }) {
  const [form, setForm] = useState(
    milestone || { title: "", description: "", date: "", status: "planned", sort_order: 99 }
  );
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/20 space-y-3">
      <input
        className="w-full bg-white/10 text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:outline-none focus:border-amber-400/50"
        placeholder="Milestone title"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        className="w-full bg-white/10 text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:outline-none focus:border-amber-400/50 resize-none"
        placeholder="Description (optional)"
        rows={2}
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />
      <div className="flex gap-3">
        <input
          type="date"
          className="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:outline-none focus:border-amber-400/50"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
        />
        <select
          className="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:outline-none focus:border-amber-400/50"
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
        >
          <option value="planned">Planned</option>
          <option value="active">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="flex gap-2 justify-end">
        <Button size="sm" variant="ghost" onClick={onCancel} className="text-white/60 hover:text-white">
          <X className="w-4 h-4 mr-1" /> Cancel
        </Button>
        <Button
          size="sm"
          onClick={() => onSave({ ...form, project_id: projectId })}
          className="bg-amber-500 hover:bg-amber-600 text-white"
          disabled={!form.title.trim()}
        >
          <Save className="w-4 h-4 mr-1" /> Save
        </Button>
      </div>
    </div>
  );
}

function ProjectCard({ project, milestones, isAdmin, onMilestoneChange }) {
  const [expanded, setExpanded] = useState(false);
  const [addingMilestone, setAddingMilestone] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const queryClient = useQueryClient();

  const config = statusConfig[project.status] || statusConfig.planned;
  const Icon = config.icon;

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ProjectMilestone.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["milestones"] }); setAddingMilestone(false); }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ProjectMilestone.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["milestones"] }); setEditingMilestone(null); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ProjectMilestone.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["milestones"] })
  });

  const sortedMilestones = [...milestones].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all duration-300">
      {/* Project Header */}
      <button
        className="w-full text-left flex items-start gap-4 p-5 group"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Hero image thumbnail */}
        <div className="flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden bg-white/5">
          {project.hero_image && (
            <img
              src={project.hero_image}
              alt={project.name}
              className="w-full h-full object-cover"
              style={{ objectPosition: project.hero_image_position || "center center" }}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full ${config.bg} border ${config.border} flex-shrink-0`}>
              <Icon className={`w-3.5 h-3.5 ${config.color}`} />
            </div>
            <span className={`text-xs font-semibold uppercase tracking-wider ${config.color}`}>{config.label}</span>
            {project.year && <span className="text-xs text-white/30">{project.year}</span>}
          </div>
          <h3 className="text-lg font-bold text-white mt-1 leading-tight">{project.name}</h3>
          <p className="text-sm text-white/40 mt-0.5">{project.location}, {project.country}</p>
          {sortedMilestones.length > 0 && (
            <p className="text-xs text-amber-400/70 mt-1">{sortedMilestones.length} milestone{sortedMilestones.length !== 1 ? "s" : ""}</p>
          )}
        </div>

        <div className="flex-shrink-0 mt-1">
          {expanded
            ? <ChevronDown className="w-5 h-5 text-white/40" />
            : <ChevronRight className="w-5 h-5 text-white/40" />
          }
        </div>
      </button>

      {/* Expanded: description + milestones */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-white/10 pt-4 space-y-4">
              {project.description && (
                <p className="text-sm text-white/60 leading-relaxed">{project.description}</p>
              )}

              {/* Milestones */}
              {sortedMilestones.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Milestones</h4>
                  {sortedMilestones.map((ms) => {
                    const msCfg = statusConfig[ms.status] || statusConfig.planned;
                    const MsIcon = msCfg.icon;
                    return editingMilestone?.id === ms.id ? (
                      <MilestoneForm
                        key={ms.id}
                        projectId={project.id}
                        milestone={{ ...ms }}
                        onSave={(data) => updateMutation.mutate({ id: ms.id, data })}
                        onCancel={() => setEditingMilestone(null)}
                      />
                    ) : (
                      <div
                        key={ms.id}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] group/ms"
                      >
                        <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full ${msCfg.bg} border ${msCfg.border} flex items-center justify-center`}>
                          <MsIcon className={`w-3 h-3 ${msCfg.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-white">{ms.title}</span>
                            {ms.date && (
                              <span className="text-xs text-white/30">
                                {new Date(ms.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                              </span>
                            )}
                          </div>
                          {ms.description && (
                            <p className="text-xs text-white/50 mt-1 leading-relaxed">{ms.description}</p>
                          )}
                        </div>
                        {isAdmin && (
                          <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover/ms:opacity-100 transition-opacity">
                            <button onClick={() => setEditingMilestone(ms)} className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button onClick={() => deleteMutation.mutate(ms.id)} className="p-1 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add milestone */}
              {isAdmin && (
                addingMilestone ? (
                  <MilestoneForm
                    projectId={project.id}
                    onSave={(data) => createMutation.mutate(data)}
                    onCancel={() => setAddingMilestone(false)}
                  />
                ) : (
                  <button
                    onClick={() => setAddingMilestone(true)}
                    className="flex items-center gap-2 text-xs text-amber-400/70 hover:text-amber-400 transition-colors py-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Milestone
                  </button>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const COMPANY_LOGOS = {
  "E2Eden": "https://base44.app/api/apps/6993b7c68cee7955d3266d09/files/public/6993b7c68cee7955d3266d09/78e62a5b6_Brand_Yellow.png",
  "Seawater Greenhouse": "https://base44.app/api/apps/6993b7c68cee7955d3266d09/files/public/6993b7c68cee7955d3266d09/6120500fd_seawater_greenhouse_logo_white.png",
  "Global Green": "https://base44.app/api/apps/6993b7c68cee7955d3266d09/files/public/6993b7c68cee7955d3266d09/c0468d7cc_Global-Green-Logo.png",
};

export default function Roadmap() {
  const [selectedPhase, setSelectedPhase] = useState("R&D");
  const [viewMode, setViewMode] = useState("timeline"); // "timeline" | "gantt"
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    base44.auth.me().then(user => setIsAdmin(user?.role === "admin"));
  }, []);

  const { data: allProjects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => base44.entities.Project.list("sort_order"),
  });

  const { data: allMilestones = [] } = useQuery({
    queryKey: ["milestones"],
    queryFn: () => base44.entities.ProjectMilestone.list("sort_order"),
  });

  const phaseProjects = allProjects
    .filter(p => selectedPhase === "All" || p.phase === selectedPhase)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  const getMilestonesForProject = (projectId) =>
    allMilestones.filter(m => m.project_id === projectId);

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 sm:px-8 sm:pt-28">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">Roadmap</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            From pioneering research to global transformation — our journey to make deserts bloom.
          </p>
        </motion.div>

        {/* Controls Row: Phase Toggle + View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          {/* Phase toggle */}
          <div className="inline-flex rounded-xl bg-white/5 border border-white/10 p-1 gap-1">
            {PHASES.map(phase => (
              <button
                key={phase}
                onClick={() => setSelectedPhase(phase)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  selectedPhase === phase
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {phase}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="inline-flex rounded-xl bg-white/5 border border-white/10 p-1 gap-1">
            <button
              onClick={() => setViewMode("timeline")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                viewMode === "timeline"
                  ? "bg-white/15 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              <LayoutList className="w-4 h-4" /> Timeline
            </button>
            <button
              onClick={() => setViewMode("gantt")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                viewMode === "gantt"
                  ? "bg-white/15 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              <BarChart2 className="w-4 h-4" /> Gantt
            </button>
          </div>
        </motion.div>



        {/* Phase description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPhase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            {/* Phase label */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">{selectedPhase === "All" ? "All Phases" : `${selectedPhase} Phase`}</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {phaseProjects.length === 0 ? (
              <p className="text-center text-white/40 py-16">No projects in this phase yet.</p>
            ) : viewMode === "gantt" ? (
              /* Gantt Chart view */
              <GanttChart
                projects={phaseProjects}
                milestones={allMilestones.filter(m => phaseProjects.some(p => p.id === m.project_id))}
              />
            ) : (
              /* Timeline view */
              <div className="relative">
                {/* Center vertical line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2 hidden md:block" />

                <div className="space-y-10">
                  {phaseProjects.map((project, idx) => {
                    const isLeft = idx % 2 === 0;
                    return (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.08 }}
                        className="relative flex items-center md:grid md:grid-cols-2 md:gap-8"
                      >
                        {/* Left side */}
                        <div>
                          {isLeft ? (
                            <ProjectCard
                              project={project}
                              milestones={getMilestonesForProject(project.id)}
                              isAdmin={isAdmin}
                            />
                          ) : (
                            <div className="hidden md:block" />
                          )}
                        </div>

                        {/* Center logo node */}
                        <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-black border border-white/20 shadow-lg shadow-amber-500/20 hidden md:flex items-center justify-center z-10 overflow-hidden p-1">
                          <img
                            src={COMPANY_LOGOS[project.company] || COMPANY_LOGOS["E2Eden"]}
                            alt={project.company || "E2Eden"}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Right side */}
                        <div>
                          {!isLeft ? (
                            <ProjectCard
                              project={project}
                              milestones={getMilestonesForProject(project.id)}
                              isAdmin={isAdmin}
                            />
                          ) : (
                            <div className="hidden md:block" />
                          )}
                        </div>

                        {/* Mobile: full-width card with left line */}
                        <div className="md:hidden w-full pl-6 border-l border-amber-500/30 relative">
                          <div className="absolute left-0 top-4 w-3 h-3 rounded-full bg-amber-500 -translate-x-1.5" />
                          <ProjectCard
                            project={project}
                            milestones={getMilestonesForProject(project.id)}
                            isAdmin={isAdmin}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>


      </div>
    </div>
  );
}