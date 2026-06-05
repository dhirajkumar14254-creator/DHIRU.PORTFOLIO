import React from "react";

interface UniversalVideoPlayerProps {
  url: string;
  className?: string;
}

export default function UniversalVideoPlayer({ url, className = "" }: UniversalVideoPlayerProps) {
  if (!url) return null;

  const isGoogleDrive = url.includes("drive.google.com") || url.includes("docs.google.com");

  if (isGoogleDrive) {
    // Format link to /preview embedded player if it hasn't been done
    let embedUrl = url;
    if (!url.includes("/preview") && !url.includes("/embed")) {
      try {
        const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        const fileId = fileIdMatch ? fileIdMatch[1] : "";
        if (fileId) {
          embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        } else {
          const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
          if (idMatch && idMatch[1]) {
            embedUrl = `https://drive.google.com/file/d/${idMatch[1]}/preview`;
          }
        }
      } catch (e) {
        console.error("[UniversalVideoPlayer] Google Drive parse error:", e);
      }
    }

    // Embed-friendly clean parameters with high quality streaming instruction
    const separator = embedUrl.includes("?") ? "&" : "?";
    const finalSrc = embedUrl.includes("vq=") ? embedUrl : `${embedUrl}${separator}vq=hd1080&rel=0`;

    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        <iframe
          src={finalSrc}
          title="Google Drive Video Stream"
          className="w-full h-full absolute inset-0 rounded-2xl border-0 pointer-events-auto"
          allow="autoplay; encrypted-media; fullscreen"
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback to standard HTML5 video tag
  return (
    <video
      src={url}
      autoPlay
      muted
      loop
      playsInline
      className={`w-full h-full object-cover ${className}`}
    />
  );
}
