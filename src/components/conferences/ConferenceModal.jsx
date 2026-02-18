import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ConferenceModal({ conference, onClose, userEmail }) {
  const [formData, setFormData] = useState(conference || {
    name: "",
    start_date: "",
    end_date: "",
    location: "",
    link: "",
    cost: "",
    owner: userEmail || "",
    description: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (conference?.id) {
        return base44.entities.Conference.update(conference.id, data);
      } else {
        return base44.entities.Conference.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conferences'] });
      onClose();
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const dataToSave = { ...formData };
    if (dataToSave.cost) {
      dataToSave.cost = parseFloat(dataToSave.cost);
    }
    await saveMutation.mutateAsync(dataToSave);
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
            {conference ? "Edit Conference" : "Add Conference"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-white/80 mb-2">Conference Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="bg-white/[0.04] border-white/10 text-white"
                required
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label className="text-white/80 mb-2">Start Date *</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleChange("start_date", e.target.value)}
                  className="bg-white/[0.04] border-white/10 text-white"
                  required
                />
              </div>

              <div>
                <Label className="text-white/80 mb-2">End Date</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleChange("end_date", e.target.value)}
                  className="bg-white/[0.04] border-white/10 text-white"
                />
              </div>
            </div>

            <div>
              <Label className="text-white/80 mb-2">Location *</Label>
              <Input
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="bg-white/[0.04] border-white/10 text-white"
                placeholder="City, Country or Virtual"
                required
              />
            </div>

            <div>
              <Label className="text-white/80 mb-2">Event Link</Label>
              <Input
                type="url"
                value={formData.link}
                onChange={(e) => handleChange("link", e.target.value)}
                className="bg-white/[0.04] border-white/10 text-white"
                placeholder="https://..."
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label className="text-white/80 mb-2">Cost</Label>
                <Input
                  type="number"
                  value={formData.cost}
                  onChange={(e) => handleChange("cost", e.target.value)}
                  className="bg-white/[0.04] border-white/10 text-white"
                  placeholder="0 for free"
                />
              </div>

              <div>
                <Label className="text-white/80 mb-2">Owner</Label>
                <Input
                  value={formData.owner}
                  onChange={(e) => handleChange("owner", e.target.value)}
                  className="bg-white/[0.04] border-white/10 text-white"
                  placeholder="Who added this"
                />
              </div>
            </div>

            <div>
              <Label className="text-white/80 mb-2">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="bg-white/[0.04] border-white/10 text-white min-h-[100px]"
                placeholder="Additional details about the conference..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                {isSaving ? "Saving..." : conference ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}