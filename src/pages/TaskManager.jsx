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
import { Plus, CheckCircle2, Clock, AlertCircle, MoreVertical, Edit2, Trash2, ChevronDown, BarChart3 } from "lucide-react";
import TaskEditModal from "../components/TaskEditModal";
import TaskUpdateList from "../components/TaskUpdateList";
import TaskGanttChart from "../components/TaskGanttChart";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { format, subDays } from "date-fns";

export default function TaskManager() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCompany, setFilterCompany] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterOwner, setFilterOwner] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigned_to: "",
    assigned_company: "",
    start_date: "",
    due_date: "",
  });

  const queryClient = useQueryClient();

  React.useEffect(() => {
    const loadUser = async () => {
      const user = await base44.auth.me();
      setCurrentUser(user);
      setFilterOwner(user?.email || "");
    };
    loadUser();
  }, []);

  const { data: allTasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.Task.list('due_date'),
    enabled: !!currentUser,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
    enabled: !!currentUser,
  });

  const { data: allUpdates = [] } = useQuery({
    queryKey: ['taskUpdates'],
    queryFn: () => base44.entities.TaskUpdate.list('-created_date'),
    enabled: !!currentUser,
  });

  const createTaskMutation = useMutation({
    mutationFn: (data) => base44.entities.Task.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setShowForm(false);
      setFormData({ title: "", description: "", assigned_to: "", assigned_company: "", start_date: "", due_date: "" });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Task.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setEditingTask(null);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id) => base44.entities.Task.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const createUpdateMutation = useMutation({
    mutationFn: (data) => base44.entities.TaskUpdate.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskUpdates'] });
    },
  });

  const updateUpdateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.TaskUpdate.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskUpdates'] });
    },
  });

  const deleteUpdateMutation = useMutation({
    mutationFn: (id) => base44.entities.TaskUpdate.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskUpdates'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createTaskMutation.mutate(formData);
  };

  const handleStatusChange = (task, newStatus) => {
    updateTaskMutation.mutate({ id: task.id, data: { status: newStatus } });
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleDeleteTask = (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  // Filter tasks based on user permissions
  const filteredTasks = allTasks.filter(task => {
    // Admin sees all
    if (currentUser?.role === 'admin') {
      const companyMatch = filterCompany === "all" || task.assigned_company === filterCompany;
      const statusMatch = filterStatus === "all" || task.status === filterStatus;
      const ownerMatch = filterOwner === "" || task.assigned_to === filterOwner;
      return companyMatch && statusMatch && ownerMatch;
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
    const ownerMatch = filterOwner === "" || task.assigned_to === filterOwner;
    
    return hasAccess && companyMatch && statusMatch && ownerMatch;
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

  const getUserName = (email) => {
    const user = users.find(u => u.email === email);
    if (user && user.full_name) {
      return user.full_name;
    }
    return email;
  };

  if (!currentUser) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-black p-6 sm:p-8 pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto">
         <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Task Manager</h1>
          <div className="flex bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 rounded transition-all ${viewMode === "table" ? "bg-amber-500 text-white" : "text-white/70 hover:text-white"}`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode("gantt")}
              className={`px-4 py-2 rounded transition-all flex items-center gap-2 ${viewMode === "gantt" ? "bg-amber-500 text-white" : "text-white/70 hover:text-white"}`}
            >
              <BarChart3 className="w-4 h-4" />
              Gantt
            </button>
          </div>
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
                    <label className="text-sm text-white/70 mb-1 block">Owner (Optional)</label>
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
                     <label className="text-sm text-white/70 mb-1 block">Start Date</label>
                     <Input
                       type="date"
                       value={formData.start_date}
                       onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                       className="bg-white/5 border-white/10 text-white"
                     />
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
                 <label className="text-sm text-white/70 mb-1 block">Filter by Owner</label>
                 <Select value={filterOwner} onValueChange={setFilterOwner}>
                   <SelectTrigger className="bg-white/5 border-white/10 text-white">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value={null}>All Owners</SelectItem>
                     {users.map(user => (
                       <SelectItem key={user.id} value={user.email}>
                         {user.full_name}
                       </SelectItem>
                     ))}
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

        {/* Gantt Chart View */}
         {viewMode === "gantt" && (
           <Card className="bg-white/[0.04] border-white/10">
             <CardHeader>
               <CardTitle className="text-white">Task Timeline</CardTitle>
             </CardHeader>
             <CardContent>
               <TaskGanttChart tasks={filteredTasks} getUserName={getUserName} statusColors={statusColors} />
             </CardContent>
           </Card>
         )}

        {/* Tasks Table - Desktop */}
         {viewMode === "table" && (
         <Card className="bg-white/[0.04] border-white/10 hidden sm:block">
           <CardHeader className="flex flex-row justify-between items-center">
             <CardTitle className="text-white">Tasks</CardTitle>
             <Button onClick={() => setShowForm(!showForm)} className="bg-amber-500 hover:bg-amber-600">
               <Plus className="w-4 h-4 mr-2" />
               New Task
             </Button>
           </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/70 px-1 border-r border-white/10"></TableHead>
                  <TableHead className="text-white/70 text-right">Due Date</TableHead>
                  <TableHead className="text-white/70">Task</TableHead>
                  <TableHead className="text-white/70 text-right">Company</TableHead>
                  <TableHead className="text-white/70 text-right">Owner</TableHead>
                  <TableHead className="text-white/70 text-right">Status</TableHead>
                  <TableHead className="text-white/70 px-1 border-l border-white/10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => {
                   const StatusIcon = statusIcons[task.status];
                   return (
                     <React.Fragment key={task.id}>
                       <TableRow className="border-white/10">
                         <TableCell className="px-1 border-r border-white/10" onClick={(e) => e.stopPropagation()}>
                           <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10">
                                 <MoreVertical className="w-4 h-4" />
                               </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="start" className="bg-gray-900 border-white/20">
                               <DropdownMenuItem 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   handleEditTask(task);
                                 }}
                                 className="text-white/70 hover:text-white hover:bg-white/10 cursor-pointer flex items-center gap-2"
                               >
                                 <Edit2 className="w-4 h-4" />
                                 Edit
                               </DropdownMenuItem>
                               <DropdownMenuItem 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   handleDeleteTask(task.id);
                                 }}
                                 className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer flex items-center gap-2"
                               >
                                 <Trash2 className="w-4 h-4" />
                                 Delete
                               </DropdownMenuItem>
                             </DropdownMenuContent>
                           </DropdownMenu>
                         </TableCell>
                         <TableCell className="text-white/70 text-right">
                           {task.due_date ? format(new Date(task.due_date), "MMM dd, yyyy") : "-"}
                         </TableCell>
                         <TableCell>
                           <div>
                             <p className="text-white font-medium">{task.title}</p>
                             {task.description && (
                               <p className="text-white/50 text-sm">{task.description}</p>
                             )}
                           </div>
                         </TableCell>
                         <TableCell className="text-right">
                           <Badge className="bg-purple-500/20 text-purple-300">
                             {task.assigned_company}
                           </Badge>
                         </TableCell>
                         <TableCell className="text-white/70 text-right">
                           {task.assigned_to ? getUserName(task.assigned_to) : "Unassigned"}
                         </TableCell>
                         <TableCell className="text-right">
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
                         <TableCell className="px-1 border-l border-white/10" onClick={(e) => e.stopPropagation()}>
                           <button
                             onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                             className="flex items-center gap-1 text-white/50 hover:text-white transition-colors"
                           >
                             <ChevronDown className={`w-4 h-4 transition-transform ${expandedTaskId === task.id ? 'rotate-180' : ''}`} />
                             <span className="text-xs whitespace-nowrap">{allUpdates.filter(u => u.task_id === task.id).length}</span>
                           </button>
                         </TableCell>
                         </TableRow>
                         {expandedTaskId === task.id && (
                         <TableRow className="border-white/10 bg-white/[0.01]">
                           <TableCell colSpan="7" className="py-3 pl-8">
                             <TaskUpdateList
                               taskId={task.id}
                               updates={allUpdates}
                               onAddUpdate={(data) => createUpdateMutation.mutate(data)}
                               onEditUpdate={(id, data) => updateUpdateMutation.mutate({ id, data })}
                               onDeleteUpdate={(id) => deleteUpdateMutation.mutate(id)}
                               currentUserEmail={currentUser?.email}
                               isExpanded={true}
                               onToggleExpand={() => {}}
                               users={users}
                             />
                           </TableCell>
                         </TableRow>
                         )}
                         </React.Fragment>
                   );
                })}
                      </TableBody>
                      </Table>
            {filteredTasks.length === 0 && (
              <p className="text-white/40 text-center py-8">No tasks found</p>
            )}
            </CardContent>
            </Card>
            )}

            {/* Tasks Cards - Mobile */}
            {viewMode === "table" && (
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
                     </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                         <span className="text-white/50">Owner:</span>
                         <span className="text-white/70">{task.assigned_to ? getUserName(task.assigned_to) : "Unassigned"}</span>
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
            )}

            {/* Edit Modal */}
        <TaskEditModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          task={editingTask}
          users={users}
        />
      </div>
    </div>
  );
}