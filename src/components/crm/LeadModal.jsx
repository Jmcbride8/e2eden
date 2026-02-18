import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function LeadModal({ lead, onClose }) {
  const [formData, setFormData] = useState(lead || {
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    lead_type: "",
    notes: "",
    last_engaged: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (lead?.id) {
        return base44.entities.Lead.update(lead.id, data);
      } else {
        return base44.entities.Lead.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      onClose();
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await saveMutation.mutateAsync(formData);
    setIsSaving(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl border border-white/10 p-6"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 z-10"
          >
            <X className="w-4 h-4" />
          </Button>

          <h2 className="text-2xl font-bold text-white mb-6">
            {lead ? "Edit Lead" : "Add New Lead"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label className="text-white/80 mb-2">Lead Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="bg-white/[0.04] border-white/10 text-white"
                  required
                />
              </div>

              <div>
                <Label className="text-white/80 mb-2">Contact Person</Label>
                <Input
                  value={formData.contact_person}
                  onChange={(e) => handleChange("contact_person", e.target.value)}
                  className="bg-white/[0.04] border-white/10 text-white"
                />
              </div>

              <div>
                <Label className="text-white/80 mb-2">Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="bg-white/[0.04] border-white/10 text-white"
                />
              </div>

              <div>
                <Label className="text-white/80 mb-2">Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="bg-white/[0.04] border-white/10 text-white"
                />
              </div>

              <div>
                <Label className="text-white/80 mb-2">Company</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className="bg-white/[0.04] border-white/10 text-white"
                />
              </div>

              <div>
                <Label className="text-white/80 mb-2">Website</Label>
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  className="bg-white/[0.04] border-white/10 text-white"
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label className="text-white/80 mb-2">Lead Type</Label>
                <Select value={formData.lead_type} onValueChange={(value) => handleChange("lead_type", value)}>
                  <SelectTrigger className="bg-white/[0.04] border-white/10 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Partnership">Partnership</SelectItem>
                    <SelectItem value="Investor">Investor</SelectItem>
                    <SelectItem value="University">University</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="NGO/Foundation">NGO/Foundation</SelectItem>
                    <SelectItem value="Media/Reporter">Media/Reporter</SelectItem>
                    <SelectItem value="Supplier/Vendor">Supplier/Vendor</SelectItem>
                    <SelectItem value="Community Leader">Community Leader</SelectItem>
                    <SelectItem value="Consultant/Advisor">Consultant/Advisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white/80 mb-2">Last Engaged</Label>
                <Input
                  type="date"
                  value={formData.last_engaged}
                  onChange={(e) => handleChange("last_engaged", e.target.value)}
                  className="bg-white/[0.04] border-white/10 text-white"
                />
              </div>
            </div>

            <div>
              <Label className="text-white/80 mb-2">Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="bg-white/[0.04] border-white/10 text-white min-h-[100px]"
                placeholder="Add any additional information..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-white/10 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                {isSaving ? "Saving..." : lead ? "Update Lead" : "Create Lead"}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}