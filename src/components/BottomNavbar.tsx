import React from "react";
import { motion } from "motion/react";
import { 
  Home, 
  Video, 
  Briefcase, 
  Code, 
  FileText, 
  Mail, 
  Compass 
} from "lucide-react";

interface BottomNavbarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  onExploreClick: () => void;
}

export default function BottomNavbar({
  currentTab,
  setTab,
  onExploreClick,
}: BottomNavbarProps) {
  const items = [
    { id: "home", label: "home", icon: Home },
    { id: "videos", label: "VIDEOS", icon: Video },
    { id: "projects", label: "EXPIRINCE", icon: Briefcase },
    { id: "skills", label: "SKILLS", icon: Code },
    { id: "resume", label: "RESUME", icon: FileText },
    { id: "contact", label: "CONTACT DETAILS", icon: Mail },
  ];

  return (
    <div id="bottom-navbar-container" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 pointer-events-none">
      <div 
        id="bottom-navbar"
        className="
          pointer-events-auto
          flex items-center justify-between gap-1 md:gap-3 px-4 py-2.5 
          liquid-glass-card rounded-[26px] relative
        "
      >
        {/* Real 3D Physical Glare Highlights for High-End Glassmorphism */}
        <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/30 to-white/0 pointer-events-none rounded-t-[26px]" />
        <div className="absolute inset-[1.5px] rounded-[24.5px] border border-white/40 pointer-events-none -z-10" />

        {/* Glow border ring behind the capsule navbar */}
        <div className="absolute inset-0 -z-10 rounded-[26px] bg-gradient-to-r from-blue-400/5 via-indigo-400/5 to-pink-400/5 blur-xl pointer-events-none" />

        <div className="flex items-center gap-1 md:gap-1.5 font-sans">
          {items.slice(0, 3).map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                id={`nav-item-${item.id}`}
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`
                  relative flex flex-col md:flex-row items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold tracking-wide 
                  transition-all duration-300 cursor-pointer
                  ${isActive 
                    ? "text-blue-600 bg-white/60 shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-white/50" 
                    : "text-slate-700 hover:text-blue-600 hover:bg-white/20"}
                `}
              >
                <Icon size={16} className={isActive ? "stroke-[2.5px]" : "stroke-[2px]"} />
                <span className="hidden sm:inline">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-blue-500 sm:hidden"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Center Illuminated Button: Explore My World */}
        <motion.button
          id="explore-world-btn"
          onClick={onExploreClick}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: "0 8px 24px rgba(79, 70, 229, 0.25)",
            y: -2 
          }}
          whileTap={{ scale: 0.95 }}
          className="
            flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-500
            text-white text-xs md:text-sm font-bold tracking-wide rounded-2xl shadow-md border border-white/20 cursor-pointer
          "
        >
          <Compass size={16} className="animate-spin-slow" />
          <span className="font-bold">Explore My World</span>
        </motion.button>

        <div className="flex items-center gap-1 md:gap-1.5 font-sans">
          {items.slice(3).map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                id={`nav-item-${item.id}`}
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`
                  relative flex flex-col md:flex-row items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold tracking-wide 
                  transition-all duration-300 cursor-pointer
                  ${isActive 
                    ? "text-blue-600 bg-white/60 shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-white/50" 
                    : "text-slate-700 hover:text-blue-600 hover:bg-white/20"}
                `}
              >
                <Icon size={16} className={isActive ? "stroke-[2.5px]" : "stroke-[2px]"} />
                <span className="hidden sm:inline">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-blue-500 sm:hidden"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
