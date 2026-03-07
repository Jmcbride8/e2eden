import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Wrench, Leaf, MapPin, ArrowLeft, Plus, Pencil, Trash2, GripVertical, Building2, Globe, Mail, Phone, ExternalLink } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPageUrl } from "../utils";
import ProjectEditModal from "../components/projects/ProjectEditModal";
import CompanyEditModal from "../components/projects/CompanyEditModal";
import { toast } from "sonner";

const typeConfig = {
  engineering: { icon: Wrench, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  farming: { icon: Leaf, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
};

export default function Projects() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("projects");
  const [editingProject, setEditingProject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('sort_order'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Project.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setShowAddModal(false);
      toast.success("Project created successfully");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Project.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setEditingProject(null);
      toast.success("Project updated successfully");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Project.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success("Project deleted successfully");
    },
  });

  const handleSave = async (data) => {
    if (editingProject) {
      await updateMutation.mutateAsync({ id: editingProject.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteMutation.mutate(id);
    }
  };

  // Company queries & mutations
  const { data: companies = [], isLoading: companiesLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: () => base44.entities.Company.list('name'),
  });

  const createCompanyMutation = useMutation({
    mutationFn: (data) => base44.entities.Company.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['companies'] }); setShowAddCompanyModal(false); toast.success("Company created"); },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Company.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['companies'] }); setEditingCompany(null); toast.success("Company updated"); },
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: (id) => base44.entities.Company.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['companies'] }); toast.success("Company deleted"); },
  });

  const handleSaveCompany = async (data) => {
    if (editingCompany) {
      await updateCompanyMutation.mutateAsync({ id: editingCompany.id, data });
    } else {
      await createCompanyMutation.mutateAsync(data);
    }
  };

  const handleDeleteCompany = (id) => {
    if (confirm("Are you sure you want to delete this company?")) {
      deleteCompanyMutation.mutate(id);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update sort_order for all projects
    const updates = items.map((project, index) => 
      base44.entities.Project.update(project.id, { sort_order: index })
    );
    
    await Promise.all(updates);
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  };

  // Group projects by location
  const groupedProjects = projects.reduce((acc, project) => {
    const key = `${project.location}, ${project.country}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(project);
    return acc;
  }, {});

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen p-6 sm:p-8 pt-24 sm:pt-28">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link to={createPageUrl("Home")}>
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/[0.08]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Globe
            </Button>
          </Link>
          {isAdmin && activeTab === "projects" && (
            <Button onClick={() => setShowAddModal(true)} className="ml-auto bg-amber-500 hover:bg-amber-600 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Project
            </Button>
          )}
          {isAdmin && activeTab === "companies" && (
            <Button onClick={() => setShowAddCompanyModal(true)} className="ml-auto bg-amber-500 hover:bg-amber-600 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Company
            </Button>
          )}
        </div>

        {/* Tab selector */}
        <div className="mb-8">
          <div className="inline-flex rounded-xl bg-white/5 border border-white/10 p-1 gap-1 mb-6">
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "projects" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "text-white/50 hover:text-white/80"}`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab("companies")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "companies" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "text-white/50 hover:text-white/80"}`}
            >
              Companies
            </button>
          </div>
          {activeTab === "projects" && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">All Projects</h2>
              <p className="text-white/40">Browse our complete portfolio of engineering and farming initiatives worldwide</p>
            </div>
          )}
          {activeTab === "companies" && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Companies</h2>
              <p className="text-white/40">Partners, investors, and collaborators in our network</p>
            </div>
          )}
        </div>

        {activeTab === "projects" && isLoading && (
          <div className="text-white/40 text-center py-12">Loading projects...</div>
        )}
        {activeTab === "projects" && !isLoading && projects.length === 0 && (
          <div className="text-white/40 text-center py-12">
            No projects yet. {isAdmin && "Click 'Add Project' to create one."}
          </div>
        )}
        {activeTab === "projects" && !isLoading && projects.length > 0 && (
          <div className="bg-white/[0.04] border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {isAdmin && <th className="w-12"></th>}
                  <th className="text-left px-6 py-4 text-sm font-semibold text-white/70">Image</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-white/70">Project</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-white/70">Company</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-white/70">Type</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-white/70">Location</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-white/70">Year</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-white/70">Status</th>
                  {isAdmin && <th className="text-right px-6 py-4 text-sm font-semibold text-white/70">Actions</th>}
                </tr>
              </thead>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="projects">
                  {(provided) => (
                    <tbody ref={provided.innerRef} {...provided.droppableProps}>
                      {projects.map((project, index) => {
                        const rawTypes = Array.isArray(project.type) ? project.type : [project.type].filter(Boolean);
                        const types = rawTypes.filter(t => ['Farming', 'Tunnels', 'Minerals'].includes(t));
                        return (
                          <Draggable key={project.id} draggableId={project.id} index={index} isDragDisabled={!isAdmin}>
                            {(provided, snapshot) => (
                              <tr
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                                  snapshot.isDragging ? 'bg-white/[0.05]' : ''
                                }`}
                              >
                                {isAdmin && (
                                  <td className="px-2">
                                    <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing text-white/40 hover:text-white/70">
                                      <GripVertical className="w-5 h-5" />
                                    </div>
                                  </td>
                                )}
                                <td className="px-6 py-4">
                                  {project.hero_image ? (
                                    <img 
                                      src={project.hero_image} 
                                      alt={project.name}
                                      className="w-16 h-16 object-cover rounded-lg"
                                      style={{ objectPosition: project.hero_image_position || 'center center' }}
                                    />
                                  ) : (
                                    <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center">
                                      <MapPin className="w-6 h-6 text-white/20" />
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm font-medium text-white">{project.name}</div>
                                  <div className="text-xs text-white/40 mt-1 line-clamp-1">{project.description}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                                    project.company === 'Seawater Greenhouse'
                                      ? 'bg-blue-500/10 text-blue-400'
                                      : 'bg-amber-500/10 text-amber-400'
                                  }`}>
                                    {project.company || 'E2Eden'}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-wrap gap-1">
                                    {types.map((type) => {
                                      const Icon = type === 'Farming' ? Leaf : Wrench;
                                      const color = type === 'Farming' ? 'text-emerald-400' : type === 'Tunnels' ? 'text-amber-400' : 'text-purple-400';
                                      const bg = type === 'Farming' ? 'bg-emerald-500/10' : type === 'Tunnels' ? 'bg-amber-500/10' : 'bg-purple-500/10';
                                      return (
                                        <Badge key={type} className={`${bg} ${color} text-xs px-2 py-0.5 border-0 flex items-center gap-1`}>
                                          <Icon className="w-3 h-3" />
                                          {type}
                                        </Badge>
                                      );
                                    })}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-white/70">{project.location}</div>
                                  <div className="text-xs text-white/40">{project.country}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-white/70">{project.year || '-'}</td>
                                <td className="px-6 py-4">
                                  <Badge className={`text-xs ${
                                    project.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                                    project.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                                    'bg-amber-500/20 text-amber-400'
                                  }`}>
                                    {project.status}
                                  </Badge>
                                </td>
                                {isAdmin && (
                                  <td className="px-6 py-4">
                                    <div className="flex gap-2 justify-end">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setEditingProject(project)}
                                        className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10"
                                      >
                                        <Pencil className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(project.id)}
                                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </td>
                                )}
                              </tr>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
              </DragDropContext>
            </table>
          </div>
        ))}

        {activeTab === "companies" && companiesLoading && (
          <div className="text-white/40 text-center py-12">Loading companies...</div>
        )}
        {activeTab === "companies" && !companiesLoading && companies.length === 0 && (
          <div className="text-white/40 text-center py-12">
            No companies yet. {isAdmin && "Click 'Add Company' to create one."}
          </div>
        )}
        {activeTab === "companies" && !companiesLoading && companies.length > 0 && (
            <div className="bg-white/[0.04] border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white/70">Logo</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white/70">Company</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white/70">Type</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white/70">Owner</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white/70">Contact</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white/70">Country</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white/70">Status</th>
                    {isAdmin && <th className="text-right px-6 py-4 text-sm font-semibold text-white/70">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        {company.logo_url ? (
                          <img src={company.logo_url} alt={company.name} className="w-12 h-12 object-contain rounded-lg bg-white/5 p-1" />
                        ) : (
                          <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white/20" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{company.name}</div>
                        {company.full_brand_name && company.full_brand_name !== company.name && (
                          <div className="text-xs text-white/40 mt-0.5">{company.full_brand_name}</div>
                        )}
                        {company.website && (
                          <a href={company.website} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-amber-400/70 hover:text-amber-400 flex items-center gap-1 mt-0.5">
                            <ExternalLink className="w-3 h-3" /> {company.website.replace(/^https?:\/\//, '')}
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-blue-500/10 text-blue-400 text-xs border-0">{company.type || "—"}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70">{company.owner || "—"}</td>
                      <td className="px-6 py-4">
                        {company.contact_name && <div className="text-sm text-white/70">{company.contact_name}</div>}
                        {company.contact_email && (
                          <a href={`mailto:${company.contact_email}`} className="text-xs text-white/40 hover:text-white/70 flex items-center gap-1">
                            <Mail className="w-3 h-3" />{company.contact_email}
                          </a>
                        )}
                        {company.contact_phone && (
                          <div className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" />{company.contact_phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/60">{company.country || "—"}</td>
                      <td className="px-6 py-4">
                        <Badge className={`text-xs border-0 ${
                          company.status === "active" ? "bg-emerald-500/20 text-emerald-400" :
                          company.status === "inactive" ? "bg-red-500/20 text-red-400" :
                          "bg-amber-500/20 text-amber-400"
                        }`}>
                          {company.status || "active"}
                        </Badge>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="icon" onClick={() => setEditingCompany(company)}
                              className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteCompany(company.id)}
                              className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        )}
      </div>
      {(showAddModal || editingProject) && (
        <ProjectEditModal
          project={editingProject}
          onClose={() => { setShowAddModal(false); setEditingProject(null); }}
          onSave={handleSave}
        />
      )}

      {(showAddCompanyModal || editingCompany) && (
        <CompanyEditModal
          company={editingCompany}
          onClose={() => { setShowAddCompanyModal(false); setEditingCompany(null); }}
          onSave={handleSaveCompany}
        />
      )}
    </div>
  );
}