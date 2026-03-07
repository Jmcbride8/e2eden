import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";

export default function CompanyEditModal({ company, onClose, onSave }) {
  const [formData, setFormData] = useState(company || {
    name: "",
    full_brand_name: "",
    logo_url: "",
    type: "Partner",
    owner: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    website: "",
    country: "",
    description: "",
    notes: "",
    status: "active",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, logo_url: result.file_url });
    } finally {
      setUploading(false);
    }
  };

  const set = (key, value) => setFormData({ ...formData, [key]: value });

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
          className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl border border-white/10 p-6"
        >
          <Button
            variant="ghost" size="icon" onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white hover:bg-white/10 rounded-full h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>

          <h2 className="text-2xl font-bold text-white mb-6">
            {company ? "Edit Company" : "Add Company"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">

              {/* Logo */}
              <div className="col-span-2">
                <Label className="text-white/70 mb-2 block">Logo</Label>
                <div className="flex items-center gap-4">
                  {formData.logo_url && (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
                      <img src={formData.logo_url} alt="Logo" className="w-full h-full object-contain p-1" />
                      <button type="button" onClick={() => set("logo_url", "")}
                        className="absolute top-1 right-1 p-0.5 bg-red-500/90 hover:bg-red-600 rounded-full">
                        <Trash2 className="w-2.5 h-2.5 text-white" />
                      </button>
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-white/20 hover:border-white/40 rounded-lg cursor-pointer transition-colors bg-white/[0.03] hover:bg-white/[0.06] text-sm text-white/60">
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploading} />
                    {uploading ? <><div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Upload logo</>}
                  </label>
                </div>
              </div>

              <div>
                <Label className="text-white/70">Company Name *</Label>
                <Input value={formData.name} onChange={(e) => set("name", e.target.value)}
                  className="bg-white/[0.06] border-white/10 text-white" required />
              </div>

              <div>
                <Label className="text-white/70">Full Brand Name</Label>
                <Input value={formData.full_brand_name} onChange={(e) => set("full_brand_name", e.target.value)}
                  className="bg-white/[0.06] border-white/10 text-white" placeholder="Legal entity name" />
              </div>

              <div>
                <Label className="text-white/70">Type</Label>
                <Select value={formData.type} onValueChange={(v) => set("type", v)}>
                  <SelectTrigger className="bg-white/[0.06] border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Partner", "Investor", "Supplier", "Joint Venture", "NGO", "Government", "Other"].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white/70">Status</Label>
                <Select value={formData.status} onValueChange={(v) => set("status", v)}>
                  <SelectTrigger className="bg-white/[0.06] border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white/70">Owner / Founder</Label>
                <Input value={formData.owner} onChange={(e) => set("owner", e.target.value)}
                  className="bg-white/[0.06] border-white/10 text-white" />
              </div>

              <div>
                <Label className="text-white/70">Country</Label>
                <Input value={formData.country} onChange={(e) => set("country", e.target.value)}
                  className="bg-white/[0.06] border-white/10 text-white" />
              </div>

              <div>
                <Label className="text-white/70">Contact Name</Label>
                <Input value={formData.contact_name} onChange={(e) => set("contact_name", e.target.value)}
                  className="bg-white/[0.06] border-white/10 text-white" />
              </div>

              <div>
                <Label className="text-white/70">Contact Email</Label>
                <Input type="email" value={formData.contact_email} onChange={(e) => set("contact_email", e.target.value)}
                  className="bg-white/[0.06] border-white/10 text-white" />
              </div>

              <div>
                <Label className="text-white/70">Contact Phone</Label>
                <Input value={formData.contact_phone} onChange={(e) => set("contact_phone", e.target.value)}
                  className="bg-white/[0.06] border-white/10 text-white" />
              </div>

              <div>
                <Label className="text-white/70">Website</Label>
                <Input value={formData.website} onChange={(e) => set("website", e.target.value)}
                  className="bg-white/[0.06] border-white/10 text-white" placeholder="https://..." />
              </div>

              <div className="col-span-2">
                <Label className="text-white/70">Description</Label>
                <Textarea value={formData.description} onChange={(e) => set("description", e.target.value)}
                  className="bg-white/[0.06] border-white/10 text-white h-20" />
              </div>

              <div className="col-span-2">
                <Label className="text-white/70">Internal Notes</Label>
                <Textarea value={formData.notes} onChange={(e) => set("notes", e.target.value)}
                  className="bg-white/[0.06] border-white/10 text-white h-20" />
              </div>
            </div>

            <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white" disabled={saving || uploading}>
              {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Saving...</> : <><Save className="w-4 h-4 mr-2" />Save Company</>}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}