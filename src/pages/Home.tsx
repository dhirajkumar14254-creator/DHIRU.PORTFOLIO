import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Sliders, 
  Volume2, 
  Cpu, 
  Camera, 
  Activity, 
  Layers, 
  Settings, 
  Sparkles, 
  SlidersHorizontal, 
  Eye, 
  Play, 
  Disc, 
  Flame, 
  Workflow, 
  FileText,
  MousePointerClick,
  X,
  Printer,
  Phone,
  Mail,
  MapPin,
  ExternalLink
} from "lucide-react";
import FloatingLogos from "../components/FloatingLogos";
import { resolveImageUrl, getDriveFileId, resolveResumeUrl } from "../utils/googleSheet";
import { PortfolioData, VideoItem } from "../types";
import homeAvatar from "../assets/images/regenerated_image_1780580606806.png";

interface HomeProps {
  portfolioData: PortfolioData;
  onNavToVideos: () => void;
  onPlayFloatingVdo: (vdo: VideoItem) => void;
}

export default function Home({ portfolioData, onNavToVideos, onPlayFloatingVdo }: HomeProps) {
  if (!portfolioData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 animate-spin" />
      </div>
    );
  }

  // Live customizable states for the premium deck artifacts on left/right margins
  const [audioGain, setAudioGain] = useState(82);
  const [colorTemp, setColorTemp] = useState(5600);
  const [exposure, setExposure] = useState(0.1);
  const [selectedLut, setSelectedLut] = useState("COBALT_PRO");

  // Custom compiled CV overlay state
  const [isCvOpen, setIsCvOpen] = useState(false);

  // Detect if Google Sheet custom images are available inside our parsed map
  const sheetAvatarAvailable = !!(
    portfolioData?.avatarImageMap &&
    Object.keys(portfolioData.avatarImageMap).length > 0 &&
    Object.values(portfolioData.avatarImageMap).some(url => url && (url.startsWith("http") || url.startsWith("/")))
  );

  // Dynamically load the centerpiece home image from Google Sheet's HOME CENTER VIDEO TAB CORNER section if configured, otherwise fallback
  const activeAvatarImageUrl = portfolioData?.homeCenterImage || homeAvatar;

  // Safely resolve CV HTML link from Google Sheet's RESUME tab (or fallback to elegant defaults)
  const cvLinkItem = portfolioData.resume && portfolioData.resume[0];
  let cvHtmlLink = cvLinkItem 
    ? (cvLinkItem.htmlLink || cvLinkItem.resumeLink || cvLinkItem.pdfDriveLink || "https://docs.google.com/document/d/1O0K16YI-6rsm_1u7vWk7NfE-Bshh5m-iF_T6Zp6iXvY/pub")
    : "https://docs.google.com/document/d/1O0K16YI-6rsm_1u7vWk7NfE-Bshh5m-iF_T6Zp6iXvY/pub";

  if (cvHtmlLink) {
    const driveFileId = getDriveFileId(cvHtmlLink);
    if (driveFileId) {
      cvHtmlLink = `https://drive.google.com/file/d/${driveFileId}/preview`;
    } else if (cvHtmlLink.startsWith("file://") || cvHtmlLink.includes("Users/") || cvHtmlLink.includes("Downloads/")) {
      cvHtmlLink = "/dhiraj_kumar_cv.html";
    }
  }

  // Split name elegantly for high-contrast dual rendering
  const fullName = portfolioData.name || "Dhiraj Kumar";
  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || "Dhiraj";
  const lastName = nameParts.slice(1).join(" ") || "Kumar";

  return (
    <div id="home-page-viewport" className="relative w-full min-h-screen flex flex-col justify-between py-24 px-4 overflow-hidden select-none">
      
      {/* TOP: Welcome section quote bar pill matching the picture layout */}
      <div id="top-welcome-banner" className="w-full flex justify-center pointer-events-none mb-6 z-20 font-sans">
        <motion.div
          id="welcome-quote-pill"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="
            pointer-events-auto
            px-10 sm:px-14 py-3 bg-white/10 backdrop-blur-3xl border border-white/95 rounded-full
            flex items-center justify-center font-bold text-xs sm:text-sm text-center tracking-[0.3em] font-sans text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 uppercase bubble-gloss
          "
        >
          <span>
            {portfolioData.welcomeSection || "WELCOME SECTION"}
          </span>
        </motion.div>
      </div>

      {/* CENTER: Majestic Enlarged Centerpiece with Floating Orbit Software Logos */}
      <div id="center-grand-layout" className="flex flex-col items-center justify-center flex-grow py-6 relative z-10 w-full">
        
        {/* Orbit, Backdrop Halos, and Avatar Container */}
        <div id="center-canvas-orbit" className="relative w-[340px] h-[340px] sm:w-[450px] sm:h-[450px] rounded-full flex items-center justify-center select-none">
          
          {/* Advanced Camera Viewfinder Corner Markers */}
          <div className="absolute -inset-4 sm:-inset-8 border border-slate-400/20 rounded-[32px] pointer-events-none">
            {/* Top-Left Bracket */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-indigo-500/50 rounded-tl-xl" />
            {/* Top-Right Bracket */}
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-indigo-500/50 rounded-tr-xl" />
            {/* Bottom-Left Bracket */}
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-indigo-500/50 rounded-bl-xl" />
            {/* Bottom-Right Bracket */}
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-indigo-500/50 rounded-br-xl" />
            
            {/* HUD Technical Status lines */}
            <div className="absolute top-3 left-4 flex items-center gap-1.5 text-[9px] font-mono font-bold text-indigo-500/80 bg-slate-100/80 border border-slate-200/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span>REC 10-BIT</span>
              <span className="text-slate-350">•</span>
              <span>4K UHD 60FPS</span>
            </div>

            <div className="absolute top-3 right-4 flex items-center gap-1 text-[9px] font-mono font-bold text-slate-500/80 bg-slate-100/80 border border-slate-200/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
              <span>LUT: COBALT_PRO_LOG</span>
            </div>
          </div>

          {/* Outer Ring Orbits */}
          <div className="absolute inset-0 rounded-full border border-white/20 animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-6 rounded-full border border-dashed border-indigo-500/25 animate-[spin_60s_linear_infinite]" />
          
          {/* SATURN SHIELDMORPHIC RING - Premium Cosmic Detail */}
          <div className="absolute -inset-x-12 h-[28px] bg-gradient-to-r from-blue-300/35 via-indigo-400/40 to-pink-300/5 rotate-[-22deg] rounded-full border border-white/30 blur-[1px] transform translate-y-2 pointer-events-none skew-y-2 skew-x-2 shadow-sm z-10 animate-pulse" />

          {/* Floating Neon Backdrop Glow */}
          <div 
            className="absolute w-[290px] h-[290px] sm:w-[350px] sm:h-[350px] rounded-full transition-all duration-300"
            style={{
              background: "radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(244, 63, 94, 0.12) 50%, transparent 80%)",
              filter: "blur(12px)"
            }}
          />

          {/* EDITING INTERFACE OVERLAY 1: FLOATING GLASS DECIBEL MIXER PANEL */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 100 }}
            className="absolute -left-12 sm:-left-20 top-16 z-30 select-none pointer-events-auto filter drop-shadow-lg"
          >
            <div className="p-3 bg-white/75 backdrop-blur-xl border border-white/95 rounded-2xl flex flex-col gap-2.5 shadow-xl min-w-[70px] sm:min-w-[85px]">
              <div className="flex justify-between items-center text-[8px] font-extrabold font-mono text-indigo-600 tracking-wider">
                <span>MIXER v1</span>
                <span className="text-emerald-500 font-bold">L•R</span>
              </div>
              
              {/* Bouncing Audio Equalizers */}
              <div className="flex items-end justify-between h-14 px-1 gap-1">
                {[1, 2, 3, 4].map((bar) => {
                  const animDurations = ["0.6s", "0.9s", "0.75s", "0.5s"];
                  return (
                    <div key={bar} className="flex-1 bg-slate-100 rounded-full h-full relative overflow-hidden flex flex-col justify-end">
                      <motion.div
                        animate={{ height: ["30%", "95%", "55%", "85%", "40%", "90%", "30%"] }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: bar * 0.15
                        }}
                        className="w-full bg-gradient-to-t from-emerald-500 via-indigo-500 to-pink-500 rounded-full shadow-sm"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="text-[7px] font-mono text-slate-450 font-extrabold text-center tracking-widest uppercase">
                FOLEY ACTIVE
              </div>
            </div>
          </motion.div>

          {/* EDITING INTERFACE OVERLAY 2: CINEMATIC LUT COLOR GRADED DIAL WHEEL */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.45, type: "spring", stiffness: 100 }}
            className="absolute -right-12 sm:-right-20 top-20 z-30 select-none pointer-events-auto filter drop-shadow-lg"
          >
            <div className="p-3 bg-white/75 backdrop-blur-xl border border-white/95 rounded-2xl flex flex-col items-center gap-2 shadow-xl w-[75px] sm:w-[90px]">
              <span className="text-[8px] font-extrabold font-mono text-indigo-600 tracking-wider">COLOR G.</span>
              
              {/* Radial Hue Spectrum Wheel */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-slate-200 relative flex items-center justify-center p-0.5 bg-gradient-to-tr from-rose-400 via-indigo-400 to-cyan-400 animate-[spin_24s_linear_infinite]">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative">
                  {/* Scope target dot */}
                  <div className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-md animate-pulse" />
                  <div className="w-0.5 h-full bg-indigo-500/10 absolute left-1/2 transform -translate-x-1/2" />
                  <div className="h-0.5 w-full bg-indigo-500/10 absolute top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[7px] font-mono font-bold text-slate-500 uppercase">H: 142°</span>
                <span className="text-[6px] font-mono font-extrabold text-[#6366f1] tracking-widest leading-none">HIGH RANGE</span>
              </div>
            </div>
          </motion.div>

          {/* EDITING INTERFACE OVERLAY 3: FLOATING SENSATIONAL EDITOR TIMELINE TRACKS */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.55, type: "spring", stiffness: 100 }}
            className="absolute -bottom-10 md:-bottom-6 left-1/2 transform -translate-x-1/2 z-35 select-none pointer-events-auto filter drop-shadow-xl w-[260px] sm:w-[320px]"
          >
            <div className="p-3 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl flex flex-col gap-2 shadow-2xl relative overflow-hidden">
              {/* Sleek moving timeline playhead ruler marker overlay */}
              <div className="absolute inset-x-0 top-0 h-1 bg-slate-800 flex justify-between px-2 font-mono text-[5px] text-slate-500 font-bold border-b border-slate-750">
                <span className="text-[#3b82f6]">00:00</span>
                <span>00:05</span>
                <span>00:10</span>
                <span>00:15</span>
                <span>00:20</span>
                <span>00:25</span>
              </div>

              {/* Glowing vertical playhead */}
              <motion.div 
                animate={{ left: ["4%", "96%", "4%"] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-[1.5px] bg-rose-500 z-10 pointer-events-none shadow-[0_0_8px_#f43f5e]"
              >
                <div className="absolute top-0 -left-1 w-2.5 h-2 bg-rose-500 rounded-b-sm border-b border-light-rose" />
              </motion.div>

              {/* Timeline Tracks lists */}
              <div className="flex flex-col gap-1.5 mt-2.5">
                {/* Track V2 - Title FX */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[6px] sm:text-[7px] font-mono font-extrabold text-slate-500 w-4 block text-left">V2</span>
                  <div className="flex-1 bg-slate-800/80 rounded h-3.5 relative overflow-hidden flex items-center px-1">
                    <span className="text-[6px] font-mono font-bold text-blue-400 truncate">💬 MOTION TEXT OVERLAY</span>
                  </div>
                </div>

                {/* Track V1 - Main Segment */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[6px] sm:text-[7px] font-mono font-extrabold text-slate-500 w-4 block text-left">V1</span>
                  <div className="flex-1 bg-indigo-500/20 border border-indigo-500/35 rounded h-3.5 relative overflow-hidden flex items-center px-1.5">
                    {/* Tiny representation of editor photo inside track */}
                    <div className="w-2.5 h-2.5 rounded-full overflow-hidden mr-1 shadow bg-slate-100 flex-shrink-0">
                      <img src={activeAvatarImageUrl} className="w-full h-full object-cover" alt="timeline-avatar" />
                    </div>
                    <span className="text-[6px] sm:text-[7px] font-mono font-extrabold text-indigo-300 truncate">🎬 PRIMARY_PORTRAIT.PNG</span>
                    {/* Split line markers */}
                    <div className="absolute right-[40%] top-0 bottom-0 border-r border-indigo-500/25" />
                    <div className="absolute right-[15%] top-0 bottom-0 border-r border-indigo-500/25" />
                  </div>
                </div>

                {/* Track A1 - Cinematic Foley beat */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[6px] sm:text-[7px] font-mono font-extrabold text-slate-500 w-4 block text-left">A1</span>
                  <div className="flex-1 bg-emerald-500/15 border border-emerald-500/30 rounded h-3.5 relative overflow-hidden flex items-center px-1.5 justify-between">
                    <span className="text-[6px] sm:text-[7px] font-mono font-extrabold text-emerald-400 truncate flex items-center gap-1">
                      <span>🎵</span> CINEMATIC_BEAT_24BIT.WAV
                    </span>
                    {/* Bouncing miniature audio wave */}
                    <span className="flex items-center gap-[1px] pr-1">
                      <span className="w-[1.5px] h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="w-[1.5px] h-2.5 bg-emerald-400 rounded-full animate-ping" />
                      <span className="w-[1.5px] h-1 bg-emerald-400 rounded-full animate-pulse" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Portrait Frame - Wrap with interactive trigger opening dynamic compiled CV */}
          <button
            onClick={() => setIsCvOpen(true)}
            title="Click to view Dhiraj Kumar's dynamic compiled CV / Resume"
            id="center-portrait-anchor"
            type="button"
            className="absolute w-[246px] h-[246px] sm:w-[326px] sm:h-[326px] rounded-full select-none z-20 group cursor-pointer focus:outline-none border-none bg-transparent"
          >
            {/* White Professional Mount Border containing clear picture */}
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center shadow-[0_20px_50px_rgba(15,23,42,0.35)] border-[5px] sm:border-[8px] border-white bg-slate-950 relative">
              {/* STABLE, PERMANENT PORTRAIT IMAGE OF DHIRAJ KUMAR */}
              <img
                src={activeAvatarImageUrl}
                onLoad={() => {
                  console.log(`[Avatar Static Load Success] Core portrait successfully displayed: "${activeAvatarImageUrl}"`);
                }}
                onError={(e) => {
                  console.error(`[Avatar Static Load Error] Static portrait url failed: "${activeAvatarImageUrl}"`);
                  // Fall back to Unsplash photo
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=600";
                }}
                alt="Dhiraj Kumar Professional Portrait"
                className="w-full h-full object-cover rounded-full select-none transform group-hover:scale-[1.10] transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />

              {/* EDITOR OVERLAY CAP - Beautiful interactive overlay which fades in upon dragging cursor inside */}
              <div 
                id="portrait-interactive-overlay" 
                className="absolute inset-0 bg-indigo-950/85 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-25 text-center px-4"
              >
                {/* HUD Crosshairs and concentric circles */}
                <div className="absolute inset-4 border border-indigo-400/30 rounded-full pointer-events-none">
                  <div className="absolute inset-2 border border-dashed border-indigo-400/40 rounded-full animate-[spin_20s_linear_infinite]" />
                </div>

                {/* Pulsing file SVG icon of CV */}
                <motion.div
                  className="mb-1 text-yellow-300"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 drop-shadow-[0_0_8px_rgba(253,224,71,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </motion.div>

                {/* Interactive Click Tip Overlay Helper */}
                <span className="text-[8px] font-mono font-black text-indigo-300 tracking-[0.2em] uppercase mb-0.5">
                  SECURE PORTAL
                </span>
                <span className="text-xs font-sans font-black text-white tracking-wider uppercase bg-gradient-to-r from-teal-300 via-yellow-200 to-pink-300 bg-clip-text text-transparent mt-1 flex items-center justify-center gap-1">
                  <MousePointerClick size={12} className="inline text-teal-300 stroke-[3px]" /> OPEN CV RESUME
                </span>
                
                <span className="text-[8px] font-mono text-slate-350 tracking-wider mt-2 border-t border-white/10 pt-1 w-20">
                  SHEET LINKED
                </span>
              </div>
            </div>
          </button>

          {/* Perfect thin tech highlight outline placed strictly BEHIND the image so it never blurs or clouds the portrait */}
          <div className="absolute w-[258px] h-[258px] sm:w-[342px] sm:h-[342px] rounded-full border border-indigo-500/35 pointer-events-none z-10 animate-pulse bg-indigo-500/5" />
          
          {/* ORBITAL FLOATING LOGOS - Rebounds automatically surrounding the portrait bounds */}
          <FloatingLogos logos={portfolioData?.floatingLogos} />
        </div>

      </div>

      {/* BOTTOM: Beautiful Name presentation, About block & dynamic line */}
      <div id="bottom-hero-presentation" className="w-full flex flex-col items-center text-center mt-4 z-20 pointer-events-auto">
        <motion.div 
          id="author-labels"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col items-center max-w-3xl px-4"
        >
          {/* Display Name styled with gradient color split */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-slate-800 uppercase leading-none mb-3 select-text select-all">
            {firstName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{lastName}</span>
          </h1>

          {/* About label */}
          <span className="font-sans font-extrabold text-xs uppercase tracking-widest text-[#6366f1] select-none mb-2">
            About me
          </span>

          {/* About paragraph block */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 font-medium leading-relaxed select-text select-all mb-6 whitespace-pre-wrap">
            {portfolioData.aboutMe || "Passionate video editor and creative thinker. Specializing in high-impact narrative cuts, foley design, and motion effects."}
          </p>

          <div className="w-48 h-1 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-[#ec4899] opacity-80" />
        </motion.div>
      </div>

      {/* COMPILING SYSTEM CV MODAL -- DYNAMIC RESUME DESIGNED DIRECTLY FROM THE WEBSITE DATA */}
      {isCvOpen && (
        <div 
          id="compiled-cv-popup-modal"
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[900] flex items-center justify-center p-4 sm:p-6 overflow-y-auto print:p-0 print:bg-white text-slate-800"
        >
          {/* Main layout container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white w-full max-w-3xl rounded-[32px] shadow-2xl flex flex-col my-8 overflow-hidden border border-white/20 print:border-none print:shadow-none print:my-0 print:rounded-none cv-print-container"
          >
            {/* Modal Controls Bar (Hidden in prints) */}
            <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-b border-slate-100 print:hidden select-none">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Live Dynamic CV Compiler
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold font-sans rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-indigo-600/10"
                >
                  <Printer size={13} />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCvOpen(false)}
                  className="p-2 bg-slate-200 hover:bg-slate-300 rounded-full text-slate-600 hover:text-slate-800 active:scale-90 transition-all cursor-pointer"
                  title="Close Portal"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Resume Sheet Document (Perfect for reading and printing) */}
            <div className="p-8 sm:p-12 overflow-y-auto max-h-[75vh] print:max-h-none print:p-4 text-left select-text">
              
              {/* Connected Google Sheets Resume Actions */}
              {cvLinkItem && (
                <div className="mb-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 print:hidden shadow-xs">
                  <div className="flex flex-col text-left gap-0.5">
                    <span className="text-[9px] font-black uppercase text-indigo-700 tracking-wider font-mono">Google Sheet: RESUME Tab</span>
                    <span className="text-xs font-bold text-slate-700">Open custom links linked directly inside your spreadsheet database.</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cvLinkItem.pdfDriveLink && (
                      <a
                        href={resolveResumeUrl(cvLinkItem.pdfDriveLink)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all hover:scale-103 active:scale-97 cursor-pointer"
                      >
                        <FileText size={12} className="text-red-500" />
                        <span>View PDF Document</span>
                      </a>
                    )}
                    {cvLinkItem.htmlLink && (
                      <a
                        href={resolveResumeUrl(cvLinkItem.htmlLink)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-indigo-650 text-white hover:bg-indigo-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all hover:scale-103 active:scale-97 cursor-pointer"
                        style={{ backgroundColor: "rgb(79, 70, 229)" }}
                      >
                        <ExternalLink size={12} />
                        <span>View Web Portfolio</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Header profile details */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-200 mb-8">
                <div className="flex flex-col">
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 uppercase">
                    {portfolioData.name || "Dhiraj Kumar"}
                  </h1>
                  <span className="text-sm font-black text-indigo-600 tracking-wider uppercase mt-1.5">
                    Professional Video Editor
                  </span>
                </div>
                <div className="flex flex-col text-xs font-sans font-bold text-slate-600 gap-2 md:text-right text-left">
                  {portfolioData.contact?.phone && (
                    <span className="flex items-center md:justify-end gap-2 text-[13px]">
                      <Phone size={13} className="text-indigo-600 stroke-[2.5px]" />
                      {portfolioData.contact.phone}
                    </span>
                  )}
                  {portfolioData.contact?.email && (
                    <span className="flex items-center md:justify-end gap-2 text-[13px]">
                      <Mail size={13} className="text-indigo-600 stroke-[2.5px]" />
                      {portfolioData.contact.email}
                    </span>
                  )}
                  {portfolioData.contact?.location && (
                    <span className="flex items-center md:justify-end gap-2 text-[13px]">
                      <MapPin size={13} className="text-indigo-600 stroke-[2.5px]" />
                      {portfolioData.contact.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Career / About Summary */}
              <div className="flex flex-col gap-3 mb-8">
                <h3 className="text-xs sm:text-sm font-sans font-extrabold text-indigo-600 uppercase tracking-widest border-l-4 border-indigo-500 pl-2.5">
                  Core Profile Summary
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-semibold whitespace-pre-wrap pl-1">
                  {portfolioData.aboutMe || "Creative and meticulous professional specializing in video post-production flow, detailed audio alignment, and motion design layouts."}
                </p>
              </div>

              {/* Experience History */}
              {portfolioData.experiences && portfolioData.experiences.length > 0 && (
                <div className="flex flex-col gap-6 mb-8">
                  <h3 className="text-xs sm:text-sm font-sans font-extrabold text-indigo-600 uppercase tracking-widest border-l-4 border-indigo-500 pl-2.5">
                    Professional Background
                  </h3>
                  
                  <div className="flex flex-col gap-5">
                    {portfolioData.experiences.map((exp, idx) => (
                      <div key={idx} className="flex flex-col gap-1.5 text-left pl-1">
                        <div className="flex justify-between items-start gap-2 flex-wrap">
                          <h4 className="font-extrabold text-slate-800 text-sm sm:text-base">
                            {exp.role} <span className="text-slate-400 font-normal">at</span> <span className="text-indigo-600">{exp.company}</span>
                          </h4>
                          <span className="text-[11px] font-bold text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-full select-none">
                            {exp.period}
                          </span>
                        </div>
                        <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-650 font-semibold flex flex-col gap-1 leading-relaxed">
                          {exp.bullets?.map((bullet, bidx) => (
                            <li key={bidx}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills defined in sheet */}
              {portfolioData.skills && portfolioData.skills.length > 0 && (
                <div className="flex flex-col gap-4 mb-8">
                  <h3 className="text-xs sm:text-sm font-sans font-extrabold text-indigo-600 uppercase tracking-widest border-l-4 border-indigo-500 pl-2.5">
                    Production Systems & Mastery
                  </h3>
                  <div className="flex flex-wrap gap-2 pl-1">
                    {portfolioData.skills.map((s, i) => (
                      <div 
                        key={i} 
                        className="px-3.5 py-1.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-2 shadow-sm font-sans"
                      >
                        <span className="text-xs font-extrabold text-slate-800">{s.name}</span>
                        <span className="text-[10px] font-black font-mono text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md">
                          {s.level}%
                        </span>
                        {s.levelName && (
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            ({s.levelName})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Backlinks & Interactive Networks */}
              {portfolioData.socialLinks && portfolioData.socialLinks.length > 0 && (
                <div className="flex flex-col gap-3 pt-6 border-t border-slate-100 print:hidden">
                  <h3 className="text-[10px] font-sans font-extrabold text-slate-400 uppercase tracking-widest pl-1">
                    Interactive Social Connections
                  </h3>
                  <div className="flex flex-wrap gap-2 pl-1">
                    {portfolioData.socialLinks.map((link, idx) => {
                      if (!link.directUrl) return null;
                      return (
                        <a
                          key={idx}
                          href={link.directUrl.startsWith("http") ? link.directUrl : `https://${link.directUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full flex items-center gap-1.5 transition-all"
                        >
                          <span>{link.platform}</span>
                          <ExternalLink size={10} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            {/* Modal footer watermark */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 text-center text-[10px] font-mono text-slate-400 font-bold print:hidden select-none">
              This curriculum vitae was compiled live with real-time sync systems.
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
