import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Ruler, 
  Compass, 
  Calendar, 
  X, 
  Check, 
  Hammer, 
  ArrowRight,
  Info,
  Loader2,
  Maximize2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { Design } from "../types";

// Dynamic preset image collection for easy professional design posting
const HOUSE_PRESETS = [
  {
    name: "Modern Brutalist",
    url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    desc: "Board-formed concrete and black steel cantilever."
  },
  {
    name: "Scandinavian Timber",
    url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
    desc: "A-frame chalet with timber cladding."
  },
  {
    name: "Eco Rammed Earth",
    url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    desc: "Earthy high-performance ecological build."
  },
  {
    name: "Industrial Brick Loft",
    url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
    desc: "Reclaimed brickwork and exposed steel trusses."
  },
  {
    name: "Contemporary Glasshouse",
    url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    desc: "Double height windows with minimal support columns."
  }
];

export default function PortfolioSection() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal & Form States
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [isPostingModalOpen, setIsPostingModalOpen] = useState(false);

  // Lightbox States
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxScale, setLightboxScale] = useState(1);
  const [lightboxPosition, setLightboxPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Manual Design Form State
  const [newDesign, setNewDesign] = useState({
    title: "",
    style: "Modernist" as Design["style"],
    description: "",
    imageUrl: HOUSE_PRESETS[0].url,
    area: "",
    bedrooms: "",
    bathrooms: "",
    materialsString: "",
    duration: ""
  });

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/designs");
      if (!res.ok) throw new Error("Could not retrieve designs database.");
      const data = await res.json();
      setDesigns(data);
    } catch (err: any) {
      setError(err.message || "Failed to load architectural designs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : designs.length - 1));
        setLightboxScale(1);
        setLightboxPosition({ x: 0, y: 0 });
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null && prev < designs.length - 1 ? prev + 1 : 0));
        setLightboxScale(1);
        setLightboxPosition({ x: 0, y: 0 });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, designs]);

  const handleResetZoom = () => {
    setLightboxScale(1);
    setLightboxPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setLightboxScale((prev) => Math.min(4, prev + 0.25));
  };

  const handleZoomOut = () => {
    setLightboxScale((prev) => {
      const next = Math.max(1, prev - 0.25);
      if (next === 1) {
        setLightboxPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    const zoomStep = 0.1;
    const newScale = Math.max(1, Math.min(4, lightboxScale + (e.deltaY < 0 ? zoomStep : -zoomStep)));
    setLightboxScale(newScale);
    if (newScale === 1) {
      setLightboxPosition({ x: 0, y: 0 });
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (lightboxScale <= 1) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    setDragStart({ x: e.clientX - lightboxPosition.x, y: e.clientY - lightboxPosition.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setLightboxPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  const handleManualPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesign.title || !newDesign.description || !newDesign.area) {
      alert("Please populate the required fields.");
      return;
    }

    try {
      const payload = {
        title: newDesign.title,
        style: newDesign.style,
        description: newDesign.description,
        imageUrl: newDesign.imageUrl,
        specifications: {
          area: newDesign.area,
          bedrooms: `${newDesign.bedrooms || "3"} Bedrooms`,
          bathrooms: `${newDesign.bathrooms || "2.5"} Bathrooms`,
          materials: newDesign.materialsString
            ? newDesign.materialsString.split(",").map(m => m.trim())
            : ["Concrete", "Glass", "Timber"],
          duration: newDesign.duration || "12 Months"
        }
      };

      const res = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Could not save custom design to database.");
      const saved = await res.json();
      setDesigns([saved, ...designs]);
      setIsPostingModalOpen(false);
      // Reset
      setNewDesign({
        title: "",
        style: "Modernist",
        description: "",
        imageUrl: HOUSE_PRESETS[0].url,
        area: "",
        bedrooms: "",
        bathrooms: "",
        materialsString: "",
        duration: ""
      });
    } catch (err: any) {
      alert(err.message || "Failed to post custom design.");
    }
  };



  const deleteDesign = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop clicking card
    if (!confirm("Are you sure you want to remove this house design?")) return;

    try {
      const res = await fetch(`/api/designs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete design.");
      setDesigns(designs.filter(d => d.id !== id));
      if (selectedDesign?.id === id) setSelectedDesign(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-100 dark:border-zinc-800 pb-8 mb-12">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold">
            Bespoke Portfolios
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-zinc-900 dark:text-white mt-2 tracking-tight">
            Architectural Designs
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 font-light max-w-2xl">
            A dynamic gallery of our luxury structural blueprints. Browse pre-built styles or publish your custom designs with our high-integrity showcase tool.
          </p>
        </div>

        {/* Actions Button */}
        <div className="mt-6 md:mt-0 flex flex-wrap gap-4">
          <button
            onClick={() => setIsPostingModalOpen(true)}
            className="flex items-center space-x-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-display font-medium text-xs tracking-wider uppercase px-5 py-3 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Post a Design</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-zinc-400 mx-auto" />
          <p className="mt-4 text-zinc-500 font-light text-sm">Retrieving luxury portfolios...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-2xl max-w-xl mx-auto text-center">
          <Info className="w-8 h-8 mx-auto text-red-500" />
          <p className="mt-3 font-medium text-sm">{error}</p>
          <button 
            onClick={fetchDesigns} 
            className="mt-4 text-xs font-mono uppercase tracking-widest underline font-semibold cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      ) : designs.length === 0 ? (
        <div className="py-20 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
          <Compass className="w-12 h-12 text-zinc-400 mx-auto" />
          <h3 className="mt-4 font-display font-bold text-lg text-zinc-800">No house designs found</h3>
          <p className="mt-2 text-zinc-500 font-light text-sm max-w-md mx-auto">
            Get started by posting a brand new house design with our template publisher!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {designs.map((design, idx) => (
            <motion.div 
              key={design.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: Math.min((idx % 3) * 0.08, 0.24), ease: "easeOut" }}
              className="bg-white dark:bg-zinc-900 border border-zinc-100/80 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* House Image Wrapper - click opens full-screen lightbox immediately */}
                <div 
                  onClick={() => {
                    setLightboxIndex(idx);
                    setLightboxScale(1);
                    setLightboxPosition({ x: 0, y: 0 });
                  }}
                  className="aspect-video relative bg-zinc-100 dark:bg-zinc-950 overflow-hidden cursor-zoom-in"
                >
                  <img 
                    referrerPolicy="no-referrer"
                    src={design.imageUrl} 
                    alt={design.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Hover Overlay for Lightbox */}
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white/95 dark:bg-zinc-900/95 text-zinc-900 dark:text-white font-mono text-[9px] tracking-widest uppercase px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-md hover:scale-105 active:scale-95 transition-all border border-zinc-100 dark:border-zinc-800 z-10">
                      <Maximize2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Zoom View</span>
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 bg-zinc-900/90 text-white px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest backdrop-blur-xs z-10">
                    {design.style}
                  </div>
                  <button
                    onClick={(e) => deleteDesign(design.id, e)}
                    className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 p-2 rounded-lg hover:text-red-600 hover:bg-white dark:hover:bg-zinc-700 transition-all shadow-xs z-20"
                    title="Remove from portfolio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
 
                {/* Content - click opens specifications modal */}
                <div 
                  onClick={() => setSelectedDesign(design)}
                  className="p-6 cursor-pointer hover:bg-zinc-50/30 dark:hover:bg-zinc-800/10 transition-colors"
                >
                  <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 tracking-tight leading-snug transition-colors">
                    {design.title}
                  </h3>
                  <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 font-light line-clamp-2 leading-relaxed">
                    {design.description}
                  </p>
                </div>
              </div>
 
              {/* Specs Strip - click opens specifications modal */}
              <div 
                onClick={() => setSelectedDesign(design)}
                className="border-t border-zinc-50 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 px-6 py-4 flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400 cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-zinc-800/20 transition-colors"
              >
                <span className="flex items-center space-x-1">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>{design.specifications.area}</span>
                </span>
                <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-800"></span>
                <span>{design.specifications.bedrooms}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ================= MODAL: MANUAL POST ================= */}
      {isPostingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-zinc-900 dark:text-white">
                Publish a New House Design
              </h2>
              <button 
                onClick={() => setIsPostingModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualPost} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5 font-bold">
                    Design Title *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g., The Solstice Pavilion"
                    value={newDesign.title}
                    onChange={(e) => setNewDesign({ ...newDesign, title: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-zinc-400 dark:focus:outline-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5 font-bold">
                    Architectural Style *
                  </label>
                  <select 
                    value={newDesign.style}
                    onChange={(e) => setNewDesign({ ...newDesign, style: e.target.value as any })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-zinc-400 dark:focus:outline-zinc-600"
                  >
                    <option value="Modernist">Modernist</option>
                    <option value="Scandinavian">Scandinavian</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Eco-Friendly">Eco-Friendly</option>
                    <option value="Custom">Custom / Mid-Century</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5 font-bold">
                  Design Summary & Concept Description *
                </label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Describe the architectural intent, floor plan concept, landscaping integration..."
                  value={newDesign.description}
                  onChange={(e) => setNewDesign({ ...newDesign, description: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-zinc-400 dark:focus:outline-zinc-600"
                />
              </div>

              {/* Architectural Preset Images Selector */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2 font-bold">
                  Select a High-Res Architectural Photo Preset
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {HOUSE_PRESETS.map((preset) => {
                    const isSelected = newDesign.imageUrl === preset.url;
                    return (
                      <div 
                        key={preset.name}
                        onClick={() => setNewDesign({ ...newDesign, imageUrl: preset.url })}
                        className={`cursor-pointer border-2 rounded-xl overflow-hidden relative transition-all group ${
                          isSelected ? "border-zinc-900 dark:border-white scale-[1.02]" : "border-transparent opacity-60 hover:opacity-90"
                        }`}
                      >
                        <img 
                          src={preset.url} 
                          alt={preset.name} 
                          className="w-full h-12 object-cover"
                        />
                        <div className="p-1 text-[8px] text-center bg-zinc-950 text-white truncate">
                          {preset.name}
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full p-0.5">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block">
                    Or input custom image URL:
                  </span>
                  <input 
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newDesign.imageUrl}
                    onChange={(e) => setNewDesign({ ...newDesign, imageUrl: e.target.value })}
                    className="mt-1 w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-zinc-400 dark:focus:outline-zinc-600"
                  />
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                    Area *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g., 3,400 sq ft"
                    value={newDesign.area}
                    onChange={(e) => setNewDesign({ ...newDesign, area: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-zinc-400 dark:focus:outline-zinc-600 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                    Bedrooms
                  </label>
                  <input 
                    type="number"
                    placeholder="3"
                    value={newDesign.bedrooms}
                    onChange={(e) => setNewDesign({ ...newDesign, bedrooms: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-zinc-400 dark:focus:outline-zinc-600 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                    Bathrooms
                  </label>
                  <input 
                    type="text"
                    placeholder="2.5"
                    value={newDesign.bathrooms}
                    onChange={(e) => setNewDesign({ ...newDesign, bathrooms: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-zinc-400 dark:focus:outline-zinc-600 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                    Est. Duration
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g., 12 Months"
                    value={newDesign.duration}
                    onChange={(e) => setNewDesign({ ...newDesign, duration: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-zinc-400 dark:focus:outline-zinc-600 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1 font-bold">
                  Key Construction Materials (comma separated)
                </label>
                <input 
                  type="text"
                  placeholder="e.g., Accoya Wood, Board-Form Concrete, Low-E Glass"
                  value={newDesign.materialsString}
                  onChange={(e) => setNewDesign({ ...newDesign, materialsString: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm focus:outline-zinc-400 dark:focus:outline-zinc-600 text-zinc-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsPostingModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-display font-medium text-xs tracking-wider uppercase px-6 py-2.5 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all cursor-pointer"
                >
                  Publish Design Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DETAIL SHOWCASE ================= */}
      {selectedDesign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto border border-zinc-100 dark:border-zinc-800">
            <div 
              onClick={() => {
                const idx = designs.findIndex((d) => d.id === selectedDesign.id);
                if (idx !== -1) {
                  setLightboxIndex(idx);
                  setLightboxScale(1);
                  setLightboxPosition({ x: 0, y: 0 });
                }
              }}
              className="aspect-video relative bg-zinc-100 dark:bg-zinc-950 cursor-zoom-in group/modalimg"
            >
              <img 
                referrerPolicy="no-referrer"
                src={selectedDesign.imageUrl} 
                alt={selectedDesign.title} 
                className="w-full h-full object-cover transition-all duration-300 group-hover/modalimg:brightness-90"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/modalimg:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <span className="bg-zinc-950/80 text-white font-mono text-[9px] tracking-widest uppercase px-3.5 py-2 rounded-xl flex items-center space-x-1.5 backdrop-blur-xs shadow-md">
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View Fullscreen Zoom</span>
                </span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDesign(null);
                }}
                className="absolute top-4 right-4 bg-zinc-950/80 text-white p-2 rounded-xl hover:bg-zinc-950 transition-all cursor-pointer backdrop-blur-xs z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 bg-zinc-900/90 text-white px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest backdrop-blur-xs z-10">
                {selectedDesign.style}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-widest block mb-1">
                Portfolio Showcase Spec Sheet
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight">
                {selectedDesign.title}
              </h2>
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300 font-light leading-relaxed">
                {selectedDesign.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-zinc-100 dark:border-zinc-800 pt-6 mt-6">
                {/* Structural Specs */}
                <div>
                  <h3 className="font-display font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-3 uppercase tracking-wider font-mono text-[10px]">
                    Dimensions & Capacity
                  </h3>
                  <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                    <div className="flex justify-between border-b border-zinc-50 dark:border-zinc-800 pb-1.5">
                      <span className="text-zinc-400 dark:text-zinc-500">Total Structural Footprint:</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-200">{selectedDesign.specifications.area}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-50 dark:border-zinc-800 pb-1.5">
                      <span className="text-zinc-400 dark:text-zinc-500">Bedroom Quarters:</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-200">{selectedDesign.specifications.bedrooms}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-50 dark:border-zinc-800 pb-1.5">
                      <span className="text-zinc-400 dark:text-zinc-500">Bathroom Suites:</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-200">{selectedDesign.specifications.bathrooms}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-50 dark:border-zinc-800 pb-1.5">
                      <span className="text-zinc-400 dark:text-zinc-500">Project Build Duration:</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-200">{selectedDesign.specifications.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Core Materials */}
                <div>
                  <h3 className="font-display font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-3 uppercase tracking-wider font-mono text-[10px]">
                    Primary Building Block Materials
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDesign.specifications.materials.map((mat, idx) => (
                      <span 
                        key={idx} 
                        className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-200/40 dark:border-zinc-700/40"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Close Button footer */}
              <div className="flex justify-end pt-6 mt-8 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => setSelectedDesign(null)}
                  className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-display font-medium text-xs tracking-wider uppercase px-6 py-3 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all cursor-pointer"
                >
                  Close Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: FULL SCREEN LIGHTBOX OVERLAY ================= */}
      {lightboxIndex !== null && designs[lightboxIndex] && (
        <div 
          className="fixed inset-0 z-50 bg-zinc-950/98 flex flex-col justify-between select-none touch-none"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Top Header Controls Bar */}
          <div className="flex justify-between items-center px-6 py-4 bg-zinc-900/60 backdrop-blur-md border-b border-zinc-800/60 z-10">
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-bold">
                {designs[lightboxIndex].style} • Design {lightboxIndex + 1} of {designs.length}
              </span>
              <h2 className="font-display font-bold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
                {designs[lightboxIndex].title}
              </h2>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleZoomOut}
                disabled={lightboxScale <= 1}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 text-white rounded-lg transition-all cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-zinc-400 font-mono text-[10px] min-w-[3rem] text-center bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800/60">
                {Math.round(lightboxScale * 100)}%
              </span>
              <button 
                onClick={handleZoomIn}
                disabled={lightboxScale >= 4}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-700 text-white rounded-lg transition-all cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button 
                onClick={handleResetZoom}
                disabled={lightboxScale === 1 && lightboxPosition.x === 0 && lightboxPosition.y === 0}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 text-white rounded-lg transition-all cursor-pointer"
                title="Reset View"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <span className="h-5 w-px bg-zinc-800 mx-1"></span>

              <button 
                onClick={() => setLightboxIndex(null)}
                className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg transition-all cursor-pointer border border-red-900/30"
                title="Close Lightbox"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Central Stage Area */}
          <div 
            className="flex-1 relative flex items-center justify-center overflow-hidden w-full p-4"
            onWheel={handleWheel}
          >
            {/* Left Prev Arrow */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : designs.length - 1));
                handleResetZoom();
              }}
              className="absolute left-6 z-10 bg-zinc-900/50 hover:bg-zinc-800 text-white p-3 rounded-full backdrop-blur-sm border border-zinc-800 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-lg"
              title="Previous Design (ArrowLeft)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Immersive Image Display with Zoom/Pan */}
            <div 
              className={`max-w-full max-h-full transition-all flex items-center justify-center ${
                lightboxScale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
              }`}
              onPointerDown={handlePointerDown}
              onClick={(e) => {
                if (lightboxScale === 1) {
                  setLightboxScale(1.75);
                } else if (!isDragging) {
                  handleResetZoom();
                }
              }}
            >
              <img 
                referrerPolicy="no-referrer"
                src={designs[lightboxIndex].imageUrl} 
                alt={designs[lightboxIndex].title} 
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl pointer-events-none select-none"
                style={{
                  transform: `scale(${lightboxScale}) translate(${lightboxPosition.x / lightboxScale}px, ${lightboxPosition.y / lightboxScale}px)`,
                  transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                }}
              />
            </div>

            {/* Right Next Arrow */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev !== null && prev < designs.length - 1 ? prev + 1 : 0));
                handleResetZoom();
              }}
              className="absolute right-6 z-10 bg-zinc-900/50 hover:bg-zinc-800 text-white p-3 rounded-full backdrop-blur-sm border border-zinc-800 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-lg"
              title="Next Design (ArrowRight)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Descriptive Caption Bar */}
          <div className="bg-zinc-900/60 backdrop-blur-md border-t border-zinc-800/60 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-400 gap-2">
            <p className="font-light leading-relaxed max-w-xl">
              {designs[lightboxIndex].description}
            </p>
            <div className="flex items-center space-x-4 font-mono text-[10px] text-zinc-500 whitespace-nowrap">
              <span>Footprint: <strong className="text-zinc-300 font-semibold">{designs[lightboxIndex].specifications.area}</strong></span>
              <span>•</span>
              <span>Bedrooms: <strong className="text-zinc-300 font-semibold">{designs[lightboxIndex].specifications.bedrooms}</strong></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
