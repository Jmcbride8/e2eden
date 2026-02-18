import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { User, Mail, Shield, Save, Upload, Move, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [positioning, setPositioning] = useState(false);
  const [imagePosition, setImagePosition] = useState("center center");

  useEffect(() => {
    base44.auth.me().then((userData) => {
      setUser(userData);
      setFullName(userData.full_name || "");
      setImagePosition(userData.profile_picture_position || "center center");
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await base44.auth.updateMe({ full_name: fullName });
      toast.success("Profile updated successfully");
      const updated = await base44.auth.me();
      setUser(updated);
    } catch (error) {
      toast.error("Failed to update profile");
    }
    setIsSaving(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      await base44.auth.updateMe({ profile_picture: result.file_url });
      const updated = await base44.auth.me();
      setUser(updated);
      toast.success("Profile picture updated");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handlePositionChange = async (position) => {
    setImagePosition(position);
    try {
      await base44.auth.updateMe({ profile_picture_position: position });
      const updated = await base44.auth.me();
      setUser(updated);
      toast.success("Position updated");
    } catch (error) {
      toast.error("Failed to update position");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/40">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 sm:p-8 pt-24 sm:pt-28">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-white/40">Manage your account information</p>
        </div>

        <Card className="bg-white/[0.04] border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5 text-amber-400" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="space-y-2">
              <Label className="text-white/70">Profile Picture</Label>
              {user.profile_picture ? (
                <div className="relative w-48 h-48 rounded-xl overflow-hidden group border-2 border-white/10">
                  <img 
                    src={user.profile_picture} 
                    alt="Profile"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: imagePosition }}
                  />
                  {!positioning && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                        {uploading ? (
                          <div className="flex items-center gap-2 text-white px-4 py-2 bg-white/10 rounded-lg">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm">Uploading...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-white px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                            <Upload className="w-4 h-4" />
                            <span className="text-sm">Change</span>
                          </div>
                        )}
                      </label>
                      <button
                        onClick={() => setPositioning(true)}
                        className="flex items-center gap-2 text-white px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <Move className="w-4 h-4" />
                        <span className="text-sm">Position</span>
                      </button>
                    </div>
                  )}
                  {positioning && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 p-4">
                      <div className="text-white text-sm mb-2">Adjust Image Position</div>
                      <div className="grid grid-cols-3 gap-2">
                        {['top left', 'top center', 'top right',
                          'center left', 'center center', 'center right',
                          'bottom left', 'bottom center', 'bottom right'].map((pos) => (
                          <button
                            key={pos}
                            onClick={() => handlePositionChange(pos)}
                            className={`px-3 py-2 rounded-lg text-xs transition-colors ${
                              imagePosition === pos 
                                ? 'bg-white text-black' 
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                          >
                            {pos.split(' ').map(w => w[0].toUpperCase()).join('')}
                          </button>
                        ))}
                      </div>
                      <Button
                        onClick={() => setPositioning(false)}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        Done
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <label className="w-48 h-48 rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white/[0.03] hover:bg-white/[0.06]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2 text-white/60">
                      <div className="w-8 h-8 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-white/60">
                      <Camera className="w-8 h-8" />
                      <span className="text-sm">Upload Photo</span>
                    </div>
                  )}
                </label>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white/70">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-white/[0.06] border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/70">Email</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="bg-white/[0.03] border-white/10 text-white/50"
                />
                <Mail className="w-4 h-4 text-white/30" />
              </div>
              <p className="text-xs text-white/30">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label className="text-white/70">Role</Label>
              <div className="flex items-center gap-2">
                <div className="px-3 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-white/70 text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  {user.role}
                </div>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}