import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Wrench, Leaf, MapPin, Calendar, Users, ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPageUrl } from "../utils";
import ProjectEditModal from "../components/projects/ProjectEditModal";
import { toast } from "sonner";

const typeConfig = {
  engineering: { icon: Wrench, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  farming: { icon: Leaf, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
};

export default function Projects() {
  const [user, setUser] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
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
          {isAdmin && (
            <Button
              onClick={() => setShowAddModal(true)}
              className="ml-auto bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/aba199569_Brand_Yellow.png"
              alt="E2Eden"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">E2Eden</h1>
              <p className="text-sm text-white/40">The Next Green Revolution</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">All Projects</h2>
          <p className="text-white/40">Browse our complete portfolio of engineering and farming initiatives worldwide</p>
        </div>

        {isLoading ? (
          <div className="text-white/40 text-center py-12">Loading projects...</div>
        ) : Object.keys(groupedProjects).length === 0 ? (
          <div className="text-white/40 text-center py-12">
            No projects yet. {isAdmin && "Click 'Add Project' to create one."}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedProjects).map(([location, locationProjects]) => (
              <Card key={location} className="bg-white/[0.04] border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-400" />
                    {location}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {locationProjects.map((project) => {
                      const config = typeConfig[project.type];
                      const Icon = config.icon;
                      return (
                        <div
                          key={project.id}
                          className={`relative p-4 rounded-xl border ${config.border} ${config.bg} backdrop-blur-sm`}
                        >
                          {isAdmin && (
                            <div className="absolute top-2 right-2 flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingProject(project)}
                                className="h-6 w-6 text-white/40 hover:text-white hover:bg-white/10"
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(project.id)}
                                className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`p-2 rounded-lg ${config.bg} border ${config.border}`}>
                              <Icon className={`w-4 h-4 ${config.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-white mb-1">{project.name}</h4>
                              <Badge className={`${config.bg} ${config.color} text-[10px] px-1.5 py-0 border-0`}>
                                {project.type}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-white/50 leading-relaxed mb-3">{project.description}</p>
                          <div className="flex items-center gap-3 text-[11px] text-white/35">
                            {project.year && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {project.year}
                              </span>
                            )}
                            {project.team && (
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {project.team}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {(showAddModal || editingProject) && (
        <ProjectEditModal
          project={editingProject}
          onClose={() => {
            setShowAddModal(false);
            setEditingProject(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}