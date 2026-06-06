/**
 * Unified Video Resource Resolver Utility
 * For supporting multiple video hosting formats and structures cleanly.
 */

export interface ResolvedVideo {
  originalInput: string;
  detectedType: "youtube" | "drive" | "direct" | "unknown";
  resolvedUrl: string;
  renderMethod: "iframe" | "video" | "error";
  errorMsg?: string;
}

/**
 * Extract Google Drive file ID from arbitrary links
 */
export function getDriveFileId(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (dMatch && dMatch[1]) {
    return dMatch[1];
  }
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return idMatch[1];
  }
  return "";
}

/**
 * Extract YouTube 11-char Video ID with regexes supporting multiple formats
 */
export function getYouTubeId(url: string): string {
  if (!url) return "";
  let source = url.trim();

  // If passed an iframe, extract the src first
  if (source.includes("<iframe") || source.includes("<embed") || source.includes("<video")) {
    const srcMatch = source.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      source = srcMatch[1].trim();
    }
  }

  // 1. Shorts link
  const shortsMatch = source.match(/\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch && shortsMatch[1]) {
    return shortsMatch[1];
  }

  // 2. Embed link
  const embedMatch = source.match(/\/embed\/([a-zA-Z0-9_-]{11})/i);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }

  // 3. YouTube watch links or similar
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = source.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return match[2];
  }

  const vMatch = source.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (vMatch && vMatch[1]) {
    return vMatch[1];
  }

  return "";
}

/**
 * Extract Vimeo video ID from patterns
 */
export function getVimeoVideoId(url: string): string {
  if (!url) return "";
  let source = url.trim();

  if (source.includes("<iframe") || source.includes("<embed") || source.includes("<video")) {
    const srcMatch = source.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      source = srcMatch[1].trim();
    }
  }

  const vimRegExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)\d+(?:[^\/]*)\/?/i;
  const match = source.match(vimRegExp);
  if (match) {
    const digits = match[0].match(/\d+/);
    if (digits) {
      return digits[0];
    }
  }
  return "";
}

/**
 * Deep resolve and analyze any video source target link
 */
export function resolveVideoDetails(input: string): ResolvedVideo {
  const originalInput = input ? input.trim() : "";
  let target = originalInput;

  // 1. If input contains iframe, extractor parses only the src value
  if (target.includes("<iframe") || target.includes("<embed") || target.includes("<video")) {
    const srcMatch = target.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      target = srcMatch[1].trim();
    }
  }

  let detectedType: ResolvedVideo["detectedType"] = "unknown";
  let resolvedUrl = target;
  let renderMethod: ResolvedVideo["renderMethod"] = "error";
  let errorMsg: string | undefined;

  const isYouTube = target.includes("youtube.com") || target.includes("youtu.be") || target.includes("youtube-nocookie.com");
  const isDrive = target.includes("drive.google.com") || target.includes("docs.google.com") || target.includes("googleusercontent.com");
  const isDirectVideo = target.match(/\.(mp4|webm|ogg)(\?|$)/i) !== null;
  const isVimeo = target.includes("vimeo.com") || target.includes("player.vimeo.com");

  if (isYouTube) {
    detectedType = "youtube";
    renderMethod = "iframe";
    const isAlreadyEmbed = target.includes("youtube.com/embed/") || target.includes("youtube-nocookie.com/embed/");
    if (isAlreadyEmbed) {
      resolvedUrl = target;
    } else {
      const ytId = getYouTubeId(target);
      if (ytId) {
        resolvedUrl = `https://www.youtube.com/embed/${ytId}`;
      } else {
        resolvedUrl = target;
      }
    }
  } else if (isDrive) {
    detectedType = "drive";
    renderMethod = "iframe";
    const fileId = getDriveFileId(target);
    if (fileId) {
      resolvedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    } else {
      resolvedUrl = target;
    }
  } else if (isDirectVideo) {
    detectedType = "direct";
    renderMethod = "video";
    resolvedUrl = target;
  } else if (isVimeo) {
    detectedType = "direct"; // Will handle or map to iframe
    const vimeoId = getVimeoVideoId(target);
    if (vimeoId) {
      resolvedUrl = `https://player.vimeo.com/video/${vimeoId}`;
      detectedType = "youtube"; // Handle vimeo as standard map-to-iframe
      renderMethod = "iframe";
    } else {
      detectedType = "unknown";
      renderMethod = "error";
      errorMsg = "Unsupported video source";
    }
  } else {
    detectedType = "unknown";
    renderMethod = "error";
    errorMsg = "Unsupported video source";
  }

  // Debug requirements:
  // For each video log: original input, detected source type, resolved URL, render method
  console.log(`[Video Resolver Debug]
- Original Input: "${originalInput}"
- Detected Type: "${detectedType}"
- Resolved URL: "${resolvedUrl}"
- Render Method: "${renderMethod}"` + (errorMsg ? `\n- Error: "${errorMsg}"` : ""));

  return {
    originalInput,
    detectedType,
    resolvedUrl,
    renderMethod,
    errorMsg
  };
}

/**
 * Keep the simple resolver backwards compatibility exports if any scripts use it
 */
export function resolveVideoUrl(fileName: string): string {
  const details = resolveVideoDetails(fileName);
  return details.resolvedUrl || fileName;
}
