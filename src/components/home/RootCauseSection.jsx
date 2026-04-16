import React, { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Check, X } from "lucide-react";
import AdminImageUpload from "./AdminImageUpload";

const DEFAULT_IMAGES = [
{
  key: "root_cause_img_3",
  title: "We farm in deserts",
  default: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=800&h=600&fit=crop",
  caption: "People moved to the coasts, pushing farms into deserts where plants use 10x as much water to grow."
},
{
  key: "root_cause_img_2",
  title: "Water evaporates away",
  default: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop",
  caption: "In desert heat, crops sweat constantly just to survive, losing 7ft of water a year to the sky."
},
{
  key: "root_cause_img_desalination",
  title: "Desalination is 10x too costly",
  default: "https://images.unsplash.com/photo-1548783300-b4f9d05cdd67?w=800&h=600&fit=crop",
  caption: "Desalination costs $20,000 per acre-foot. Alfalfa sells for $4,000 per acre. The math doesn't work."
}];



function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default function RootCauseSection({ isAdmin, getHomeImg, setHomeImg }) {
  const getImg = (key, fallback) => getHomeImg ? getHomeImg(key, fallback) : fallback;
  const setImg = (key, url) => setHomeImg ? setHomeImg(key, url) : null;

  const [editingVideo, setEditingVideo] = useState(false);
  const [videoInput, setVideoInput] = useState("");

  const currentVideoUrl = getImg("root_cause_video", "");
  const embedUrl = getYouTubeEmbedUrl(currentVideoUrl);

  const saveVideo = () => {
    setImg("root_cause_video", videoInput);
    setEditingVideo(false);
  };

  return (
    <section className="py-24 px-6 sm:px-12 bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}>

          {/* Section header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Where the Water Is</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <h2 className="text-5xl font-bold text-white mb-6">Agriculture Uses 85% Of Our Water</h2>

          <p className="text-xl leading-relaxed mb-12 text-white/70">
            Desert farms are where water is used, lost, and must be saved
          </p>

          {/* Image Grid */}
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {DEFAULT_IMAGES.map((img) =>
            <div key={img.key} className="group">
                <div className="aspect-[4/3] relative rounded-2xl overflow-hidden mb-3">
                  <AdminImageUpload
                  src={getImg(img.key, img.default)}
                  alt={img.caption}
                  isAdmin={isAdmin}
                  onUploaded={(url) => setImg(img.key, url)}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{img.title}</h3>
                <p className="text-white/60 leading-relaxed">
                  {img.caption}
                </p>
              </div>
            )}
          </div>

          {/* Stat + Pie Chart layout */}
          <div className="grid md:grid-cols-2 gap-8 items-stretch mt-0">
            {/* Water Price Comparison */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center">
              <h3 className="text-white/70 text-sm uppercase tracking-widest mb-6">Water Price per Acre-Foot</h3>
              <div className="space-y-5">
                {[
                  { label: "Las Vegas (city)", price: "$1,800", bar: 90, color: "#60a5fa", note: "Municipal rate" },
                  { label: "Los Angeles (city)", price: "$1,200", bar: 60, color: "#34d399", note: "Municipal rate" },
                  { label: "Phoenix (city)", price: "$900", bar: 45, color: "#a78bfa", note: "Municipal rate" },
                  { label: "IID Farms", price: "$20", bar: 1, color: "#f59e0b", note: "Imperial Irrigation District" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <div>
                        <span className="text-white font-semibold text-sm">{item.label}</span>
                        <span className="text-white/40 text-xs ml-2">{item.note}</span>
                      </div>
                      <span className="font-bold text-lg" style={{ color: item.color }}>{item.price}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${item.bar}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-white/40 text-xs mt-6 border-t border-white/10 pt-4">
                Cities pay up to <span className="text-amber-400 font-semibold">90x more</span> for the same water IID farmers receive — a structural subsidy baked into century-old water rights.
              </p>
            </div>

            {/* Video Panel */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white/70 text-sm uppercase tracking-widest">Watch</h3>
                {isAdmin && !editingVideo && (
                  <button
                    onClick={() => { setVideoInput(currentVideoUrl || ""); setEditingVideo(true); }}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </div>

              {editingVideo ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={videoInput}
                    onChange={(e) => setVideoInput(e.target.value)}
                    placeholder="Paste YouTube URL..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                  />
                  <button onClick={saveVideo} className="p-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors"><Check className="w-4 h-4" /></button>
                  <button onClick={() => setEditingVideo(false)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 transition-colors"><X className="w-4 h-4" /></button>
                </div>
              ) : embedUrl ? (
                <div className="rounded-xl overflow-hidden aspect-video flex-1">
                  <iframe
                    src={embedUrl}
                    title="Section Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center rounded-xl bg-white/5 border border-dashed border-white/20 min-h-[200px]">
                  <p className="text-white/30 text-sm italic text-center px-4">
                    {isAdmin ? "Click the pencil icon to add a YouTube video." : "No video available."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

}