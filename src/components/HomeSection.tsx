import React from "react";
import { ArrowUpRight, ShieldCheck, Compass, Trees, Award, ArrowRight } from "lucide-react";

interface HomeSectionProps {
  setCurrentTab: (tab: string) => void;
}

export default function HomeSection({ setCurrentTab }: HomeSectionProps) {
  const metrics = [
    { value: "140+", label: "Beautiful Houses Designed", icon: Compass },
    { value: "100%", label: "Eco-Friendly Wood Used", icon: Trees },
    { value: "18", label: "National Design Awards", icon: Award },
    { value: "25 yr", label: "Structural Warranty", icon: ShieldCheck },
  ];

  const services = [
    {
      title: "Custom Home Design",
      description: "We plan and build modern, comfortable custom homes. We design beautiful layouts that bring natural light and fresh air into your living spaces.",
      tags: ["Modern Styles", "Custom Layouts", "Bright Spaces"]
    },
    {
      title: "Eco-Friendly Construction",
      description: "We build homes that are good for the environment. We use natural wood, smart solar power, and energy-saving designs to lower your energy bills.",
      tags: ["Solar Power", "Eco Materials", "Low Energy"]
    },
    {
      title: "Home Renovation & Upgrades",
      description: "We update older homes to make them modern and energy-efficient. We add great insulation and new windows while keeping the classic look you love.",
      tags: ["Better Insulation", "New Windows", "Modern Heating"]
    }
  ];

  const showcaseProjects = [
    {
      title: "The Obsidian Villa",
      location: "Malibu, California",
      imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
      description: "Brutalist raw concrete combined with structural black steel and massive glass spans."
    },
    {
      title: "fjord-A-Frame",
      location: "Lofoten, Norway",
      imageUrl: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
      description: "An isolated mountain-front chalet wrapped in charred Kebony wood cladding."
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative bg-zinc-950 text-white overflow-hidden py-24 sm:py-32 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6">
        <div className="absolute inset-0 opacity-45 mix-blend-overlay">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80" 
            alt="Luxury home construction site" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center sm:text-left">
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-3.5 py-1.5 rounded-full backdrop-blur-md">
            Premium Custom Homes • Quality Construction
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-6xl tracking-tight text-white mt-6 max-w-4xl leading-[1.1]">
            We Build Beautiful Homes to Last for Generations
          </h1>
          <p className="mt-6 text-lg text-zinc-300 max-w-2xl font-light">
            We design and build high-quality, modern homes that are comfortable, save energy, and include the latest smart technology.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 justify-center sm:justify-start">
            <button
              onClick={() => setCurrentTab("designs")}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white text-zinc-950 font-display font-medium text-sm tracking-wider uppercase px-8 py-4 rounded-xl hover:bg-zinc-100 transition-all cursor-pointer"
            >
              <span>Explore Custom Designs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentTab("blog")}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-display font-medium text-sm tracking-wider uppercase px-8 py-4 rounded-xl hover:bg-zinc-800 transition-all cursor-pointer"
            >
              <span>Read Our Design Blog</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div 
                key={idx} 
                className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100/80 dark:border-zinc-800 rounded-2xl p-8 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <span className="font-display font-bold text-4xl text-zinc-900 dark:text-white tracking-tight">{m.value}</span>
                  <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100/40 dark:border-emerald-900/25 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <p className="mt-4 text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">
                  {m.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold">
            What We Do Best
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-zinc-950 dark:text-white mt-4 tracking-tight">
            How We Build Your Dream Home
          </h2>
          <div className="w-12 h-1 bg-emerald-600 dark:bg-emerald-500 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((svc, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 rounded-2xl hover:border-emerald-500/40 dark:hover:border-emerald-500/30 hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest block mb-4">
                  Capability 0{idx + 1}
                </span>
                <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white tracking-tight leading-snug">
                  {svc.title}
                </h3>
                <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300 font-light leading-relaxed">
                  {svc.description}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {svc.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="font-mono text-[10px] uppercase text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/30 dark:border-emerald-900/10 px-2.5 py-1 rounded-md font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold">
              Featured Projects
            </span>
            <h2 className="font-display font-bold text-3xl text-zinc-950 dark:text-white mt-3 tracking-tight">
              Beautiful Home Styles We Built
            </h2>
          </div>
          <button 
            onClick={() => setCurrentTab("designs")}
            className="flex items-center space-x-2 text-sm text-zinc-900 dark:text-zinc-100 font-semibold hover:text-zinc-700 dark:hover:text-zinc-300 transition-all cursor-pointer mt-4 sm:mt-0 font-mono uppercase tracking-widest"
          >
            <span>View All House Designs</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {showcaseProjects.map((proj, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentTab("designs")}
              className="group cursor-pointer"
            >
              <div className="overflow-hidden rounded-2xl aspect-video relative bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                <img 
                  src={proj.imageUrl} 
                  alt={proj.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute top-4 left-4 bg-zinc-950/80 text-white px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest backdrop-blur-xs">
                  {proj.location}
                </div>
              </div>
              <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white mt-5 flex items-center justify-between">
                <span>{proj.title}</span>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                {proj.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Content Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-8 sm:p-16 border border-zinc-100 dark:border-zinc-800 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold block mb-4">
              Building Guides & Tips
            </span>
            <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-white tracking-tight leading-snug">
              Get Helpful Home Building and Renovation Tips
            </h2>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300 font-light leading-relaxed">
              We write helpful articles on how to choose the best building materials, save money on energy, and pick the perfect layout for your family.
            </p>
          </div>
          <div>
            <button 
              onClick={() => setCurrentTab("blog")}
              className="bg-emerald-600 text-white dark:bg-emerald-500 dark:text-zinc-950 font-display font-semibold text-xs tracking-wider uppercase px-8 py-4 rounded-xl hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-all shadow-xs cursor-pointer"
            >
              Browse Blog & Design Articles
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
