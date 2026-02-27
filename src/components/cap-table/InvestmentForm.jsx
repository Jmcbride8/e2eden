import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export default function InvestmentForm({ isOpen, onClose, seedRound }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    investment_amount: seedRound ? (5000000 * seedRound.ownership / 100) : "",
    investment_date: new Date().toISOString().split('T')[0],
  });

  const queryClient = useQueryClient();

  const createInvestorMutation = useMutation({
    mutationFn: (data) => base44.entities.Investor.create({
      ...data,
      investment_amount: parseFloat(data.investment_amount),
      status: "pending"
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investors'] });
      setFormData({
        name: "",
        email: "",
        investment_amount: "",
        investment_date: new Date().toISOString().split('T')[0],
      });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.investment_amount) {
      alert("Please fill in all fields");
      return;
    }
    createInvestorMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-white/20 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">{seedRound ? `Invest in ${seedRound.name}` : 'Propose Investment'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/70 mb-1 block">Name</label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder-white/40"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-sm text-white/70 mb-1 block">Email</label>
            <Input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder-white/40"
              placeholder="your@email.com"
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
              className="bg-white/5 border-white/10 text-white placeholder-white/40"
              placeholder="Enter amount"
              disabled={!!seedRound}
            />
            {seedRound && (
              <div className="text-xs text-white/50 mt-1">
                {seedRound.name} allocation: ${(5000000 * seedRound.ownership / 100).toLocaleString()} (2% of $5M)
              </div>
            )}
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
          <DialogFooter className="flex gap-2 pt-4">
            <Button type="button" onClick={onClose} className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white">
              {createInvestorMutation.isPending ? "Submitting..." : "Submit Investment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}