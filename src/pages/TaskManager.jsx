import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeft, Plus, CheckCircle2, Clock, AlertCircle, MoreVertical, Edit2, Trash2 } from "lucide-react";
import TaskEditModal from "../components/TaskEditModal";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { format } from "date-fns";

export default function TaskManager() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCompany, setFilterCompany] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigned_to: "",
    assigned_company: "",
    priority: "",
    due_date: "",
  });

  const queryClient = useQueryClient();

  React.useEffect(() => {
    const loadUser = async () => {
      const user = await base44.auth.me();
      setCurrentUser(user);
    };
    loadUser();
  }, []);

  const { data: allTasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.Task.list('-created_date'),
    enabled: !!currentUser,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
    enabled: !!currentUser,
  });

  const createTaskMutation = useMutation({
    mutationFn: (data) => base44.entities.Task.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setShowForm(false);
      setFormData({ title: "", description: "", assigned_to: "", assigned_company: "", priority: "", due_date: "" });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Task.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createTaskMutation.mutate(formData);
  };

  const handleStatusChange = (task, newStatus) => {
    updateTaskMutation.mutate({ id: task.id, data: { status: newStatus } });
  };

  // Filter tasks based on user permissions
  const filteredTasks = allTasks.filter(task => {
    // Admin sees all
    if (currentUser?.role === 'admin') {
      const companyMatch = filterCompany === "all" || task.assigned_company === filterCompany;
      const statusMatch = filterStatus === "all" || task.status === filterStatus;
      return companyMatch && statusMatch;
    }
    
    // Regular users only see tasks where:
    // 1. They created it
    // 2. It's assigned to them
    // 3. It's assigned to their company
    const isCreator = task.created_by === currentUser?.email;
    const isAssignedToMe = task.assigned_to === currentUser?.email;
    const isMyCompany = task.assigned_company === currentUser?.company;
    
    const hasAccess = isCreator || isAssignedToMe || isMyCompany;
    const companyMatch = filterCompany === "all" || task.assigned_company === filterCompany;
    const statusMatch = filterStatus === "all" || task.status === filterStatus;
    
    return hasAccess && companyMatch && statusMatch;
  });

  const statusIcons = {
    todo: Clock,
    in_progress: AlertCircle,
    completed: CheckCircle2,
  };

  const statusColors = {
    todo: "bg-gray-500/20 text-gray-300",
    in_progress: "bg-blue-500/20 text-blue-300",
    completed: "bg-green-500/20 text-green-300",
  };

  const priorityColors = {
    important: "bg-red-500/20 text-red-300",
  };

  if (!currentUser) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-black p-6 sm:p-8 pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto">
        <Link to={createPageUrl("Home")}>
          <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/[0.08] mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Task Manager</h1>
          <Button onClick={() => setShowForm(!showForm)} className="bg-amber-500 hover:bg-amber-600">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Task Form */}
        {showForm && (
          <Card className="bg-white/[0.04] border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Create New Task</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Title</label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder-white/40"
                    placeholder="Task title"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-1 block">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder-white/40 h-24"
                    placeholder="Task description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-white/70 mb-1 block">Assigned Company</label>
                    <Select
                      required
                      value={formData.assigned_company}
                      onValueChange={(val) => setFormData({ ...formData, assigned_company: val })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="E2Eden">E2Eden</SelectItem>
                        <SelectItem value="Seawater Greenhouse">Seawater Greenhouse</SelectItem>
                        <SelectItem value="Partner">Partner</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-white/70 mb-1 block">Assign To User (Optional)</label>
                    <Select
                      value={formData.assigned_to}
                      onValueChange={(val) => setFormData({ ...formData, assigned_to: val })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={null}>None</SelectItem>
                        {users.map(user => (
                          <SelectItem key={user.id} value={user.email}>
                            {user.full_name} ({user.company || "No company"})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-white/70 mb-1 block">Priority</label>
                    <Select
                      value={formData.priority}
                      onValueChange={(val) => setFormData({ ...formData, priority: val })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={null}>None</SelectItem>
                        <SelectItem value="important">Important</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-white/70 mb-1 block">Due Date</label>
                    <Input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white">
                    Create Task
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="bg-white/[0.04] border-white/10 mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm text-white/70 mb-1 block">Filter by Company</label>
                <Select value={filterCompany} onValueChange={setFilterCompany}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    <SelectItem value="E2Eden">E2Eden</SelectItem>
                    <SelectItem value="Seawater Greenhouse">Seawater Greenhouse</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm text-white/70 mb-1 block">Filter by Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Table - Desktop */}
        <Card className="bg-white/[0.04] border-white/10 hidden sm:block">
          <CardHeader>
            <CardTitle className="text-white">Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/70">Task</TableHead>
                  <TableHead className="text-white/70">Company</TableHead>
                  <TableHead className="text-white/70">Assigned To</TableHead>
                  <TableHead className="text-white/70">Priority</TableHead>
                  <TableHead className="text-white/70">Due Date</TableHead>
                  <TableHead className="text-white/70">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => {
                  const StatusIcon = statusIcons[task.status];
                  return (
                    <TableRow key={task.id} className="border-white/10">
                      <TableCell>
                        <div>
                          <p className="text-white font-medium">{task.title}</p>
                          {task.description && (
                            <p className="text-white/50 text-sm">{task.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-purple-500/20 text-purple-300">
                          {task.assigned_company}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white/70">
                        {task.assigned_to || "Unassigned"}
                      </TableCell>
                      <TableCell>
                        {task.priority ? (
                          <Badge className={priorityColors[task.priority]}>
                            {task.priority}
                          </Badge>
                        ) : (
                          <span className="text-white/40 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-white/70">
                        {task.due_date ? format(new Date(task.due_date), "MMM dd, yyyy") : "-"}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={task.status}
                          onValueChange={(val) => handleStatusChange(task, val)}
                        >
                          <SelectTrigger className="w-40 bg-white/5 border-white/10">
                            <div className="flex items-center gap-2">
                              <StatusIcon className="w-4 h-4" />
                              <span className="text-white">{task.status.replace('_', ' ')}</span>
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todo">To Do</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {filteredTasks.length === 0 && (
              <p className="text-white/40 text-center py-8">No tasks found</p>
            )}
          </CardContent>
        </Card>

        {/* Tasks Cards - Mobile */}
        <div className="sm:hidden space-y-4 mb-20">
          {filteredTasks.map((task) => {
            const StatusIcon = statusIcons[task.status];
            return (
              <Card key={task.id} className="bg-white/[0.04] border-white/10">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-white font-semibold text-lg mb-1">{task.title}</p>
                      {task.description && (
                        <p className="text-white/50 text-sm">{task.description}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-purple-500/20 text-purple-300 text-xs">
                        {task.assigned_company}
                      </Badge>
                      {task.priority && (
                        <Badge className={`${priorityColors[task.priority]} text-xs`}>
                          {task.priority}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/50">Assigned to:</span>
                        <span className="text-white/70">{task.assigned_to || "Unassigned"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Due date:</span>
                        <span className="text-white/70">
                          {task.due_date ? format(new Date(task.due_date), "MMM dd, yyyy") : "-"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="text-xs text-white/50 mb-1 block">Status</label>
                      <Select
                        value={task.status}
                        onValueChange={(val) => handleStatusChange(task, val)}
                      >
                        <SelectTrigger className="w-full bg-white/5 border-white/10">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="w-4 h-4" />
                            <span className="text-white">{task.status.replace('_', ' ')}</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {filteredTasks.length === 0 && (
            <Card className="bg-white/[0.04] border-white/10">
              <CardContent className="py-12">
                <p className="text-white/40 text-center">No tasks found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}