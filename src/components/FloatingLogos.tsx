// FloatingLogos.tsx - Displays orbital logos dynamically
import React from "react";
import { motion } from "motion/react";
import { FloatingLogoItem } from "../types";

interface FloatingLogosProps {
  logos?: FloatingLogoItem[];
}

interface UIReadyLogo {
  name: string;
  short: string;
  color: string;
  borderColor: string;
  glowColor: string;
  isImage: boolean;
  driveLink?: string;
  iconType: "text" | "svg";
  svgPath?: React.ReactNode;
}

const defaultLogos: UIReadyLogo[] = [
  { 
    name: "Premiere Pro", 
    short: "Pr", 
    color: "bg-gradient-to-br from-[#9c3fc8] to-[#1d0630] text-[#ea9eff]", 
    borderColor: "border-purple-400/35",
    glowColor: "rgba(168, 85, 247, 0.45)",
    isImage: false,
    iconType: "text"
  },
  { 
    name: "After Effects", 
    short: "Ae", 
    color: "bg-gradient-to-br from-[#533fbf] to-[#0d0442] text-[#c4b5ff]", 
    borderColor: "border-indigo-400/35",
    glowColor: "rgba(99, 102, 241, 0.45)",
    isImage: false,
    iconType: "text"
  },
  { 
    name: "Photoshop", 
    short: "Ps", 
    color: "bg-gradient-to-br from-[#1056a1] to-[#04244a] text-[#a4daff]", 
    borderColor: "border-sky-400/35",
    glowColor: "rgba(59, 130, 246, 0.45)",
    isImage: false,
    iconType: "text"
  },
  { 
    name: "CapCut", 
    short: "Cc", 
    color: "bg-gradient-to-br from-[#22d3ee] to-[#0369a1] text-sky-100", 
    borderColor: "border-cyan-300/40",
    glowColor: "rgba(34, 211, 238, 0.45)",
    isImage: false,
    iconType: "text"
  },
  { 
    name: "Canva", 
    short: "Cv", 
    color: "bg-gradient-to-br from-[#00c4cc] via-[#7d2ae8] to-[#250b55] text-white", 
    borderColor: "border-purple-300/40",
    glowColor: "rgba(125, 42, 232, 0.45)",
    isImage: false,
    iconType: "text"
  },
  { 
    name: "DaVinci Resolve", 
    short: "Dr", 
    color: "bg-gradient-to-br from-[#1e293b] to-[#080d1a] text-slate-100", 
    borderColor: "border-slate-400/35",
    glowColor: "rgba(249, 115, 22, 0.4)",
    isImage: false,
    iconType: "svg",
    svgPath: (
      <svg viewBox="0 0 36 36" className="w-7 h-7">
        <circle cx="18" cy="12" r="6" fill="#EA4335" opacity="0.9"/>
        <circle cx="13" cy="21" r="6" fill="#34A853" opacity="0.9"/>
        <circle cx="23" cy="21" r="6" fill="#4285F4" opacity="0.9"/>
      </svg>
    )
  },
  { 
    name: "Audition", 
    short: "Au", 
    color: "bg-gradient-to-br from-[#008f75] to-[#01261f] text-[#a7f3d0]", 
    borderColor: "border-emerald-300/45",
    glowColor: "rgba(16, 185, 129, 0.4)",
    isImage: false,
    iconType: "text"
  },
  { 
    name: "Illustrator", 
    short: "Ai", 
    color: "bg-gradient-to-br from-[#ff7a00] to-[#451400] text-amber-200", 
    borderColor: "border-amber-400/40",
    glowColor: "rgba(245, 158, 11, 0.4)",
    isImage: false,
    iconType: "text"
  },
  { 
    name: "Figma", 
    short: "Fg", 
    color: "bg-gradient-to-br from-[#f24e1e] to-[#26100c] text-rose-200", 
    borderColor: "border-rose-400/40",
    glowColor: "rgba(244, 63, 94, 0.4)",
    isImage: false,
    iconType: "text"
  }
];

const editorHotkeys: Record<string, { tool: string; key: string }> = {
  "premiere pro": { tool: "Razor Cut", key: "C" },
  "after effects": { tool: "RAM Render", key: "Space" },
  "photoshop": { tool: "Undo State", key: "⌘Z" },
  "capcut": { tool: "Split Clip", key: "⌘B" },
  "canva": { tool: "Add Text", key: "T" },
  "davinci resolve": { tool: "Color Match", key: "Shift+9" },
  "audition": { tool: "Noise Filter", key: "⌘R" },
  "figma": { tool: "Scale Layout", key: "K" },
  "illustrator": { tool: "Pen Vector", key: "P" },
};

function getBrandSettings(name: string, index: number) {
  const norm = name.toLowerCase();
  if (norm.includes("premiere") || norm.includes("p pro") || norm === "pr") {
    return {
      short: "Pr",
      color: "bg-gradient-to-br from-[#9c3fc8] to-[#1d0630] text-[#ea9eff]",
      borderColor: "border-purple-300/40",
      glowColor: "rgba(168, 85, 247, 0.45)"
    };
  }
  if (norm.includes("effects") || norm.includes("ae") || norm === "ae") {
    return {
      short: "Ae",
      color: "bg-gradient-to-br from-[#533fbf] to-[#0d0442] text-[#c4b5ff]",
      borderColor: "border-indigo-300/40",
      glowColor: "rgba(99, 102, 241, 0.45)"
    };
  }
  if (norm.includes("photoshop") || norm.includes("ps") || norm === "ps") {
    return {
      short: "Ps",
      color: "bg-gradient-to-br from-[#1056a1] to-[#04244a] text-[#a4daff]",
      borderColor: "border-sky-300/40",
      glowColor: "rgba(59, 130, 246, 0.45)"
    };
  }
  if (norm.includes("audition") || norm === "au") {
    return {
      short: "Au",
      color: "bg-gradient-to-br from-[#008f75] to-[#01261f] text-[#a7f3d0]",
      borderColor: "border-emerald-300/45",
      glowColor: "rgba(16, 185, 129, 0.4)"
    };
  }
  if (norm.includes("capcut") || norm.includes("cap cut") || norm === "cc") {
    return {
      short: "Cc",
      color: "bg-gradient-to-br from-[#22d3ee] to-[#0369a1] text-sky-100",
      borderColor: "border-cyan-300/45",
      glowColor: "rgba(34, 211, 238, 0.45)"
    };
  }
  if (norm.includes("canva")) {
    return {
      short: "Cv",
      color: "bg-gradient-to-br from-[#00c4cc] via-[#7d2ae8] to-[#250b55] text-white",
      borderColor: "border-purple-300/40",
      glowColor: "rgba(125, 42, 232, 0.45)"
    };
  }
  if (norm.includes("davinci") || norm.includes("resolve") || norm === "dr") {
    return {
      short: "Dr",
      color: "bg-gradient-to-br from-[#1e293b] to-[#080d1a] text-slate-100",
      borderColor: "border-slate-400/40",
      glowColor: "rgba(249, 115, 22, 0.4)"
    };
  }
  if (norm.includes("illustrator") || norm === "ai") {
    return {
      short: "Ai",
      color: "bg-gradient-to-br from-[#ff7a00] to-[#451400] text-amber-200",
      borderColor: "border-amber-400/40",
      glowColor: "rgba(245, 158, 11, 0.4)"
    };
  }
  if (norm.includes("blender")) {
    return {
      short: "Bl",
      color: "bg-gradient-to-br from-[#ea580c] to-[#3b120c] text-orange-200",
      borderColor: "border-orange-400/40",
      glowColor: "rgba(234, 88, 12, 0.4)"
    };
  }
  if (norm.includes("figma")) {
    return {
      short: "Fg",
      color: "bg-gradient-to-br from-[#f24e1e] to-[#26100c] text-rose-200",
      borderColor: "border-rose-400/40",
      glowColor: "rgba(244, 63, 94, 0.4)"
    };
  }

  const defaultColors = [
    { short: name.substring(0, 2).toUpperCase(), color: "bg-gradient-to-br from-[#3b82f6] to-[#1e3a8a] text-blue-100", borderColor: "border-blue-400/30", glowColor: "rgba(59, 130, 246, 0.35)" },
    { short: name.substring(0, 2).toUpperCase(), color: "bg-gradient-to-br from-[#10b981] to-[#064e3b] text-emerald-100", borderColor: "border-emerald-400/30", glowColor: "rgba(16, 185, 129, 0.35)" },
    { short: name.substring(0, 2).toUpperCase(), color: "bg-gradient-to-br from-[#ec4899] to-[#500724] text-pink-100", borderColor: "border-pink-400/30", glowColor: "rgba(236, 72, 153, 0.35)" }
  ];
  return defaultColors[index % defaultColors.length];
}

export default function FloatingLogos({ logos }: FloatingLogosProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const renderedLogos = React.useMemo<UIReadyLogo[]>(() => {
    if (logos && logos.length > 0) {
      return logos.map((item, idx) => {
        const isImage = !!(
          item.driveLink && 
          item.driveLink.startsWith("http") && 
          !item.driveLink.includes("drive.google.com/.") &&
          item.driveLink.length > 30
        );
        const brand = getBrandSettings(item.name, idx);
        
        return {
          name: item.name,
          short: brand.short,
          color: brand.color,
          borderColor: brand.borderColor,
          glowColor: brand.glowColor,
          isImage,
          driveLink: item.driveLink,
          iconType: isImage ? "svg" : "text"
        };
      });
    }
    return defaultLogos;
  }, [logos]);

  const totalLogos = renderedLogos.length;
  // Dynamic radius: keeps clear of Dhiraj's center portrait
  const radius = isMobile ? 142 : 212;

  return (
    <div id="floating-orbit-container" className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
      
      {/* Decorative Orbits */}
      <div className="absolute w-[280px] h-[280px] sm:w-[410px] sm:h-[410px] rounded-full border border-indigo-500/10 pointer-events-none" />
      <div className="absolute w-[295px] h-[295px] sm:w-[430px] sm:h-[430px] rounded-full border border-dashed border-indigo-500/15 animate-[spin_120s_linear_infinite] pointer-events-none" />

      {/* DYNAMIC GLOWING LASER LINES (Centrally focused, sits mathematically behind the logos but in front of the background) */}
      <svg className="absolute w-[500px] h-[500px] pointer-events-none overflow-visible z-0" viewBox="0 0 500 500">
        {renderedLogos.map((logo, idx) => {
          const angle = (idx * (360 / totalLogos)) * (Math.PI / 180);
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          
          const isSelected = hoveredIndex === idx;
          const laserColor = 
            logo.name.toLowerCase().includes("premiere") ? "#ea9eff" :
            logo.name.toLowerCase().includes("effects") ? "#c4b5ff" :
            logo.name.toLowerCase().includes("photoshop") ? "#60a5fa" :
            logo.name.toLowerCase().includes("capcut") ? "#22d3ee" :
            logo.name.toLowerCase().includes("canva") ? "#c084fc" :
            logo.name.toLowerCase().includes("resolve") ? "#fb923c" :
            logo.name.toLowerCase().includes("figma") ? "#f43f5e" :
            logo.name.toLowerCase().includes("illustrator") ? "#f59e0b" : 
            "#818cf8";

          return (
            <g key={`laser-link-${idx}`}>
              {/* Thin subtle background grid line */}
              <line
                x1={250}
                y1={250}
                x2={250 + x}
                y2={250 + y}
                stroke="rgba(99, 102, 241, 0.08)"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              
              {/* Fast active animated glowing laser beam on hover */}
              {isSelected && (
                <>
                  {/* Outer glowing laser halo flare */}
                  <motion.line
                    x1={250}
                    y1={250}
                    x2={250 + x}
                    y2={250 + y}
                    stroke={laserColor}
                    strokeWidth={2}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    style={{ filter: `blur(2px) drop-shadow(0 0 8px ${logo.glowColor})` }}
                  />
                  {/* High-intensity secondary core line */}
                  <motion.line
                    x1={250}
                    y1={250}
                    x2={250 + x}
                    y2={250 + y}
                    stroke="#ffffff"
                    strokeWidth={0.75}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  />
                  {/* Reactive splash flare rings */}
                  <motion.circle
                     cx={250 + x}
                     cy={250 + y}
                     r={5}
                     fill={laserColor}
                     animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
                     transition={{ repeat: Infinity, duration: 1.2 }}
                  />
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* FLOATING LOGO INTERACTIVE AVATARS */}
      {renderedLogos.map((logo, idx) => {
        const angle = (idx * (360 / totalLogos)) * (Math.PI / 180);
        const x = Math.round(radius * Math.cos(angle));
        const y = Math.round(radius * Math.sin(angle));

        const normName = logo.name.toLowerCase();
        const matchedKey = Object.keys(editorHotkeys).find(k => normName.includes(k));
        const hotkey = matchedKey ? editorHotkeys[matchedKey] : { tool: "Modifier Option", key: "Alt" };

        const isHovered = hoveredIndex === idx;

        // Custom organic drifting vectors to let the icons float freely and naturally over the viewport
        const driftX = [x, x + (idx % 2 === 0 ? 12 : -12), x + (idx % 3 === 0 ? -6 : 6), x];
        const driftY = [y, y + (idx % 2 === 0 ? -14 : 14), y + (idx % 3 === 0 ? 8 : -8), y];
        const driftRotate = [0, idx % 2 === 0 ? 4 : -4, idx % 3 === 0 ? -2 : 2, 0];

        const animX = isMobile ? x : (isHovered ? x : driftX);
        const animY = isMobile ? y : (isHovered ? y : driftY);
        const animRotate = isMobile ? 0 : (isHovered ? 0 : driftRotate);

        return (
          <motion.div
            id={`orbital-logo-${logo.name.replace(/\s+/g, "-")}`}
            key={logo.name + "-plot-" + idx}
            className="absolute pointer-events-auto z-20"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              x: animX,
              y: animY,
              rotate: animRotate,
              scale: isHovered ? (isMobile ? 1.15 : 1.25) : 1
            }}
            transition={isMobile ? {
              type: "spring",
              stiffness: 150,
              damping: 20
            } : {
              x: {
                duration: 8 + (idx % 3) * 2,
                repeat: Infinity,
                ease: "easeInOut"
              },
              y: {
                duration: 9 + (idx % 3) * 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              },
              rotate: {
                duration: 10 + (idx % 3) * 3,
                repeat: Infinity,
                ease: "easeInOut"
              },
              scale: {
                type: "spring",
                stiffness: 280,
                damping: 18
              },
              default: {
                type: "spring",
                stiffness: 110,
                damping: 14
              }
            }}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Immersive technical HUD tooltip on hover */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-slate-950/95 border border-indigo-500/40 text-white text-[10px] font-semibold py-1.5 px-3 rounded-xl whitespace-nowrap shadow-xl flex flex-col items-center gap-0.5 z-40 animate-pulse-slow"
                style={{
                  boxShadow: `0 10px 25px -5px rgba(0,0,0,0.5), 0 0 15px -2px ${logo.glowColor}`
                }}
              >
                <span className="font-sans text-[11.5px] tracking-wide text-white font-extrabold uppercase">{logo.name}</span>
                <span className="font-mono text-[9.5px] text-[#c4b5ff] flex items-center gap-1 font-bold animate-[pulse_2s_infinite]">
                  Hotkey: <span className="bg-[#4f46e5]/45 border border-indigo-500/35 px-1.5 py-0.5 rounded text-white font-extrabold tracking-wide">{hotkey.key}</span> • {hotkey.tool}
                </span>
              </motion.div>
            )}

            {/* Bubble Button containing the graphic design and micro hotkey cap */}
            <div 
              className={`
                relative flex items-center justify-center w-12 h-12 rounded-full
                border ${logo.borderColor} ${logo.color}
                font-bold text-sm tracking-wide select-none cursor-pointer overflow-hidden
              `}
              title={logo.name}
              style={{
                boxShadow: isMobile
                  ? undefined
                  : (isHovered 
                      ? `0 12px 24px -2px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255, 255, 255, 0.4), 0 0 20px ${logo.glowColor}`
                      : `0 6px 12px 0 rgba(0, 0, 0, 0.18), inset 0 2px 4px rgba(255, 255, 255, 0.35), 0 0 10px ${logo.glowColor}`),
              }}
            >
              {isHovered && (
                <div className="absolute inset-0 bg-transparent rounded-full border border-white/40 animate-ping opacity-45 pointer-events-none" />
              )}

              {logo.isImage ? (
                <img 
                  src={logo.driveLink} 
                  alt={logo.name} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : logo.iconType === "text" ? (
                <span className="font-sans antialiased text-base leading-none tracking-tight font-black">{logo.short}</span>
              ) : (
                logo.svgPath
              )}

              {/* Physical mechanical keyboard-style switches keycap tag overlaid onto the bubble border */}
              <div 
                className="
                  absolute -bottom-1 -right-1 bg-slate-950/90 text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded border border-white/25 text-[#a5b4fc] shadow-md z-30 pointer-events-none transition-all duration-300
                "
              >
                {hotkey.key}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
