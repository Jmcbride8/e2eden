import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { base44 } from "@/api/base44Client";

export default function ProjectEditModal({ project, onClose, onSave }) {
  const [formData, setFormData] = useState(project || {
    name: "",
    type: [],
    phase: "R&D",
    ownership_type: "E2Eden",
    description: "",
    location: "",
    country: "",
    region: "",
    lat: 0,
    lon: 0,
    year: new Date().getFullYear().toString(),
    team: "",
    status: "active",
    images: [],
    details: "",
    hero_image: "",
    backstory: "",
    our_solution: "",
    project_updates: "",
    funding: "",
    partners: ""
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(file => base44.integrations.Core.UploadFile({ file }));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map(result => result.file_url);
      setFormData({ ...formData, images: [...(formData.images || []), ...newUrls] });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, hero_image: result.file_url });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl border border-white/10 p-6"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white hover:bg-white/10 rounded-full h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>

          <h2 className="text-2xl font-bold text-white mb-6">
            {project ? "Edit Project" : "Add New Project"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="text-white/70">Project Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/[0.06] border-white/10 text-white"
                  required
                />
              </div>

              <div className="col-span-2">
                <Label className="text-white/70 mb-2 block">Project Type</Label>
                <div className="flex gap-4">
                  {["Farming", "Tunnels", "Minerals"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={formData.type?.includes(type) || false}
                        onCheckedChange={(checked) => {
                          const newTypes = checked
                            ? [...(formData.type || []), type]
                            : (formData.type || []).filter(t => t !== type);
                          setFormData({ ...formData, type: newTypes });
                        }}
                        className="border-white/20 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                      />
                      <Label htmlFor={`type-${type}`} className="text-white/70 cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-white/70">Phase</Label>
                <Select value={formData.phase} onValueChange={(value) => setFormData({ ...formData, phase: value })}>
                  <SelectTrigger className="bg-white/[0.06] border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="R&D">R&D</SelectItem>
                    <SelectItem value="Commercialization">Commercialization</SelectItem>
                    <SelectItem value="Transformation">Transformation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white/70">Ownership Type</Label>
                <Select value={formData.ownership_type} onValueChange={(value) => setFormData({ ...formData, ownership_type: value })}>
                  <SelectTrigger className="bg-white/[0.06] border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="E2Eden">E2Eden</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                    <SelectItem value="Joint Venture">Joint Venture</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white/70">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="bg-white/[0.06] border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white/70">Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-white/[0.06] border-white/10 text-white"
                  placeholder="e.g., Nairobi"
                  required
                />
              </div>

              <div>
                <Label className="text-white/70">Country</Label>
                <Input
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="bg-white/[0.06] border-white/10 text-white"
                  placeholder="e.g., Kenya"
                  required
                />
              </div>

              <div>
                <Label className="text-white/70">Region</Label>
                <Input
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="bg-white/[0.06] border-white/10 text-white"
                  placeholder="e.g., East Africa"
                />
              </div>

              <div>
                <Label className="text-white/70">Year</Label>
                <Input
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="bg-white/[0.06] border-white/10 text-white"
                />
              </div>

              <div>
                <Label className="text-white/70">Latitude</Label>
                <Input
                  type="number"
                  step="any"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                  className="bg-white/[0.06] border-white/10 text-white"
                  required
                />
              </div>

              <div>
                <Label className="text-white/70">Longitude</Label>
                <Input
                  type="number"
                  step="any"
                  value={formData.lon}
                  onChange={(e) => setFormData({ ...formData, lon: parseFloat(e.target.value) })}
                  className="bg-white/[0.06] border-white/10 text-white"
                  required
                />
              </div>

              <div className="col-span-2">
                <Label className="text-white/70">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white/[0.06] border-white/10 text-white h-20"
                  required
                />
              </div>

              <div className="col-span-2">
                <Label className="text-white/70">Additional Details</Label>
                <Textarea
                  value={formData.details || ""}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="bg-white/[0.06] border-white/10 text-white h-20"
                />
              </div>

              <div className="col-span-2">
                <Label className="text-white/70">Hero Image</Label>
                <div className="space-y-3">
                  {formData.hero_image && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/10">
                      <img src={formData.hero_image} alt="Hero" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, hero_image: "" })}
                        className="absolute top-2 right-2 p-1.5 bg-red-500/90 hover:bg-red-600 rounded-full"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  )}
                  <label className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-white/20 hover:border-white/40 rounded-lg cursor-pointer transition-colors bg-white/[0.03] hover:bg-white/[0.06]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-white/60">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-white/60" />
                        <span className="text-sm text-white/60">{formData.hero_image ? "Change" : "Upload"} hero image</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="col-span-2">
                <Label className="text-white/70">Backstory</Label>
                <Textarea
                  value={formData.backstory || ""}
                  onChange={(e) => setFormData({ ...formData, backstory: e.target.value })}
                  className="bg-white/[0.06] border-white/10 text-white h-24"
                />
              </div>

              <div className="col-span-2">
                <Label className="text-white/70">Our Solution</Label>
                <Textarea
                  value={formData.our_solution || ""}
                  onChange={(e) => setFormData({ ...formData, our_solution: e.target.value })}
                  className="bg-white/[0.06] border-white/10 text-white h-24"
                />
              </div>

              <div className="col-span-2">
                <Label className="text-white/70">Project Updates</Label>
                <Textarea
                  value={formData.project_updates || ""}
                  onChange={(e) => setFormData({ ...formData, project_updates: e.target.value })}
                  className="bg-white/[0.06] border-white/10 text-white h-24"
                />
              </div>

              <div className="col-span-2">
                <Label className="text-white/70">Funding Information</Label>
                <Textarea
                  value={formData.funding || ""}
                  onChange={(e) => setFormData({ ...formData, funding: e.target.value })}
                  className="bg-white/[0.06] border-white/10 text-white h-24"
                />
              </div>

              <div className="col-span-2">
                <Label className="text-white/70">Partners</Label>
                <Textarea
                  value={formData.partners || ""}
                  onChange={(e) => setFormData({ ...formData, partners: e.target.value })}
                  className="bg-white/[0.06] border-white/10 text-white h-24"
                />
              </div>

              <div className="col-span-2">
                <Label className="text-white/70">Project Images</Label>
                <div className="space-y-3">
                  {/* Image previews */}
                  {formData.images && formData.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {formData.images.map((url, idx) => (
                        <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border border-white/10">
                          <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 p-1 bg-red-500/90 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Upload button */}
                  <label className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-white/20 hover:border-white/40 rounded-lg cursor-pointer transition-colors bg-white/[0.03] hover:bg-white/[0.06]">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-white/60">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-white/60" />
                        <span className="text-sm text-white/60">Click to upload images</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white" disabled={saving || uploading}>
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Project
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}