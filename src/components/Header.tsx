import React, { useState } from "react";
import { DraftingCompass, Hammer, BookOpen, Mail, Sun, Moon, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ currentTab, setCurrentTab, isDarkMode, toggleDarkMode }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "home", label: "Home Portfolio", icon: Hammer },
    { id: "designs", label: "House Designs", icon: DraftingCompass },
    { id: "blog", label: "Blog Showcase", icon: BookOpen },
    { id: "calculator", label: "Consult Builders", icon: Mail },
  ];

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => handleTabClick("home")} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-emerald-600 dark:bg-emerald-500 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs shadow-emerald-600/10">
              <Hammer className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-tight text-zinc-900 dark:text-white uppercase leading-none block">
                MDHAKA
              </span>
              <span className="block text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                HOLDING <span className="text-zinc-500 dark:text-zinc-400 font-medium">Ltd.</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <Sun className="w-4.5 h-4.5 text-amber-400" />
              ) : (
                <Moon className="w-4.5 h-4.5" />
              )}
            </button>

            {/* Desktop Consult Action */}
            <button
              onClick={() => handleTabClick("calculator")}
              className="hidden sm:inline-flex font-display font-semibold text-xs tracking-wider uppercase bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:text-zinc-950 px-5 py-2.5 rounded-lg transition-all shadow-xs cursor-pointer"
            >
              Consult Builders
            </button>

            {/* Mobile Menu Toggle button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-4.5 h-4.5" />
              ) : (
                <Menu className="w-4.5 h-4.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Animated Dropdown Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1.5 shadow-inner">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}

              {/* Mobile Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => handleTabClick("calculator")}
                  className="w-full flex items-center justify-center space-x-2 font-display font-semibold text-xs tracking-wider uppercase bg-emerald-600 text-white dark:bg-emerald-500 dark:text-zinc-950 py-3.5 rounded-xl hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-all shadow-xs cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Consult Builders</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
