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

const getTabColors = (tabId: string) => {
  switch (tabId) {
    case "home":
      return { 
        text: "text-blue-600", 
        activeBg: "bg-blue-50/90 border-blue-100/80", 
        indicator: "bg-blue-500", 
        glow: "rgba(59, 130, 246, 0.2)" 
      };
    case "videos":
      return { 
        text: "text-purple-600", 
        activeBg: "bg-purple-50/90 border-purple-100/80", 
        indicator: "bg-purple-500", 
        glow: "rgba(168, 85, 247, 0.2)" 
      };
    case "projects":
      return { 
        text: "text-cyan-600", 
        activeBg: "bg-cyan-50/90 border-cyan-100/80", 
        indicator: "bg-cyan-500", 
        glow: "rgba(6, 182, 212, 0.2)" 
      };
    case "skills":
      return { 
        text: "text-indigo-600", 
        activeBg: "bg-indigo-50/90 border-indigo-100/80", 
        indicator: "bg-indigo-500", 
        glow: "rgba(79, 70, 229, 0.2)" 
      };
    case "resume":
      return { 
        text: "text-emerald-700", 
        activeBg: "bg-emerald-50/90 border-emerald-100/80", 
        indicator: "bg-emerald-600", 
        glow: "rgba(16, 185, 129, 0.2)" 
      };
    case "contact":
      return { 
        text: "text-rose-600", 
        activeBg: "bg-rose-50/90 border-rose-100/80", 
        indicator: "bg-rose-500", 
        glow: "rgba(244, 63, 94, 0.2)" 
      };
    default:
      return { 
        text: "text-indigo-600", 
        activeBg: "bg-indigo-50/90 border-indigo-100/80", 
        indicator: "bg-indigo-500", 
        glow: "rgba(79, 70, 229, 0.15)" 
      };
  }
};

export default function BottomNavbar({
  currentTab,
  setTab,
  onExploreClick,
}: BottomNavbarProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const items = [
    { id: "home", label: "HOME", icon: Home },
    { id: "videos", label: "VIDEOS", icon: Video },
    { id: "projects", label: "EXP", icon: Briefcase },
    { id: "explore", label: "EXPLORE", icon: Compass }, // Premium Center Piece
    { id: "skills", label: "SKILLS", icon: Code },
    { id: "resume", label: "RESUME", icon: FileText },
    { id: "contact", label: "CONTACT", icon: Mail },
  ];

  return (
    <div 
      id="bottom-navbar-container" 
      className="fixed bottom-5 sm:bottom-6 left-1/2 z-[9999] w-[96%] max-w-2xl px-1 sm:px-2 pointer-events-none"
      style={{ transform: "translateX(-50%)" }}
    >
      {/* Visual background atmospheric glow - Hidden on mobile screens */}
      {!isMobile && (
        <div className="absolute inset-x-4 -top-3 bottom-0 -z-20 rounded-[28px] bg-gradient-to-r from-[#3b82f6]/10 via-[#6366f1]/10 to-[#ec4899]/10 blur-xl pointer-events-none opacity-80" />
      )}

      <div 
        id="bottom-navbar"
        className="
          pointer-events-auto
          flex items-center justify-between gap-0.5 sm:gap-1.5 px-2.5 py-2 sm:py-2.5
          bg-white/70 backdrop-blur-2xl border border-white/80 rounded-[24px] sm:rounded-[26px] relative w-full overflow-visible
          shadow-[0_16px_40px_rgba(15,23,42,0.18),0_0_1px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.7)]
        "
      >
        {/* Specular glare effects */}
        <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/35 to-white/0 pointer-events-none rounded-t-[24px] sm:rounded-t-[26px]" />
        <div className="absolute inset-[1px] rounded-[23px] sm:rounded-[25px] border border-white/65 pointer-events-none -z-10" />

        {/* Dynamic content wrapper */}
        <div className="flex items-center justify-between w-full min-h-[46px] relative z-10 gap-0.5 sm:gap-1 font-sans">
          {items.map((item) => {
            if (item.id === "explore") {
              return (
                <div 
                  key="explore" 
                  className="flex-none flex items-center justify-center px-0.5 sm:px-1"
                >
                  {isMobile ? (
                    <button
                      id="explore-world-btn"
                      onClick={onExploreClick}
                      className="
                        flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500
                        text-white text-[7px] xs:text-[8px] sm:text-[9.5px] md:text-xs font-black tracking-wider rounded-xl sm:rounded-2xl border border-white/20 cursor-pointer select-none whitespace-nowrap
                      "
                    >
                      <Compass size={14} className="shrink-0" />
                      <span className="font-extrabold uppercase leading-none select-none">Explore</span>
                    </button>
                  ) : (
                    <motion.button
                      id="explore-world-btn"
                      onClick={onExploreClick}
                      whileHover={{ 
                        scale: 1.06, 
                        boxShadow: "0 8px 24px rgba(79, 70, 229, 0.35)",
                        y: -1
                      }}
                      whileTap={{ scale: 0.94 }}
                      className="
                        flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500
                        text-white text-[7px] xs:text-[8px] sm:text-[9.5px] md:text-xs font-black tracking-wider rounded-xl sm:rounded-2xl shadow-lg border border-white/20 cursor-pointer select-none whitespace-nowrap
                      "
                    >
                      <Compass size={14} className="animate-spin-slow shrink-0" />
                      <span className="font-extrabold uppercase leading-none select-none">Explore</span>
                    </motion.button>
                  )}
                </div>
              );
            }

            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const theme = getTabColors(item.id);

            return (
              <button
                id={`nav-item-${item.id}`}
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`
                  relative flex flex-col items-center justify-center text-center gap-0.5 sm:gap-1.5 px-1 py-1 rounded-xl sm:rounded-2xl select-none cursor-pointer transition-all duration-300 min-w-0 flex-1 h-full max-w-[85px] outline-none
                  ${isActive 
                    ? "scale-105" 
                    : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50/80"}
                `}
              >
                {/* Active option bubble overlay */}
                {isActive && (
                  isMobile ? (
                    <div
                      className={`absolute inset-0 ${theme.activeBg} rounded-xl sm:rounded-2xl border border-white/75 -z-10`}
                      style={{
                        boxShadow: `0 3px 8px ${theme.glow}, inset 0 1px 1px rgba(255,255,255,0.8)`
                      }}
                    />
                  ) : (
                    <motion.div
                      layoutId="navbar-active-bubble"
                      className={`absolute inset-0 ${theme.activeBg} rounded-xl sm:rounded-2xl border border-white/75 -z-10`}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 26,
                        mass: 0.8
                      }}
                      style={{
                        boxShadow: `0 6px 14px ${theme.glow}, inset 0 1px 2px rgba(255,255,255,0.85)`
                      }}
                    />
                  )
                )}
                
                <Icon 
                  size={16} 
                  className={`shrink-0 relative z-10 transition-all duration-300 ${isActive ? `stroke-[2.5px] ${theme.text} scale-110` : "stroke-[2px] text-slate-550"}`} 
                />
                
                <span className={`text-[7px] xs:text-[8.5px] sm:text-[9.5px] font-bold leading-none select-none tracking-tight uppercase truncate max-w-full relative z-10 transition-colors duration-200 ${isActive ? `${theme.text} font-black` : "text-slate-550"}`}>
                  {item.label}
                </span>

                {isActive && (
                  isMobile ? (
                    <div
                      className={`absolute bottom-[1px] left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full ${theme.indicator} z-10`}
                    />
                  ) : (
                    <motion.div
                      layoutId="active-indicator"
                      className={`absolute bottom-[1px] left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full ${theme.indicator} z-10`}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 22
                      }}
                    />
                  )
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
