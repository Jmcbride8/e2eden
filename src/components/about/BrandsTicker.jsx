import React, { useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, X, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function BrandsTicker({ isAdmin }) {
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [newBrand, setNewBrand] = useState({ name: "", logo_url: "" });
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: brands = [] } = useQuery({
    queryKey: ['partnerBrands'],
    queryFn: () => base44.entities.PartnerBrand.list('sort_order')
  });

  const createBrandMutation = useMutation({
    mutationFn: (data) => base44.entities.PartnerBrand.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnerBrands'] });
      setNewBrand({ name: "", logo_url: "" });
      setIsAddingBrand(false);
    }
  });

  const deleteBrandMutation = useMutation({
    mutationFn: (id) => base44.entities.PartnerBrand.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partnerBrands'] })
  });

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setNewBrand({ ...newBrand, logo_url: file_url });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleAddBrand = () => {
    if (newBrand.name && newBrand.logo_url) {
      createBrandMutation.mutate({
        ...newBrand,
        sort_order: brands.length
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-white"
        >
          Our Partners
        </motion.h2>
        {isAdmin && (
          <Button onClick={() => setIsAddingBrand(true)} className="bg-amber-500 hover:bg-amber-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Brand
          </Button>
        )}
      </div>

      {isAddingBrand && isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-amber-500/50 rounded-xl p-6 mb-8 space-y-4"
        >
          <Input
            placeholder="Brand name"
            value={newBrand.name}
            onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
          />
          <div className="relative">
            {newBrand.logo_url && (
              <img src={newBrand.logo_url} alt="Preview" className="h-12 object-contain mb-4" />
            )}
            <label className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg cursor-pointer hover:bg-white/20 transition-colors text-white">
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading..." : "Upload Logo"}
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600" onClick={handleAddBrand}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => {
              setIsAddingBrand(false);
              setNewBrand({ name: "", logo_url: "" });
            }}>
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      <div className="flex flex-wrap gap-6 items-center justify-center">
        {brands.map((brand, idx) => (
          <motion.div
            key={brand.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className="relative group"
          >
            <img src={brand.logo_url} alt={brand.name} className="h-12 object-contain" />
            {isAdmin && (
              <button
                onClick={() => deleteBrandMutation.mutate(brand.id)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}