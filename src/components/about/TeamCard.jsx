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
          placeholder="Education Logo URL"
          value={formData.education_logo_url || ""}
          onChange={(e) => setFormData({ ...formData, education_logo_url: e.target.value })}
          className="bg-white/10 border-white/20 text-white"
        />

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
      <div className="w-full h-56 bg-gradient-to-br from-amber-500 to-yellow-600 overflow-hidden">
        {formData.image_url && (
          <img src={formData.image_url} alt={formData.name} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-1">{formData.name}</h3>
      <p className="text-amber-400 text-sm font-semibold mb-3">{formData.role}</p>
      <p className="text-white/60 text-sm mb-4">{formData.bio}</p>

      <div className="space-y-4">
        {formData.education_logo_url && (
          <div>
            <p className="text-white/60 text-xs font-semibold mb-2">Education</p>
            <img src={formData.education_logo_url} alt="University" className="h-10 object-contain" />
          </div>
        )}
        <div className="flex items-center gap-2">
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

        {isAdmin && (
          <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              className="text-white/60 hover:text-white"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-white/60 hover:text-red-400"
              onClick={() => onDelete(member.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}