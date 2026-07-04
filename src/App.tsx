import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import HomeSection from "./components/HomeSection";
import PortfolioSection from "./components/PortfolioSection";
import BlogSection from "./components/BlogSection";
import ContactSection from "./components/ContactSection";
import { Hammer, Mail, Phone, MapPin, DraftingCompass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored === "dark") return true;
      if (stored === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Track window scrolling progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Recalculate once on mount or when content switches
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentTab]);

  // Automatically scroll to the top of the page when changing tabs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentTab]);

  const renderActiveSection = () => {
    let content;
    switch (currentTab) {
      case "home":
        content = <HomeSection setCurrentTab={setCurrentTab} />;
        break;
      case "designs":
        content = <PortfolioSection />;
        break;
      case "blog":
        content = <BlogSection />;
        break;
      case "calculator":
        content = <ContactSection />;
        break;
      default:
        content = <HomeSection setCurrentTab={setCurrentTab} />;
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="w-full"
        >
          {content}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col justify-between font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900 transition-colors duration-300">
      {/* Subtle Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-zinc-100/50 dark:bg-zinc-900/50 z-[100] pointer-events-none">
        <div 
          className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-75 ease-out shadow-xs shadow-emerald-500/30"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div>
        {/* Navigation Header */}
        <Header 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          isDarkMode={isDarkMode} 
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
        />

        {/* Dynamic Main Body Content */}
        <main className="mt-6">
          {renderActiveSection()}
        </main>
      </div>

      {/* Global Brand Footer */}
      <footer className="bg-zinc-950 text-white border-t border-zinc-900 dark:border-zinc-900 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center">
                <Hammer className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="font-display font-black text-lg tracking-tight uppercase block leading-none text-white">
                  MDHAKA
                </span>
                <span className="block text-[10px] font-mono uppercase tracking-widest text-emerald-500 font-bold mt-1">
                  HOLDING <span className="text-zinc-500 font-medium">Ltd.</span>
                </span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              We design and build contemporary residential masterpiece structures with architectural excellence, material transparency, and sustainable execution.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-zinc-300 mb-4">
              Explore Portal
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-light">
              <li>
                <button 
                  onClick={() => setCurrentTab("home")} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home Portfolio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentTab("designs")} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  House Designs Showcase
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentTab("blog")} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Architectural Blog Showcase
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentTab("calculator")} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Consult Our Builders
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-zinc-300 mb-4">
              Office Hours
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400 font-mono">
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
                <span className="font-sans font-light">Malibu, California</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>+1 (310) 555-0142</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                <span className="font-sans font-light">info@mdhakaholding.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Quality Commitment */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-zinc-300 mb-4">
              Our Invariant
            </h4>
            <p className="text-xs text-zinc-500 font-light leading-relaxed">
              Every detail is deliberate. Every joint, pour, cantilever, and solar grid is engineered to exceed regulatory limits and secure timeless resale value.
            </p>
            <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center space-x-2 text-[10px] font-mono text-zinc-500">
              <Hammer className="w-3.5 h-3.5" />
              <span>SPDX-License-Identifier: Apache-2.0</span>
            </div>
          </div>
        </div>

        {/* Baseline copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-zinc-900 text-center text-[10px] font-mono text-zinc-600">
          © {new Date().getFullYear()} Mdhaka Holding Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
