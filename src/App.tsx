import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, Compass, ExternalLink, Mail, MessageSquareText, Instagram, Youtube, Linkedin, Globe, Phone, FileText, AlertTriangle } from "lucide-react";
import Home from "./pages/Home";
import Videos from "./pages/Videos";
import SecondaryPages from "./pages/SecondaryPages";
import BottomNavbar from "./components/BottomNavbar";
import GlassCard from "./components/GlassCard";
import InteractiveBackground from "./components/InteractiveBackground";
import CrazyLoadingIndicator from "./components/CrazyLoadingIndicator";
import { 
  getCompletePortfolioData, 
  saveLocalPortfolioData, 
  resetLocalPortfolioData,
  sheetDiagnostics,
  resolveVideoUrl,
  getDriveFileId,
  getYouTubeId,
  getVimeoId,
  lastLoadSource
} from "./utils/googleSheet";
import { PortfolioData, ExperienceItem, SkillItem, VideoItem } from "./types";
import { resolveVideoDetails } from "./utils/videoResolver";
import { 
  Lock, 
  Unlock, 
  Settings, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle,
  RefreshCw
} from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");

  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [showExploreModal, setShowExploreModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Global 120fps display refresh-rate ticker loop preventing layout thrashing
  useEffect(() => {
    let active = true;
    const tick = (now: number) => {
      if (!active) return;
      document.documentElement.style.setProperty("--global-time", `${now / 1000}s`);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => {
      active = false;
    };
  }, []);

  // Central state representing live Google Sheet & Local Storage data
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Access Auth gate & Edit Modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showEditConsole, setShowEditConsole] = useState(false);

  // Low power mode for liquid background
  const [lowPowerMode, setLowPowerMode] = useState<boolean>(() => {
    return localStorage.getItem("low_power_mode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("low_power_mode", String(lowPowerMode));
  }, [lowPowerMode]);

  // Edit Console workspace values
  const [editTab, setEditTab] = useState<"profile" | "experience" | "skills" | "contact" | "settings" | "diagnostics">("profile");
  const [tempData, setTempData] = useState<PortfolioData | null>(null);

  // Status for sheet connection feedback
  const [syncStatus, setSyncStatus] = useState<"live" | "cached" | "edited" | "error">("live");

  // Refs for tracking scroll thresholds and throttling scroll triggers for auto tab switching
  const lastScrollTimeRef = React.useRef<number>(0);

  // Automatic page switcher triggered when the user scrolls or swipes
  useEffect(() => {
    const tabsList = ["home", "videos", "projects", "skills", "resume", "contact"];
    let touchStartY = 0;
    let rAFId: number | null = null;

    const handleWheel = (e: WheelEvent) => {
      // Ignore scroll-switching if user is actively inside modal screens or transitioning
      if (activeVideo || showEditConsole || showAuthModal || showExploreModal || isTransitioning) return;

      const now = Date.now();
      if (now - lastScrollTimeRef.current < 900) return; // Prevents fast momentum skip on trackpads (900ms lock)

      const deltaY = e.deltaY;
      if (Math.abs(deltaY) < 30) return; // Ignore micro scrolling offsets

      const currentIdx = tabsList.indexOf(currentTab);
      if (currentIdx === -1) return;

      // Page boundary detectors to allow internal scroll on large grids/descriptions
      const atTop = window.scrollY <= 15;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 15;

      if (deltaY > 0) {
        // Scroll Down -> Forward tab
        if (atBottom && currentIdx < tabsList.length - 1) {
          e.preventDefault();
          lastScrollTimeRef.current = now;
          const target = tabsList[currentIdx + 1];
          if (rAFId) cancelAnimationFrame(rAFId);
          rAFId = requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: "auto" });
            setCurrentTab(target);
          });
          console.log(`[Scroll Switch] Next tab trigger: ${target}`);
        }
      } else if (deltaY < 0) {
        // Scroll Up -> Backward tab
        if (atTop && currentIdx > 0) {
          e.preventDefault();
          lastScrollTimeRef.current = now;
          const target = tabsList[currentIdx - 1];
          if (rAFId) cancelAnimationFrame(rAFId);
          rAFId = requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: "auto" });
            setCurrentTab(target);
          });
          console.log(`[Scroll Switch] Previous tab trigger: ${target}`);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (activeVideo || showEditConsole || showAuthModal || showExploreModal || isTransitioning) return;
      if (!e.changedTouches || !e.changedTouches[0]) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY - touchEndY; // Positive = Swiped up (scroll down), Negative = Swiped down (scroll up)

      if (Math.abs(diffY) < 65) return; // Threshold swipe displacement (65px)

      const now = Date.now();
      if (now - lastScrollTimeRef.current < 900) return;

      const currentIdx = tabsList.indexOf(currentTab);
      if (currentIdx === -1) return;

      const atTop = window.scrollY <= 15;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 15;

      if (diffY > 0) {
        if (atBottom && currentIdx < tabsList.length - 1) {
          lastScrollTimeRef.current = now;
          const target = tabsList[currentIdx + 1];
          if (rAFId) cancelAnimationFrame(rAFId);
          rAFId = requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: "auto" });
            setCurrentTab(target);
          });
          console.log(`[Swipe Switch] Next tab trigger: ${target}`);
        }
      } else if (diffY < 0) {
        if (atTop && currentIdx > 0) {
          lastScrollTimeRef.current = now;
          const target = tabsList[currentIdx - 1];
          if (rAFId) cancelAnimationFrame(rAFId);
          rAFId = requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: "auto" });
            setCurrentTab(target);
          });
          console.log(`[Swipe Switch] Previous tab trigger: ${target}`);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      if (rAFId) cancelAnimationFrame(rAFId);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentTab, activeVideo, showEditConsole, showAuthModal, showExploreModal, isTransitioning]);

  // Reset scroll to top instantly on every tab switch synchronizing with browser rendering cycle
  useEffect(() => {
    let rAFResetId = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    });
    return () => {
      cancelAnimationFrame(rAFResetId);
    };
  }, [currentTab]);

  // Load consolidated sheet / local-edited details
  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const fetched = await getCompletePortfolioData(false);
        setPortfolioData(fetched);
        
        // Determine sync status representation
        if (lastLoadSource === "local") {
          setSyncStatus("edited");
        } else if (lastLoadSource === "cache") {
          setSyncStatus("cached");
        } else {
          setSyncStatus("live");
        }
      } catch (err) {
        console.error("Failed to load portfolio database:", err);
        setSyncStatus("error");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Unified modal play hand-off
  const handlePlayVideo = (video: VideoItem) => {
    console.log(`[Video Hand-off] Triggering in-app embedded video player modal for: "${video.title}"`);
    setActiveVideo(video);
  };

  const handleExploreAction = () => {
    setShowExploreModal(true);
  };

  // Open Edit Gate Verification Flow
  const handleOpenEditFlow = () => {
    if (isAuthenticated) {
      // If already authenticated in current session, jump straight into console
      openEditConsoleWorkspace();
    } else {
      setShowAuthModal(true);
    }
  };

  // Verify passcode key: "EDIRUOTW"
  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === "EDIRUOTW") {
      setIsAuthenticated(true);
      setAuthError("");
      setShowAuthModal(false);
      setPasscodeInput("");
      
      // Instantly open workspace console
      openEditConsoleWorkspace();
    } else {
      setAuthError("Invalid Code Key. Please verify and try again.");
    }
  };

  const openEditConsoleWorkspace = () => {
    if (portfolioData) {
      // Deep clone portfolio state to edit workspace variables without polluting views until save
      setTempData(JSON.parse(JSON.stringify(portfolioData)));
      setEditTab("profile");
      setShowEditConsole(true);
    }
  };

  // Save edits back into Local Storage state & retrigger app updates
  const handleSaveEdits = () => {
    if (tempData) {
      saveLocalPortfolioData(tempData);
      setPortfolioData(tempData);
      setSyncStatus("edited");
      setShowEditConsole(false);
    }
  };

  // Revert back and fetch fresh raw Google Sheet details
  const handleResetToSheet = async () => {
    if (window.confirm("Are you sure you want to revert all custom overrides and load real Google Sheet values?")) {
      resetLocalPortfolioData();
      setShowEditConsole(false);
      try {
        setIsLoading(true);
        const fresh = await getCompletePortfolioData(true); // forceRefresh = true
        setPortfolioData(fresh);
        setSyncStatus("live");
      } catch (e) {
        console.error("Re-sync failed:", e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Perform fully direct connection refresh bypassing cache
  const handleForceSync = async () => {
    try {
      setIsLoading(true);
      const fresh = await getCompletePortfolioData(true); // forceRefresh = true
      setPortfolioData(fresh);
      setSyncStatus("live");
    } catch (err) {
      console.error("Live sync failed:", err);
      setSyncStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper actions for dynamically updating lists in editable tabs
  const handleAddExperienceItem = () => {
    if (tempData) {
      const newItem: ExperienceItem = {
        role: "New Creative Role",
        company: "Agency Corporation",
        period: "2026 - PRESENT",
        bullets: ["Add key project and operations bullet highlights here."]
      };
      setTempData({
        ...tempData,
        experiences: [...tempData.experiences, newItem]
      });
    }
  };

  const handleDeleteExperienceItem = (index: number) => {
    if (tempData) {
      const filtered = tempData.experiences.filter((_, idx) => idx !== index);
      setTempData({ ...tempData, experiences: filtered });
    }
  };

  const handleAddSkillItem = () => {
    if (tempData) {
      const newItem: SkillItem = {
        name: "New Software / Craft",
        level: 85
      };
      setTempData({
        ...tempData,
        skills: [...tempData.skills, newItem]
      });
    }
  };

  const handleDeleteSkillItem = (index: number) => {
    if (tempData) {
      const filtered = tempData.skills.filter((_, idx) => idx !== index);
      setTempData({ ...tempData, skills: filtered });
    }
  };

  return (
    <div className="relative min-h-screen pb-32 text-slate-800 selection:bg-blue-100/60 selection:text-slate-900 overflow-x-hidden">
      {/* Premium responsive hardware-accelerated fluid background */}
      <InteractiveBackground lowPowerMode={lowPowerMode} />

      {/* Scanline / Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay">
        <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* FLOATING ACTION RIG: PORTFOLIO RE-SYNC CLOUD STATUS */}
      <div className="fixed top-6 right-6 z-40 flex items-center gap-3">
        {/* Sync Indicator Tag in premium white glass */}
        {syncStatus === "edited" && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 backdrop-blur-xl border border-amber-500/30 shadow-md text-xs font-sans text-amber-800 transition-all duration-300">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-extrabold uppercase tracking-wider text-[10px]">
              Overrides Active
            </span>
            <button
              onClick={handleResetToSheet}
              title="Revert all overrides and reload live sheet data"
              className="p-1 hover:bg-amber-500/20 rounded-full cursor-pointer transition-all active:scale-90 flex items-center justify-center ml-0.5"
            >
              <RotateCcw size={12} className="text-amber-700 stroke-[2.5px]" />
            </button>
          </div>
        )}

        {syncStatus === "cached" && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-xl border border-white/85 shadow-md text-xs font-sans text-slate-700 transition-all duration-300">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse-slow" />
            <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <span>Sheet Connected</span>
              <span className="text-[9px] text-slate-400 font-normal lowercase">(cached)</span>
            </span>
            <button
              onClick={handleForceSync}
              title="Bypass cache and pull fresh Google Sheet data"
              className="p-1 hover:bg-slate-200/50 rounded-full cursor-pointer transition-all active:scale-90 flex items-center justify-center ml-0.5"
            >
              <RefreshCw size={12} className="text-slate-500 hover:text-indigo-600 stroke-[2px]" />
            </button>
          </div>
        )}

        {syncStatus === "live" && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/30 shadow-md text-xs font-sans text-emerald-800 transition-all duration-300">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-extrabold uppercase tracking-wider text-[10px]">
              Live Sheet Synced
            </span>
            <button
              onClick={handleForceSync}
              title="Bypass cache and pull fresh Google Sheet data"
              className="p-1 hover:bg-emerald-500/20 rounded-full cursor-pointer transition-all active:scale-90 flex items-center justify-center ml-0.5"
            >
              <RefreshCw size={12} className="text-emerald-700 stroke-[2px]" />
            </button>
          </div>
        )}

        {syncStatus === "error" && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 backdrop-blur-xl border border-rose-500/30 shadow-md text-xs font-sans text-rose-800 transition-all duration-300">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-extrabold uppercase tracking-wider text-[10px]">
              Sync Offline
            </span>
            <button
              onClick={handleForceSync}
              title="Retry connection"
              className="p-1 hover:bg-rose-500/20 rounded-full cursor-pointer transition-all active:scale-90 flex items-center justify-center ml-0.5"
            >
              <RefreshCw size={12} className="text-rose-700 stroke-[2.5px]" />
            </button>
          </div>
        )}
      </div>

      {/* RENDER PAGES DYNAMICALLY MOUNTED BEHIND HIGH-VISCOSITY LIQUID TRANSLATION OVERLAY */}
      <main className="w-full relative z-20">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <CrazyLoadingIndicator />
          ) : (
            <motion.div
              key={currentTab}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{ duration: 0 }}
            >
              {currentTab === "home" && portfolioData && (
                <Home 
                  portfolioData={portfolioData}
                  onNavToVideos={() => setCurrentTab("videos")} 
                  onPlayFloatingVdo={handlePlayVideo} 
                  lowPowerMode={lowPowerMode}
                />
              )}
              
              {currentTab === "videos" && (
                <Videos onPlaySelected={handlePlayVideo} portfolioData={portfolioData || undefined} />
              )}
              
              {["projects", "skills", "resume", "contact"].includes(currentTab) && portfolioData && (
                <SecondaryPages currentTab={currentTab} portfolioData={portfolioData} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>



      {/* FLOAT NAVIGATION BAR PANEL */}
      <BottomNavbar 
        currentTab={currentTab} 
        setTab={setCurrentTab} 
        onExploreClick={handleExploreAction}
      />

      {/* GLOBAL FULL-SCREEN VIDEO PLAYER MODAL OVERLAY */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            id="video-player-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              id="video-player-container"
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: "spring", stiffness: 350, damping: 24 }}
              className="relative w-full max-w-4xl bg-[#120b1e]/90 border border-white/10 backdrop-blur-3xl rounded-3xl p-4.5 sm:p-5 shadow-2xl glass-shadow flex flex-col gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button element */}
              <button
                id="close-player-btn"
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/45 hover:bg-black/60 text-white flex items-center justify-center cursor-pointer transition-colors border border-white/10"
              >
                <X size={18} />
              </button>

              {/* High-visibility fallback invitation to view source directly */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-500/35 text-left text-xs text-indigo-200 mt-2">
                <div className="flex items-start gap-2.5">
                  <span className="text-base select-none mt-0.5">🎬</span>
                  <div>
                    <span className="font-extrabold text-white block">Direct Video Stream Mode</span>
                    <span className="text-[10px] text-slate-350">Google Drive streams might block third-party widgets. If you see a spinner, grey box, or error below, please use this link:</span>
                  </div>
                </div>
                <a
                  href={activeVideo.driveLink || activeVideo.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold uppercase tracking-wider text-[10px] rounded-xl transition-all duration-200 shadow-md flex items-center gap-1.5 shrink-0 self-stretch sm:self-auto justify-center cursor-pointer hover:shadow"
                >
                  <ExternalLink size={12} className="stroke-[2.5px]" />
                  <span>Open Original Video</span>
                </a>
              </div>

              {/* Responsive Video/IFrame Viewport rendering */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner">
                {(() => {
                  const isMobile = typeof window !== "undefined" && /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent || "");
                  const details = resolveVideoDetails(activeVideo.driveLink || activeVideo.videoUrl || "");
                  
                  let finalUrl = details.resolvedUrl;
                  
                  if (details.detectedType === "youtube" && finalUrl.includes("youtube.com/embed/")) {
                    if (isMobile) {
                      finalUrl = finalUrl.replace(/[?&]autoplay=1/, "");
                      if (!finalUrl.includes("autoplay=")) {
                        finalUrl = `${finalUrl}${finalUrl.includes("?") ? "&" : "?"}autoplay=0`;
                      }
                    } else {
                      if (!finalUrl.includes("autoplay=")) {
                        finalUrl = `${finalUrl}${finalUrl.includes("?") ? "&" : "?"}autoplay=1`;
                      }
                    }
                  }

                  if (details.renderMethod === "iframe") {
                    return (
                      <iframe
                        id="active-portfolio-drive-frame"
                        src={finalUrl}
                        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        className="w-full h-full border-0 absolute inset-0 rounded-2xl"
                      />
                    );
                  }

                  if (details.renderMethod === "video") {
                    return (
                      <video
                        id="active-portfolio-video"
                        src={finalUrl}
                        controls
                        autoPlay={!isMobile}
                        loop
                        playsInline
                        className="w-full h-full object-contain shrink-0"
                        onError={() => {
                          console.error(`[Video Playback Error] Video failed to load or play: "${finalUrl}"`);
                        }}
                      />
                    );
                  }

                  return (
                    <div className="w-full h-full absolute inset-0 bg-slate-950 border border-red-500/10 rounded-2xl flex flex-col items-center justify-center p-6 text-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                        <AlertTriangle size={24} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-bold text-slate-200">Unsupported video source</h3>
                        <p className="text-xs text-slate-400 max-w-sm">The source link provided is not supported. Please configure a valid YouTube watch/embed URL, Google Drive sharing link, or raw assets (.mp4, .webm, .ogg).</p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Video metadata titles */}
              <div className="flex flex-col gap-2 p-3 bg-white/5 rounded-2xl border border-white/5 text-left">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-indigo-400">
                    {activeVideo.category} · {activeVideo.duration}
                  </span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                    {activeVideo.title}
                  </h2>
                </div>

                {activeVideo.description && (
                  <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-medium">
                    {activeVideo.description}
                  </p>
                )}

                {/* Direct Google Drive fallback notification & button link */}
                <div className="mt-2.5 pt-3 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex flex-col text-left max-w-md">
                    <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider">
                      ⚠️ Web embedding restricts?
                    </span>
                    <span className="text-[10px] text-slate-400 leading-tight">
                      Certain videos have strict web iframe permissions. Click the View Source button to stream directly on Google Drive.
                    </span>
                  </div>

                  <a
                    id="open-drive-fallback-btn"
                    href={activeVideo.driveLink || activeVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-full text-white text-xs font-extrabold uppercase tracking-wide
                      flex items-center gap-1.5 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md flex-shrink-0 cursor-pointer
                    "
                  >
                    <span>View Original Video</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EXPLORE MY WORLD DYNAMIC CONSOLE MODAL */}
      <AnimatePresence>
        {showExploreModal && (
          <motion.div
            id="explore-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md"
            onClick={() => setShowExploreModal(false)}
          >
            <motion.div
              id="explore-modal-card"
              initial={{ scale: 0.92, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="relative w-full max-w-md bg-[#120b1e]/45 border border-white/10 backdrop-blur-3xl rounded-3xl p-5 sm:p-6 shadow-2xl glass-shadow flex flex-col gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                id="close-explore-btn"
                onClick={() => setShowExploreModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-400/20 text-purple-400 flex items-center justify-center animate-pulse">
                  <Compass size={24} className="animate-spin-slow" />
                </div>
                <div className="flex flex-col text-left">
                  <h3 className="font-extrabold text-lg sm:text-xl text-white tracking-wide uppercase">SOCIAL LINK</h3>
                  <p className="text-xs font-semibold text-slate-400 text-left">Real-time social connections fetched from Google Sheet</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 text-left">
                {/* Dynamically render social links with robust fallback profiles if GSheet list is underpopulated */}
                {(() => {
                  const items = portfolioData?.socialLinks && portfolioData.socialLinks.length > 0
                    ? portfolioData.socialLinks
                    : [
                        { platform: "INSTA", directUrl: "https://www.instagram.com/dhirajkumar14254", order: 1, enabled: true },
                        { platform: "YOUTUBE", directUrl: "https://www.youtube.com/@dhirajkumar-video-editor", order: 2, enabled: true },
                        { platform: "LINKEDIN", directUrl: "https://www.linkedin.com/in/dhiraj-kumar-editor", order: 3, enabled: true },
                        { platform: "EMAIL", directUrl: "mailto:dhirajkumar14254@gmail.com", order: 4, enabled: true }
                      ];

                  const getSocialIcon = (platform: string) => {
                    const norm = platform.toLowerCase();
                    if (norm.includes("insta")) return <Instagram className="text-pink-400 shrink-0" size={20} />;
                    if (norm.includes("youtube")) return <Youtube className="text-red-500 shrink-0" size={20} />;
                    if (norm.includes("link")) return <Linkedin className="text-blue-400 shrink-0" size={20} />;
                    if (norm.includes("mail") || norm.includes("email")) return <Mail className="text-teal-400 shrink-0" size={20} />;
                    return <Globe className="text-indigo-400 shrink-0" size={20} />;
                  };

                  const getSocialColorClass = (platform: string) => {
                    const norm = platform.toLowerCase();
                    if (norm.includes("insta")) return "hover:bg-pink-500/10 hover:border-pink-500/35 border-white/10 text-pink-200";
                    if (norm.includes("youtube")) return "hover:bg-red-500/10 hover:border-red-500/35 border-white/10 text-red-200";
                    if (norm.includes("link")) return "hover:bg-blue-500/10 hover:border-blue-500/35 border-white/10 text-blue-200";
                    if (norm.includes("mail") || norm.includes("email")) return "hover:bg-teal-500/10 hover:border-teal-500/35 border-white/10 text-teal-200";
                    return "hover:bg-indigo-500/10 hover:border-indigo-500/35 border-white/10 text-slate-200";
                  };

                  return (
                    <div id="social-links-grid" className="grid grid-cols-1 gap-2.5 mt-1">
                      {items.map((social, idx) => {
                        const url = social.directUrl || (() => {
                          const name = social.platform.toLowerCase();
                          if (name.includes("insta")) return "https://www.instagram.com/dhirajkumar14254";
                          if (name.includes("youtube")) return "https://www.youtube.com/@dhirajkumar-video-editor";
                          if (name.includes("link")) return "https://www.linkedin.com/in/dhiraj-kumar-editor";
                          return "mailto:dhirajkumar14254@gmail.com";
                        })();

                        return (
                          <motion.a
                            id={`explore-social-${idx}`}
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                              flex items-center gap-3.5 p-4 bg-white/5 border rounded-2xl cursor-pointer 
                              transition-all duration-300 font-sans font-bold text-sm tracking-wide text-left
                              ${getSocialColorClass(social.platform)}
                            `}
                          >
                            <div className="p-2 rounded-xl bg-white/5 border border-white/10 shadow-inner flex items-center justify-center">
                              {getSocialIcon(social.platform)}
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="text-[10px] font-sans font-bold text-slate-500 tracking-wider uppercase">Platform</span>
                              <span className="text-white leading-tight mt-0.5">{social.platform}</span>
                            </div>
                            <ExternalLink size={14} className="ml-auto opacity-50 text-white shrink-0" />
                          </motion.a>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              <div className="flex gap-3 justify-end border-t border-white/10 pt-4">
                <button
                  id="close-explore-modal-btn"
                  onClick={() => setShowExploreModal(false)}
                  className="
                    px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl text-xs font-bold uppercase tracking-widest
                    cursor-pointer transition-colors duration-300
                  "
                >
                  Close Console
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>





      {/* CORE PORTFOLIO EDIT WORKSPACE CONSOLE */}
      <AnimatePresence>
        {showEditConsole && tempData && (
          <motion.div
            id="edit-console-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md"
            onClick={() => setShowEditConsole(false)}
          >
            <motion.div
              id="edit-console-card"
              initial={{ scale: 0.95, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 40 }}
              className="relative w-full max-w-2xl h-[85vh] bg-[#10091c]/65 border border-white/10 backdrop-blur-3xl rounded-3xl p-6 shadow-2xl glass-shadow flex flex-col gap-5 select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header section console */}
              <div className="flex justify-between items-center pb-4 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Settings size={18} />
                  </div>
                  <div className="flex flex-col text-left">
                    <h3 className="font-extrabold text-base sm:text-lg text-white font-sans uppercase">Edit Portfolio</h3>
                    <p className="text-[10px] font-mono text-slate-400 leading-none">Changes persist locally inside custom override profiles</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetToSheet}
                    className="
                      px-3 py-2 bg-rose-600/10 border border-rose-500/20 hover:bg-rose-600/20 text-rose-400 rounded-xl text-xs font-bold uppercase tracking-widest
                      flex items-center gap-1.5 transition-colors cursor-pointer
                    "
                    title="Clear overrides and reload from spreadsheet"
                  >
                    <RotateCcw size={13} />
                    <span className="hidden sm:inline">Reset Defaults</span>
                  </button>
                  <button
                    onClick={() => setShowEditConsole(false)}
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-white cursor-pointer transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Navigation Workspace Menu Tabs */}
              <div className="flex gap-1 border-b border-white/5 pb-2 shrink-0 overflow-x-auto">
                {(["profile", "experience", "skills", "contact", "settings", "diagnostics"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setEditTab(tab)}
                    className={`
                      px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer capitalize
                      ${editTab === tab 
                        ? "bg-purple-600/20 border border-purple-500/25 text-purple-400" 
                        : "bg-white/5 border border-transparent text-slate-400 hover:bg-white/10 hover:text-slate-100"}
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Dynamic Tab Body - Scrollable content panel */}
              <div className="flex-grow overflow-y-auto pr-1 flex flex-col gap-4 text-left">
                {/* 1. Profile Editing fields */}
                {editTab === "profile" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Display Name</label>
                      <input
                        type="text"
                        value={tempData.name}
                        onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-colors shrink-0"
                        placeholder="e.g. DHIRAJ KUMAR"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Welcome Quote Pillar Quote</label>
                      <input
                        type="text"
                        value={tempData.welcomeSection}
                        onChange={(e) => setTempData({ ...tempData, welcomeSection: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-colors shrink-0"
                        placeholder="e.g. WELCOME"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bio / About Me section</label>
                      <textarea
                        rows={5}
                        value={tempData.aboutMe}
                        onChange={(e) => setTempData({ ...tempData, aboutMe: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-colors resize-none leading-relaxed"
                        placeholder="Describe your design and videography values..."
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                        <span>Center Slide Images (Comma Separated URLs / Paths)</span>
                        <span className="text-[10px] lowercase text-[#a855f7]">(Relative files or absolute https:// link URLs)</span>
                      </label>
                      <textarea
                        rows={2}
                        value={tempData.centerImages.join(", ")}
                        onChange={(e) => {
                          const images = e.target.value.split(",").map(img => img.trim()).filter(img => img.length > 0);
                          setTempData({ ...tempData, centerImages: images });
                        }}
                        className="w-full px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-sm font-semibold font-mono text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-colors shrink-0"
                        placeholder="e.g. IMG_5714.PNG, IMG_5716.PNG, https://picsum.photos/400"
                      />
                    </div>
                  </div>
                )}

                {/* 2. Experiences Management Cards */}
                {editTab === "experience" && (
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Experiences Timeline List ({tempData.experiences.length})</span>
                      <button
                        onClick={handleAddExperienceItem}
                        className="
                          px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/25 rounded-lg text-xs font-bold uppercase tracking-wider
                          flex items-center gap-1 transition-colors cursor-pointer
                        "
                      >
                        <Plus size={12} />
                        <span>Add Item</span>
                      </button>
                    </div>

                    {tempData.experiences.map((exp, idx) => (
                      <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-3 relative">
                        <button
                          onClick={() => handleDeleteExperienceItem(idx)}
                          className="absolute top-4 right-4 w-7 h-7 bg-rose-600/10 border border-rose-500/20 text-rose-400 rounded-lg flex items-center justify-center hover:bg-rose-600/20 transition-colors cursor-pointer"
                          title="Delete Experience slot"
                        >
                          <Trash2 size={13} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mr-8">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">Role/Title</label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => {
                                const list = [...tempData.experiences];
                                list[idx].role = e.target.value;
                                setTempData({ ...tempData, experiences: list });
                              }}
                              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-purple-500 focus:bg-white/10"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">Company/Agency</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => {
                                const list = [...tempData.experiences];
                                list[idx].company = e.target.value;
                                setTempData({ ...tempData, experiences: list });
                              }}
                              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-purple-500 focus:bg-white/10"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mr-8">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">Period / Duration Text</label>
                            <input
                              type="text"
                              value={exp.period}
                              onChange={(e) => {
                                const list = [...tempData.experiences];
                                list[idx].period = e.target.value;
                                setTempData({ ...tempData, experiences: list });
                              }}
                              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-purple-500 focus:bg-white/10"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 flex items-center justify-between">
                            <span>Key Bullets (one bullet per line)</span>
                          </label>
                          <textarea
                            rows={3}
                            value={exp.bullets.join("\n")}
                            onChange={(e) => {
                              const bullets = e.target.value.split("\n").filter(el => el.trim().length > 0);
                              const list = [...tempData.experiences];
                              list[idx].bullets = bullets;
                              setTempData({ ...tempData, experiences: list });
                            }}
                            className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-purple-500 focus:bg-white/10 leading-relaxed font-semibold font-sans"
                            placeholder="Add experience descriptions..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Skills sliders configuration */}
                {editTab === "skills" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skills & Mastery Sliders ({tempData.skills.length})</span>
                      <button
                        onClick={handleAddSkillItem}
                        className="
                          px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/25 rounded-lg text-xs font-bold uppercase tracking-wider
                          flex items-center gap-1 transition-colors cursor-pointer
                        "
                      >
                        <Plus size={12} />
                        <span>Add Skill</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {tempData.skills.map((skill, idx) => (
                        <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-2 relative">
                          <button
                            onClick={() => handleDeleteSkillItem(idx)}
                            className="absolute top-2 right-2 w-6 h-6 bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/15 text-rose-400 rounded-md flex items-center justify-center transition-colors cursor-pointer"
                            title="Delete software/skill node"
                          >
                            <Trash2 size={11} />
                          </button>

                          <div className="flex flex-col gap-1 mr-6">
                            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Skill Name</label>
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) => {
                                const list = [...tempData.skills];
                                list[idx].name = e.target.value;
                                setTempData({ ...tempData, skills: list });
                              }}
                              className="px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-[9px] font-bold tracking-widest text-slate-500 uppercase px-0.5">
                              <span>Slider Score Mastery</span>
                              <span className="text-purple-400 select-none">{skill.level}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={skill.level}
                              onChange={(e) => {
                                const list = [...tempData.skills];
                                list[idx].level = parseInt(e.target.value, 10);
                                setTempData({ ...tempData, skills: list });
                              }}
                              className="w-full accent-purple-500 cursor-pointer h-1.5 rounded-full bg-white/5 opacity-80"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Contact page values */}
                {editTab === "contact" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Call / WhatsApp number</label>
                      <input
                        type="text"
                        value={tempData.contact.phone}
                        onChange={(e) => setTempData({
                          ...tempData,
                          contact: { ...tempData.contact, phone: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-colors"
                        placeholder="e.g. +91 90060 16099"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Primary Email Address</label>
                      <input
                        type="email"
                        value={tempData.contact.email}
                        onChange={(e) => setTempData({
                          ...tempData,
                          contact: { ...tempData.contact, email: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-colors"
                        placeholder="e.g. yourname@domain.com"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Location address details</label>
                      <input
                        type="text"
                        value={tempData.contact.location}
                        onChange={(e) => setTempData({
                          ...tempData,
                          contact: { ...tempData.contact, location: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-colors"
                        placeholder="e.g. Patna, Bihar, India"
                      />
                    </div>
                  </div>
                )}

                {/* 5. System Settings & Performance */}
                {editTab === "settings" && (
                  <div className="flex flex-col gap-5 font-sans">
                    <div className="p-4 rounded-xl bg-purple-900/10 border border-purple-500/20 text-left">
                      <h4 className="font-extrabold text-xs text-purple-300 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <Settings size={13} className="text-purple-400" />
                        <span>System Performance</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        Fine-tune background visuals, render complexity, and animations to preserve system resources or extend battery life.
                      </p>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-4 text-left">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-1 max-w-[75%]">
                          <span className="text-xs font-bold uppercase tracking-widest text-slate-200 font-sans">
                            Reduce Motion (Battery Saver)
                          </span>
                          <span className="text-[10px] text-slate-400 leading-normal font-sans">
                            Maintains 2 primary liquid background blobs instead of 8 to minimize painting calculations on mobile screens or hardware-constrained monitors.
                          </span>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={lowPowerMode}
                            onChange={(e) => setLowPowerMode(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className={`
                            w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer 
                            peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-slate-300 after:border-slate-350 after:border after:rounded-full after:h-5 after:w-5 
                            after:transition-all peer-checked:bg-purple-600 peer-checked:after:bg-white peer-checked:after:border-transparent
                          `}></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {editTab === "diagnostics" && (
                  <div className="flex flex-col gap-4 text-slate-300">
                    <div className="p-4 rounded-2xl bg-purple-900/10 border border-purple-500/20">
                      <h4 className="font-bold text-sm text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <AlertCircle size={15} />
                        <span>Google Sheet Fetch Diagnostics</span>
                      </h4>
                      <p className="text-xs leading-relaxed text-slate-400 font-sans">
                        This utility checks connection validity, missing columns, and data formatting for your Google Sheet. It will assist you in ensuring your live sheets are formatted exactly to specifications.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider pl-1 font-sans">Diagnostic Log Reports</span>
                      <div className="flex flex-col gap-3 max-h-[35vh] overflow-y-auto pr-1">
                        {sheetDiagnostics.issues.length === 0 ? (
                          <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex items-center gap-2.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse font-sans" />
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-emerald-400 uppercase font-sans">Status: OK / ONLINE</span>
                              <p className="text-[10px] text-slate-400">No issues or missing columns were identified in the fetched data.</p>
                            </div>
                          </div>
                        ) : (
                          sheetDiagnostics.issues.map((issue, idx) => (
                            <div 
                              key={idx} 
                              className={`p-3.5 border rounded-xl flex flex-col gap-1.5 ${
                                issue.type === "error" 
                                  ? "bg-rose-950/20 border-rose-500/25 text-rose-300" 
                                  : "bg-amber-950/20 border-amber-500/25 text-amber-300"
                              }`}
                            >
                              <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-wider font-extrabold pb-1 border-b border-white/5">
                                <span className={issue.type === "error" ? "text-rose-400" : "text-amber-400"}>
                                  {issue.type}
                                </span>
                                <span className="text-slate-400">GID: {issue.gid}</span>
                              </div>
                              <p className="text-xs font-semibold leading-relaxed font-sans">{issue.message}</p>
                              {issue.details && (
                                <pre className="p-2 bg-black/40 border border-white/5 rounded-lg text-[9px] font-mono leading-tight whitespace-pre-wrap break-all text-slate-400">
                                  {issue.details}
                                </pre>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col gap-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider font-sans text-white">Sheet Sharing Configuration</span>
                      <p className="text-[11px] leading-relaxed text-slate-400 select-text font-sans">
                        Make sure your Google Sheet is shared as <strong className="text-purple-400">"Anyone with the link can view"</strong> so the app can fetch details in real-time. If it is private, the fetch will fail and the app will load the robust client-side fallback demoData object.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Footer Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10 shrink-0">
                <button
                  onClick={() => setShowEditConsole(false)}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest select-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdits}
                  className="
                    px-6 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest
                    flex items-center gap-1.5 shadow-md shadow-indigo-500/10 border border-white/10 cursor-pointer select-none
                  "
                >
                  <Save size={13} />
                  <span>Save Changes</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PASSCODE AUTHENTICATION MODAL */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            id="auth-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md"
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              id="auth-modal-card"
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="relative w-full max-w-xs bg-[#120b1e]/45 border border-white/10 backdrop-blur-3xl rounded-3xl p-5 shadow-2xl glass-shadow flex flex-col gap-4 font-sans"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white cursor-pointer transition-colors"
              >
                <X size={15} />
              </button>

              <div className="flex items-center gap-3.5 border-b border-white/10 pb-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Lock size={18} className="stroke-[2.5px]" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wide uppercase">Console Access</h3>
                  <p className="text-[10px] font-semibold text-slate-400">Enter passcode to modify local configurations</p>
                </div>
              </div>

              <form onSubmit={handleVerifyPasscode} className="flex flex-col gap-4 text-left">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Authorization Code</label>
                  <input
                    type="password"
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-colors"
                    placeholder="Enter Premium Code Key"
                    autoFocus
                  />
                  {authError && (
                    <span className="text-[10px] font-bold text-rose-400 pl-0.5 mt-1 block">
                      {authError}
                    </span>
                  )}
                  <p className="text-[9.5px] leading-relaxed text-slate-500 pl-0.5">
                    Hint: Use standard portfolio passcode <code className="text-purple-450 font-semibold font-mono bg-white/5 px-1 py-0.5 rounded">EDIRUOTW</code>.
                  </p>
                </div>

                <div className="flex gap-3.5 justify-end border-t border-white/10 pt-4 mt-1">
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(false)}
                    className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-shadow"
                  >
                    Authorize
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



    </div>
  );
}
