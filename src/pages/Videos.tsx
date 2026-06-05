import React, { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, ArrowLeft, ArrowRight, Play, X, Compass, ExternalLink, FileText, Check, Copy, Film } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import VideoCard from "../components/VideoCard";
import GlassCard from "../components/GlassCard";
import { getVideosList } from "../utils/googleSheet";
import { VideoItem, PortfolioData } from "../types";
import UniversalVideoPlayer from "../components/UniversalVideoPlayer";

const profilePic = "/src/assets/images/regenerated_image_1780652478984.png";

interface VideosProps {
  onPlaySelected: (video: VideoItem) => void;
  portfolioData?: PortfolioData;
}

export default function Videos({ onPlaySelected, portfolioData }: VideosProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Custom video screen streaming state variables
  const [videoViewerMode, setVideoViewerMode] = useState<"gallery" | "player">("gallery");
  const [activeStreamVideo, setActiveStreamVideo] = useState<VideoItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const itemsPerPage = 8; // Fits 8 cards matching the mockup image!

  const videosList = useMemo(() => {
    if (portfolioData?.videos && portfolioData.videos.length > 0) {
      return portfolioData.videos;
    }
    return getVideosList();
  }, [portfolioData]);

  // Set the default featured active stream to avoid empty players
  useEffect(() => {
    if (videosList.length > 0 && !activeStreamVideo) {
      setActiveStreamVideo(videosList[0]);
    }
  }, [videosList, activeStreamVideo]);

  // Filter categories
  const categories = useMemo(() => {
    const list = new Set(videosList.map((v) => v.category));
    return ["All", ...Array.from(list)];
  }, [videosList]);

  // Filter and Search logic
  const filteredVideos = useMemo(() => {
    return videosList.filter((video) => {
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            video.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [videosList, searchQuery, selectedCategory]);

  // Pagination logic
  const paginatedVideos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVideos.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVideos, currentPage]);

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage) || 1;

  return (
    <div id="videos-page-viewport" className="w-full min-h-screen py-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-8 pb-32">
      
      {/* HEADER SECTION MATCHING THE SECOND MOCKUP */}
      <GlassCard 
        id="video-page-header"
        className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between w-full font-sans"
        hoverScale={false}
      >
        <div className="flex items-center gap-4 w-full md:w-auto justify-start">
          {/* PJ Logo badge */}
          <div className="px-5 py-2 bg-white/60 rounded-2xl border border-white/80 font-sans font-extrabold text-slate-800 text-xl shadow-inner select-none flex items-center justify-center bubble-gloss">
            P<span className="text-blue-600 font-serif font-extrabold">&</span>J
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-wider text-slate-800 uppercase text-left">
            P<span className="text-blue-600 font-serif lowercase italic">&</span>J Videos
          </h1>
        </div>

        {/* Search, Filter menu & user profile controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
          {/* Custom Search bar container */}
          <div className="relative flex-grow md:flex-initial max-w-xs">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
              <Search size={16} />
            </span>
            <input
              id="video-search-input"
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset page on input search
              }}
              className="
                w-full pl-10 pr-4 py-2 bg-white/65 backdrop-blur-md rounded-full border border-white/80
                text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white 
                transition-all duration-300 shadow-inner
              "
            />
          </div>

          {/* Interactive filter slide button */}
          <button
            id="video-filter-trigger"
            onClick={() => {
              // Cycle through categories
              const curIdx = categories.indexOf(selectedCategory);
              const nextIdx = (curIdx + 1) % categories.length;
              setSelectedCategory(categories[nextIdx]);
              setCurrentPage(1);
            }}
            className="p-2 bg-white/60 hover:bg-white/90 rounded-full border border-white/80 text-slate-700 hover:text-blue-600 transition-all duration-200 cursor-pointer shadow-sm relative"
            title="Cycle Categories"
          >
            <SlidersHorizontal size={18} />
            {selectedCategory !== "All" && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-600 border border-white" />
            )}
          </button>

          {/* User profile capsule circle */}
          <div className="w-10 h-10 rounded-full border border-white/80 shadow-md ring-2 ring-indigo-500/20 overflow-hidden flex items-center justify-center bg-white/50 mb-0.5 select-none">
            <img
              src={profilePic}
              alt="Dhiraj Profiles"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </GlassCard>

      {/* Toggle Video Viewer Mode Tabs with Micro-animations (consistent with PDF player in Resume/CV tab!) */}
      <div id="videos-view-tab-bar" className="flex items-center justify-center p-1 bg-slate-100/60 border border-slate-200/50 rounded-2xl max-w-lg mx-auto w-full select-none gap-1 font-sans shadow-xs print:hidden">
        {[
          { id: "gallery", label: "Video Clip Gallery", count: videosList.length.toString() },
          { id: "player", label: "Live Video Stream Player", count: "STREAM" }
        ].map((modeItem) => {
          const isSelected = videoViewerMode === modeItem.id;
          return (
            <button
              key={modeItem.id}
              onClick={() => setVideoViewerMode(modeItem.id as any)}
              className={`
                flex-grow py-2.5 px-3 rounded-xl text-xs font-bold leading-none uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer
                ${isSelected 
                  ? "bg-white text-indigo-650 border border-slate-200/50 shadow-sm font-extrabold scale-103" 
                  : "text-slate-650 hover:text-indigo-600 hover:bg-white/40"}
              `}
            >
              <span>{modeItem.label}</span>
              <span className={`text-[9.5px] font-mono leading-none px-1.5 py-0.5 rounded-md ${isSelected ? "bg-indigo-50 text-indigo-600" : "bg-slate-200/55 text-slate-500"}`}>
                {modeItem.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* VIEWPORTS: Render either searchable catalog or the high-fidelity streaming screen player */}
      <AnimatePresence mode="wait">
        {videoViewerMode === "gallery" && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-8 w-full"
          >

            <div id="category-scroller" className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar select-none">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    id={`filter-tab-${cat.replace(/\s+/g, "-")}`}
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`
                      px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer border select-none
                      ${isSelected 
                        ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-bold shadow-sm" 
                        : "bg-white/60 border-white/80 text-slate-700 hover:bg-white hover:text-blue-600 shadow-sm"}
                    `}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* VIDEOS COLLECTION GRID */}
            {filteredVideos.length > 0 ? (
              <div id="video-grid-container" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full auto-rows-max min-h-[400px]">
                {paginatedVideos.map((video) => (
                  <motion.div
                    key={video.id}
                    layout
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="flex justify-center"
                  >
                    <VideoCard 
                      video={video} 
                      onPlay={(v) => {
                        setActiveStreamVideo(v);
                        setVideoViewerMode("player");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }} 
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div id="no-videos-indicator" className="w-full min-h-[400px] flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-white/60 flex items-center justify-center text-slate-500 border border-white/80 bubble-gloss shadow-sm">
                  <Compass size={32} />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-extrabold text-lg text-slate-800 font-sans">No portfolio clips matched</h3>
                  <p className="text-sm text-slate-500 font-medium max-w-sm font-sans">Tweak your search queries or filter categories to explore other sections.</p>
                </div>
              </div>
            )}

            {/* PAGINATION SECTION */}
            {totalPages > 1 && (
              <div id="videos-pagination" className="w-full flex justify-center mt-6 select-none">
                <GlassCard 
                  id="paginator-bar"
                  className="px-3 py-1.5 flex items-center gap-3 rounded-full"
                  hoverScale={false}
                >
                  <button
                    id="page-prev-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={`
                      p-2 rounded-full transition-all duration-200 cursor-pointer
                      ${currentPage === 1 
                        ? "text-slate-400 cursor-not-allowed" 
                        : "text-slate-700 hover:bg-white/60 hover:text-blue-600"}
                    `}
                  >
                    <ArrowLeft size={16} />
                  </button>

                  <div className="flex items-center gap-1.5 font-sans">
                    {Array.from({ length: totalPages }, (_, idx) => {
                      const pageNum = idx + 1;
                      const isSelected = currentPage === pageNum;
                      return (
                        <button
                          id={`page-digit-${pageNum}`}
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`
                            w-8 h-8 rounded-full text-xs font-bold font-sans transition-all duration-300 cursor-pointer
                            ${isSelected 
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md bubble-gloss" 
                              : "text-slate-655 hover:bg-white/65 hover:text-blue-600"}
                          `}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    id="page-next-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={`
                      p-2 rounded-full transition-all duration-200 cursor-pointer
                      ${currentPage === totalPages 
                        ? "text-slate-400 cursor-not-allowed" 
                        : "text-slate-700 hover:bg-white/60 hover:text-blue-600"}
                    `}
                  >
                    <ArrowRight size={16} />
                  </button>
                </GlassCard>
              </div>
            )}
          </motion.div>
        )}

        {videoViewerMode === "player" && (
          <motion.div
            key="player"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col gap-8 text-left"
          >
            {activeStreamVideo ? (
              <div className="flex flex-col gap-6 w-full text-left">
                {/* TV Spotlight Main Screen Frame */}
                <div className="w-full h-[400px] sm:h-[520px] md:h-[600px] bg-[#0c0517]/95 border border-white/10 rounded-[28px] overflow-hidden relative shadow-2xl p-4 flex flex-col backdrop-blur-3xl animate-fade-in">
                  {/* Embedded Frame Header bar */}
                  <div className="flex justify-between items-center pb-3 px-2 border-b border-white/10 mb-3 select-none">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest leading-none flex items-center gap-1.5">
                        Active Stream Port <span className="text-blue-400 font-extrabold">● {activeStreamVideo.category}</span>
                      </span>
                      {/* Ultra HD Streaming Badge */}
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[9px] border border-emerald-500/30 font-black uppercase tracking-wider select-none leading-none">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                        1080p Ultra-HD Mode Active
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href={activeStreamVideo.driveLink || activeStreamVideo.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-sans font-bold text-indigo-300 hover:text-indigo-400 flex items-center gap-1 transition-colors capitalize"
                      >
                        <span>Open Raw Link</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>

                  <div className="flex-grow w-full relative rounded-2xl overflow-hidden bg-black border border-white/5 shadow-inner">
                    {/* Render standard direct video tag vs Google Drive view iframe */}
                    {!(activeStreamVideo.videoUrl.includes("drive.google.com") || activeStreamVideo.videoUrl.includes("docs.google.com")) ? (
                      <video
                        id="stage-video-core"
                        src={activeStreamVideo.videoUrl}
                        className="w-full h-full object-contain absolute inset-0 bg-black"
                        controls
                        autoPlay
                        loop
                        playsInline
                      />
                    ) : (
                      <iframe
                        src={activeStreamVideo.videoUrl}
                        className="w-full h-full absolute inset-0 border-none bg-black"
                        title={activeStreamVideo.title}
                        allow="autoplay; fullscreen"
                        allowFullScreen
                      />
                    )}
                  </div>
                </div>

                {/* Metadata & Actions card */}
                <div className="w-full bg-white/20 border border-white/40 backdrop-blur-md rounded-[24px] p-6 text-left flex flex-col gap-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-500/10 pb-4">
                    <div className="flex flex-col gap-1 text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase rounded-lg tracking-wider">
                          {activeStreamVideo.category}
                        </span>
                        <span className="px-2.5 py-0.5 bg-[#f5f3ff] text-indigo-750 text-[10px] font-extrabold uppercase rounded-lg tracking-wider">
                          {activeStreamVideo.duration || "Portfolio"}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1 uppercase tracking-wider font-sans">
                        {activeStreamVideo.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center font-sans font-sans">
                      <button
                        onClick={() => {
                          const originalUrl = activeStreamVideo.driveLink || activeStreamVideo.videoUrl;
                          navigator.clipboard.writeText(originalUrl);
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 2000);
                        }}
                        className="px-3.5 py-2 bg-white/85 hover:bg-white border border-slate-200 hover:border-slate-350 rounded-xl text-xs font-bold text-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-97 select-none"
                      >
                        {copiedLink ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                        <span>{copiedLink ? "Link Copied!" : "Copy Drive Link"}</span>
                      </button>
                    </div>
                  </div>

                  {activeStreamVideo.description && (
                    <div className="flex flex-col gap-1.5 text-left">
                      <h4 className="text-[10px] font-bold font-mono text-indigo-750 uppercase tracking-widest leading-none">Film Editing Specs</h4>
                      <p className="text-sm text-slate-600 font-semibold leading-relaxed whitespace-pre-wrap max-w-4xl">
                        {activeStreamVideo.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* 'UP NEXT' Horizontal Card Selector Stream Bar */}
                <div className="flex flex-col gap-3 text-left mt-4">
                  <div className="flex items-center justify-between font-sans">
                    <div className="flex items-center gap-2">
                      <Film size={14} className="text-indigo-650" />
                      <h3 className="text-xs font-extrabold text-indigo-800 uppercase tracking-wider">
                        Switch Channel / Alternative Clips
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase select-none">
                      {videosList.length} clips available
                    </span>
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scroll-smooth no-scrollbar select-none">
                    {videosList.map((video) => {
                      const isPlayingThis = activeStreamVideo.id === video.id;
                      return (
                        <div
                          key={video.id}
                          onClick={() => {
                            setActiveStreamVideo(video);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`
                            flex-shrink-0 w-52 snap-start rounded-2xl overflow-hidden cursor-pointer border group transition-all duration-300 relative bg-white/40 backdrop-blur-xs select-none
                            ${isPlayingThis 
                              ? "ring-2 ring-indigo-500 border-indigo-400 scale-102 shadow-md" 
                              : "border-slate-200 hover:border-slate-350 hover:bg-white/60"}
                          `}
                        >
                          <div className="h-28 w-full relative overflow-hidden bg-slate-900 select-none">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <span className="absolute top-2 left-2 text-[8px] font-extrabold uppercase px-1.5 py-0.5 bg-black/60 text-white rounded-md tracking-wider">
                              {video.category}
                            </span>
                            
                            {isPlayingThis ? (
                              <div className="absolute inset-0 bg-black/65 flex items-center justify-center text-white">
                                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-indigo-600 rounded-md border border-indigo-400 text-[8px]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                                  <span className="font-extrabold uppercase tracking-widest font-mono">ON CORE</span>
                                </div>
                              </div>
                            ) : (
                              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="p-1.5 bg-white/95 text-slate-800 rounded-full shadow-md">
                                  <Play size={10} className="fill-slate-800 translate-x-0.5" />
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="p-3 text-left">
                            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-tight line-clamp-1 group-hover:text-blue-650 transition-colors">
                              {video.title}
                            </h4>
                            <p className="text-[10px] text-slate-500 font-sans mt-0.5">{video.duration || "Portfolio"}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full py-16 text-center text-slate-400 font-sans">
                No active video source stream loaded.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

