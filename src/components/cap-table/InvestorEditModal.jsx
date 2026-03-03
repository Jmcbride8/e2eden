import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Trash2 } from "lucide-react";

export default function InvestorEditModal({ investor, isOpen, onClose }) {
  const [formData, setFormData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (investor) {
      setFormData({
        name: investor.name || "",
        email: investor.email || "",
        investment_amount: investor.investment_amount || "",
        investment_date: investor.investment_date || "",
        status: investor.status || "pending",
      });
      setConfirmDelete(false);
    }
  }, [investor]);

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Investor.update(investor.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investors'] });
      onClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => base44.entities.Investor.delete(investor.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investors'] });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      ...formData,
      investment_amount: parseFloat(formData.investment_amount),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-white/20 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Investor Record</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/70 mb-1 block">Name</label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-white/70 mb-1 block">Email</label>
            <Input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-white/70 mb-1 block">Investment Amount (USD)</label>
            <Input
              required
              type="number"
              min="0"
              step="0.01"
              value={formData.investment_amount}
              onChange={(e) => setFormData({ ...formData, investment_amount: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-white/70 mb-1 block">Investment Date</label>
            <Input
              type="date"
              value={formData.investment_date}
              onChange={(e) => setFormData({ ...formData, investment_date: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-white/70 mb-1 block">Status</label>
            <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/20 text-white">
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Delete Section */}
          <div className="pt-2 border-t border-white/10">
            {!confirmDelete ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setConfirmDelete(true)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Record
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteMutation.isPending}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Confirm Delete"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 text-white/70 hover:text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2 pt-2">
            <Button type="button" onClick={onClose} className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20">
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white">
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}