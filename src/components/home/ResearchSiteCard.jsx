import React from "react";
import AdminImageUpload from "./AdminImageUpload";

export default function ResearchSiteCard({ site, isAdmin, getHomeImg, setHomeImg }) {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center rounded-2xl overflow-hidden border border-white/10 bg-white/5">
      <div className="p-8">
        <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">{site.label}</span>
        <h3 className="text-2xl font-bold text-white mt-2 mb-3">{site.name}</h3>
        <p className="text-amber-400/80 text-sm mb-4">{site.location}</p>
        <p className="text-white/70 leading-relaxed">{site.blurb}</p>
      </div>
      <div className="h-64 md:h-full min-h-[260px]">
        <AdminImageUpload
          src={getHomeImg(site.image_key, site.image_default)}
          alt={site.image_alt || site.name}
          isAdmin={isAdmin}
          onUploaded={(url) => setHomeImg(site.image_key, url)}
          className="w-full h-full"
          imgClassName="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}