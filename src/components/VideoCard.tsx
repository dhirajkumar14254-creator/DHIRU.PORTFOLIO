import React from "react";
import { Play, MoreVertical, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import GlassCard from "./GlassCard";
import { resolveImageUrl } from "../utils/googleSheet";
import { VideoItem } from "../types";
import UniversalVideoPlayer from "./UniversalVideoPlayer";

interface VideoCardProps {
  video: VideoItem;
  onPlay: (video: VideoItem) => void;
}

export default function VideoCard({ video, onPlay }: VideoCardProps) {
  const resolved = resolveImageUrl(video.thumbnail);
  const [imgSrc, setImgSrc] = React.useState(resolved);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    setImgSrc(resolveImageUrl(video.thumbnail));
  }, [video.thumbnail]);

  const handleImageError = () => {
    console.warn(`[VideoCard Image Error] Image failed to load: ${resolved}`);
    // Safe placeholder fallback
    setImgSrc("https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=600");
  };

  // Category-specific subtle candy tag coloring matching mockup
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "color grading":
        return "text-indigo-650";
      case "editing":
        return "text-blue-600";
      case "after effects":
        return "text-violet-600";
      case "vlog":
        return "text-emerald-600";
      case "tips & tricks":
        return "text-amber-600";
      case "design":
        return "text-pink-650";
      default:
        return "text-indigo-600";
    }
  };

  return (
    <GlassCard 
      id={`video-card-${video.id}`}
      className="p-3 w-full max-w-sm flex flex-col gap-3 group"
      hoverScale={true}
      onClick={() => onPlay(video)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail Aspect Ratio Frame */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-990 border border-white/40 shadow-inner">
        <img
          src={imgSrc}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={handleImageError}
        />
        
        {/* Transparent click absorption overlay block */}
        <div className="absolute inset-0 z-10 bg-black/10 transition-opacity duration-300 group-hover:bg-black/20" />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <motion.div
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white/75 backdrop-blur-md border border-white/50 text-slate-800 shadow-md bubble-gloss opacity-0 group-hover:opacity-100 transition-opacity duration-350"
          >
            <Play size={20} className="fill-slate-800 stroke-none translate-x-0.5" />
          </motion.div>
        </div>

        {/* Duration Timestamp Capsule */}
        <div className="absolute bottom-2 right-2 z-20 px-2 py-0.5 rounded-lg bg-white/85 backdrop-blur-md text-[10px] sm:text-xs font-mono font-bold text-slate-800 tracking-wider leading-none border border-white/30 shadow-sm pointer-events-none">
          {video.duration}
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-1 w-full text-left px-1">
        <div className="flex items-start justify-between gap-1 w-full">
          <div className="flex flex-col gap-0.5">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
              {video.title}
            </h3>
            <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-widest ${getCategoryColor(video.category)}`}>
              {video.category}
            </span>
          </div>
          
          <button 
            id={`vdo-more-btn-${video.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onPlay(video);
            }}
            className="text-slate-500 hover:text-indigo-600 p-1.5 rounded-full hover:bg-white/50 transition-colors duration-200 cursor-pointer relative z-25 flex-shrink-0"
          >
            <MoreVertical size={16} />
          </button>
        </div>

        {/* Video Description Content to show everything about the video */}
        {video.description && (
          <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1 leading-relaxed select-text">
            {video.description}
          </p>
        )}

        {/* Beautiful Action Options Row */}
        <div className="flex gap-2.5 mt-3 pt-2.5 border-t border-slate-100 w-full items-center justify-between">
          {/* Play Preview trigger CTA */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(video);
            }}
            className="flex-1 py-1.5 px-3 rounded-full bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-[11px] font-extrabold tracking-wide uppercase transition-colors duration-205 flex items-center justify-center gap-1 cursor-pointer"
          >
            <Play size={10} className="fill-current" />
            <span>Play Clip</span>
          </button>

          {/* Direct Drive Link "View" CTA Button */}
          <a
            href={video.driveLink || video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              // Stop card modal play trigger from firing
              e.stopPropagation();
            }}
            className="flex-1 py-1.5 px-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md text-[11px] font-extrabold tracking-wide uppercase transition-all duration-205 flex items-center justify-center gap-1 cursor-pointer shadow-sm hover:scale-[1.03]"
          >
            <ExternalLink size={10} />
            <span>View Source</span>
          </a>
        </div>
      </div>
    </GlassCard>
  );
}
