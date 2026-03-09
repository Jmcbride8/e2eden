import React, { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Upload, Linkedin } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function TeamCard({ member, isAdmin, onUpdate, onDelete, onMemberUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(member);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, image_url: file_url });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    await onMemberUpdate(member.id, formData);
    setIsEditing(false);
  };

  if (isEditing && isAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-white/5 border border-amber-500/50 p-6 space-y-4"
      >
        <div className="relative w-full h-32 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden group">
          {formData.image_url && (
            <img src={formData.image_url} alt={formData.name} className="w-full h-full object-cover" />
          )}
          <label className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
            <Upload className="w-5 h-5 text-white" />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>

        <Input
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-white/10 border-white/20 text-white"
        />
        <Input
          placeholder="Role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="bg-white/10 border-white/20 text-white"
        />
        <select
          value={formData.label || "Team Member"}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className="w-full rounded-md bg-white/10 border border-white/20 text-white text-sm px-3 py-2"
        >
          {["Team Member","Founder","Advisor","Mentor","Investor","Consultant","Partner","Board Member"].map(l => (
            <option key={l} value={l} className="bg-gray-900">{l}</option>
          ))}
        </select>
        <Textarea
          placeholder="Bio"
          value={formData.bio || ""}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="bg-white/10 border-white/20 text-white resize-none"
        />
        <Input
          placeholder="LinkedIn URL"
          value={formData.linkedin_url || ""}
          onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
          className="bg-white/10 border-white/20 text-white"
        />
        <Input
          placeholder="Industry"
          value={formData.industry || ""}
          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          className="bg-white/10 border-white/20 text-white"
        />
        <div>
          <p className="text-white/60 text-xs mb-2">Brand / Education Logo</p>
          <div className="relative w-full h-16 rounded-lg bg-white/5 border border-white/20 flex items-center justify-center overflow-hidden group cursor-pointer">
            {formData.education_logo_url && (
              <img src={formData.education_logo_url} alt="Brand" className="h-full object-contain p-2" />
            )}
            <label className={`${formData.education_logo_url ? 'absolute inset-0 opacity-0 group-hover:opacity-100' : ''} bg-black/50 flex items-center justify-center cursor-pointer transition-opacity`}>
              <Upload className="w-4 h-4 text-white mr-1" />
              <span className="text-white text-xs">Upload Logo</span>
              <input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                try {
                  const { file_url } = await base44.integrations.Core.UploadFile({ file });
                  setFormData(f => ({ ...f, education_logo_url: file_url }));
                } finally { setUploading(false); }
              }} className="hidden" />
            </label>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" className="bg-amber-500 hover:bg-amber-600" onClick={handleSave}>
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-xl bg-white/5 border border-white/10 overflow-hidden hover:border-amber-500/50 transition-colors group"
    >
      {/* Profile Image */}
      <div className="relative w-full h-56 bg-gradient-to-br from-amber-500 to-yellow-600 overflow-hidden">
        {formData.image_url && (
          <img src={formData.image_url} alt={formData.name} className="w-full h-full object-cover" />
        )}
        {isAdmin && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 bg-black/50 text-white/80 hover:text-white hover:bg-black/70"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 bg-black/50 text-white/80 hover:text-red-400 hover:bg-black/70"
              onClick={() => onDelete(member.id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col">
        {formData.label && (
          <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-2 self-start">
            {formData.label}
          </span>
        )}
        <h3 className="text-lg font-bold text-white mb-1">{formData.name}</h3>
        <p className="text-amber-400 text-sm font-semibold mb-1">{formData.role}</p>
        {formData.industry && (
          <p className="text-white/50 text-xs mb-3">{formData.industry}</p>
        )}

        <div className="mt-3 flex items-center justify-between">
          {formData.education_logo_url ? (
            <img src={formData.education_logo_url} alt="Brand" className="h-8 object-contain" />
          ) : <div />}
          {formData.linkedin_url && (
            <a
              href={formData.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-blue-400 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}