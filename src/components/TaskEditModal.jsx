import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export default function TaskEditModal({ isOpen, onClose, task, users }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigned_to: "",
    assigned_company: "",
    due_date: "",
    status: "",
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        assigned_to: task.assigned_to || "",
        assigned_company: task.assigned_company || "",
        due_date: task.due_date || "",
        status: task.status || "todo",
      });
    }
  }, [task, isOpen]);

  const updateTaskMutation = useMutation({
    mutationFn: (data) => base44.entities.Task.update(task.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTaskMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-white/20 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Task</DialogTitle>
        </DialogHeader>
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
              <label className="text-sm text-white/70 mb-1 block">Owner</label>
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
                      {user.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
          <div>
            <label className="text-sm text-white/70 mb-1 block">Status</label>
            <Select
              value={formData.status}
              onValueChange={(val) => setFormData({ ...formData, status: val })}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex gap-2 pt-4">
            <Button type="button" onClick={onClose} className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}