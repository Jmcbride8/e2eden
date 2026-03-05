import React, { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

/**
 * Wraps any image with an admin-only click-to-replace overlay.
 * Props:
 *   src        – current image URL
 *   alt        – img alt text
 *   isAdmin    – show the upload UI only for admins
 *   onUploaded – callback(newUrl: string) when upload succeeds
 *   className  – classes for the outer wrapper div
 *   imgClassName – classes for the <img>
 */
export default function AdminImageUpload({ src, alt, isAdmin, onUploaded, className = "", imgClassName = "" }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file: selectedFile });
    onUploaded(file_url);
    setUploading(false);
    setModalOpen(false);
    setPreview(null);
    setSelectedFile(null);
  };

  const handleClose = () => {
    setModalOpen(false);
    setPreview(null);
    setSelectedFile(null);
  };

  return (
    <>
      <div className={`relative group ${className}`}>
        <img src={src} alt={alt} className={imgClassName} />

        {isAdmin && (
          <button
            onClick={() => setModalOpen(true)}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 group-hover:bg-black/50 transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer rounded-inherit"
          >
            <Upload className="w-8 h-8 text-amber-400 mb-1" />
            <span className="text-white text-xs font-medium">Replace Image</span>
          </button>
        )}
      </div>

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />
          <div className="relative bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <button onClick={handleClose} className="absolute top-4 right-4 text-white/50 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-white font-semibold text-lg mb-4">Replace Image</h3>

            {/* Preview */}
            <div className="aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10 mb-4">
              <img
                src={preview || src}
                alt="preview"
                className="w-full h-full object-cover"
              />
            </div>

            {/* File picker */}
            <label className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-dashed border-white/20 hover:border-amber-500/50 bg-white/5 cursor-pointer text-white/60 hover:text-white transition-colors mb-4">
              <Upload className="w-4 h-4" />
              <span className="text-sm">{selectedFile ? selectedFile.name : "Choose an image file"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</> : "Upload & Replace"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}