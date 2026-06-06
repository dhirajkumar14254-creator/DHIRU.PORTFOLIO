// googleSheet.ts - Robust parser for Google Sheets named tab schema
import { PortfolioData, ExperienceItem, SkillItem, VideoItem, VideoCardItem, FloatingLogoItem, PJCornerItem, ResumeItem, SocialLinkItem } from "../types";
import homeAvatar from "../assets/images/regenerated_image_1780580606806.png";

const SPREADSHEET_ID = "1qFiy94AJ_Ffi0UakzwU2eEM2j1jiZiiOlvr6hu8Z2K8";

export interface HomePageData {
  centerImages: string[];
  avatarImageMap?: Record<string, string>;
  aboutMe: string;
  name: string;
  welcomeSection: string;
  videoCardPath: string | null;
  videoCardPaths: string[];
}

export interface BottomNavbarData {
  home: string;
  about: string;
  work: string;
  workItems: string[];
  skills: string[];
  contact: {
    phone: string;
    email: string;
    location: string;
  };
}

export interface CornerVideosData {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
}

// DIAGNOSTIC UTILITY ENGINE
export interface DiagnosticIssue {
  type: "error" | "warning";
  timestamp: string;
  gid: string;
  message: string;
  details?: string;
}

export const sheetDiagnostics: {
  hasRun: boolean;
  issues: DiagnosticIssue[];
  rawResponses: Record<string, string>;
} = {
  hasRun: false,
  issues: [],
  rawResponses: {}
};

export function logDiagnostic(gid: string, type: "error" | "warning", message: string, details?: string) {
  const issue: DiagnosticIssue = {
    type,
    timestamp: new Date().toISOString(),
    gid,
    message,
    details
  };
  sheetDiagnostics.issues.push(issue);
  sheetDiagnostics.hasRun = true;
  console.log(`[Google Sheets Diagnostic] [${type.toUpperCase()}] (${gid}) ${message}`, details || "");
}

// HIGH-FIDELITY DEFAULT DATA OBJECT & STATIC LOCAL FALLBACK DATA
export const STATIC_AVATAR_IMAGES = {
  center_default: homeAvatar,
  center_top: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=600",
  center_bottom: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=600",
  center_left: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=600",
  center_right: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600"
};

export const STATIC_VIDEO_CARDS: VideoCardItem[] = [
  {
    title: "Nishant Sir Physics Course Hook",
    description: "High-retention promo editing with custom multi-cam split screens, sound design, and animated formula popups.",
    driveLink: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-38622-large.mp4",
    position: "grid-1",
    enabled: true
  },
  {
    title: "Dhiru Bhai Crypto Market Insight",
    description: "Dynamic infographic overlays, fast visual hooks, and cinematic intro sequencing.",
    driveLink: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-golden-bitcoin-object-34440-large.mp4",
    position: "grid-2",
    enabled: true
  },
  {
    title: "Sunder Van Cinematic Timelapse",
    description: "Color graded with premium Rec.709 3D LUTs, subtle camera speed ramps, and seamless audio tracks.",
    driveLink: "https://assets.mixkit.co/videos/preview/mixkit-sunset-seen-from-above-the-clouds-40010-large.mp4",
    position: "grid-3",
    enabled: true
  },
  {
    title: "EdTech Visual Masterclass",
    description: "Educational production templates, animated bullet callouts, and clean motion typography integrations.",
    driveLink: "https://assets.mixkit.co/videos/preview/mixkit-holding-a-video-camera-editing-a-scene-40899-large.mp4",
    position: "grid-4",
    enabled: true
  }
];

export const STATIC_PJ_CORNERS: PJCornerItem[] = [
  {
    title: "Top Left",
    description: "Active Camera Viewfinder",
    driveLink: "https://assets.mixkit.co/videos/preview/mixkit-cinematographer-operating-camera-rig-on-gimbal-41487-large.mp4",
    enabled: true
  },
  {
    title: "Top Right",
    description: "Live Timeline Render",
    driveLink: "https://assets.mixkit.co/videos/preview/mixkit-video-editing-software-timeline-on-dual-monitors-40455-large.mp4",
    enabled: true
  },
  {
    title: "Down Left",
    description: "Studio Floor Playback",
    driveLink: "https://assets.mixkit.co/videos/preview/mixkit-clapperboard-in-front-of-lights-set-33152-large.mp4",
    enabled: true
  },
  {
    title: "Down Right",
    description: "Audio Waveform Analyzer",
    driveLink: "https://assets.mixkit.co/videos/preview/mixkit-colored-audio-frequency-on-soundboard-screen-40334-large.mp4",
    enabled: true
  }
];

export const demoData: PortfolioData = {
  name: "DHIRAJ KUMAR",
  aboutMe: "I am an experienced video editor with a passion for crafting compelling visual stories. With four years of expertise in Adobe Premiere Pro and Adobe After Effects, I have honed my skills in creating captivating videos that engage and captivate audiences.",
  welcomeSection: "WELCOME",
  centerImages: [
    homeAvatar
  ],
  avatarImageMap: STATIC_AVATAR_IMAGES,
  floatingLogos: [], // component falls back to top-tier built-in logos in FloatingLogos.tsx
  videoCards: STATIC_VIDEO_CARDS,
  pjCorners: STATIC_PJ_CORNERS,
  contact: {
    phone: "+91 90060 16099",
    email: "dhirajkumar14254@gmail.com",
    location: "Patna, Bihar, India"
  },
  experiences: [
    {
      role: "Studio Operations Executive",
      company: "PW (PhysicsWallah)",
      period: "DEC 2025 - PRESENT",
      bullets: [
        "Supervising educational visual production queues, syncing audio tracks, and compiling animated templates in Adobe Creative Suite closely with expert tutors."
      ]
    }
  ],
  skills: [
    { name: "Premiere Pro", level: 95 }
  ],
  resume: [
    {
      resumeNo: "1",
      resumeLink: "https://docs.google.com/document/d/1O0K16YI-6rsm_1u7vWk7NfE-Bshh5m-iF_T6Zp6iXvY/pub",
      pdfDriveLink: "",
      htmlLink: "https://docs.google.com/document/d/1O0K16YI-6rsm_1u7vWk7NfE-Bshh5m-iF_T6Zp6iXvY/pub"
    }
  ],
  videos: [
    {
      id: "vid-static-1",
      title: "Nishant Sir Physics Course Hook",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-38622-large.mp4",
      category: "Education",
      duration: "Portfolio",
      description: "High-retention promo editing with custom multi-cam split screens, sound design, and animated formula popups.",
      driveLink: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-38622-large.mp4"
    },
    {
      id: "vid-static-2",
      title: "Dhiru Bhai Crypto Market Insight",
      thumbnail: "https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&q=80&w=800",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-golden-bitcoin-object-34440-large.mp4",
      category: "Crypto",
      duration: "Portfolio",
      description: "Dynamic infographic overlays, fast visual hooks, and cinematic intro sequencing.",
      driveLink: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-golden-bitcoin-object-34440-large.mp4"
    },
    {
      id: "vid-static-3",
      title: "Sunder Van Cinematic Timelapse",
      thumbnail: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-sunset-seen-from-above-the-clouds-40010-large.mp4",
      category: "Cinematic",
      duration: "Portfolio",
      description: "Color graded with premium Rec.709 3D LUTs, subtle camera speed ramps, and seamless audio tracks.",
      driveLink: "https://assets.mixkit.co/videos/preview/mixkit-sunset-seen-from-above-the-clouds-40010-large.mp4"
    },
    {
      id: "vid-static-4",
      title: "EdTech Visual Masterclass",
      thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-holding-a-video-camera-editing-a-scene-40899-large.mp4",
      category: "Editing",
      duration: "Portfolio",
      description: "Educational production templates, animated bullet callouts, and clean motion typography integrations.",
      driveLink: "https://assets.mixkit.co/videos/preview/mixkit-holding-a-video-camera-editing-a-scene-40899-large.mp4"
    }
  ]
};

// Define a stable, session-level timestamp for cache-busting.
const SESSION_TIMESTAMP = Date.now();

import {
  getDriveFileId as resolverGetDriveFileId,
  getYouTubeId as resolverGetYouTubeId,
  getVimeoVideoId as resolverGetVimeoVideoId,
  resolveVideoUrl as resolverResolveVideoUrl
} from "./videoResolver";

// Helper to extract file ID from Google Drive links
export function getDriveFileId(url: string): string {
  return resolverGetDriveFileId(url);
}

// IMAGE RESOURCE PATH RESOLVER
export function resolveImageUrl(path: string): string {
  if (!path) {
    return "";
  }

  let trimmed = path.trim();

  // Strip off direction prefix if present (e.g., "center_default = https://...", "center_top:https://...")
  const prefixMatch = trimmed.match(/^([^:=]+)[:=](.+)$/);
  if (prefixMatch) {
    const key = prefixMatch[1].trim().toLowerCase();
    if (key !== "http" && key !== "https" && (key.includes("center") || key.includes("default") || key.includes("top") || key.includes("bottom") || key.includes("left") || key.includes("right"))) {
      trimmed = prefixMatch[2].trim();
    }
  }

  if (trimmed.startsWith("http") && (trimmed.includes("drive.google.com") || trimmed.includes("docs.google.com") || trimmed.includes("googleusercontent.com"))) {
    const fileId = getDriveFileId(trimmed);
    if (fileId) {
      // Use the high-performance cookie-free lh3.googleusercontent.com CDN direct image link.
      // This is the ideal and most robust method used for Google Drive public file embeds.
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }

  if (trimmed.startsWith("http") || trimmed.startsWith("/")) {
    return trimmed;
  }
  
  // Elegant fallback to a stunning top-tier professional studio headshot of a handsome young Indian video editor with glasses in a black suit.
  return "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=600";
}

// RESUME/PDF RESOURCE PATH RESOLVER -- replicates the video preview URL rewriting logic
export function resolveResumeUrl(linkStr: string | undefined): string {
  if (!linkStr) return "";
  const s = linkStr.trim();
  if (s.startsWith("file://") || s.includes("Users/") || s.includes("Downloads/") || s.toLowerCase().includes("dhiraj_kumar_cv")) {
    return "/dhiraj_kumar_cv.html";
  }
  if (s.startsWith("http://") || s.startsWith("https://")) {
    const fileId = getDriveFileId(s);
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return s;
  }
  return s.startsWith("/") ? s : `/${s}`;
}

// Clean quotes, spaces, HTML tags, and line breaks from every cell
export function cleanCellText(cell: any): string {
  if (cell === null || cell === undefined) return "";
  let str = String(cell);
  str = str.replace(/<\/?[^>]+(>|$)/g, ""); // strip HTML
  str = str.replace(/[\r\n]+/g, " "); // remove raw line breaks
  str = str.trim();
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    str = str.slice(1, -1).trim();
  }
  return str;
}

// Map of canonical sheet categories and their misspelled counterparts to exact GIDs
const VALID_SHEETS_CONFIG: Record<string, { name: string; gid?: string }> = {
  "HOME TEXT": { name: "HOME TEXT", gid: "0" },
  "HOME_TEXT": { name: "HOME TEXT", gid: "0" },
  "VIDEO": { name: "VIDEO", gid: "97283824" },
  "VIDEO_CARD": { name: "VIDEO", gid: "97283824" },
  "VDO CARD": { name: "VIDEO", gid: "97283824" },
  "VDO_CARD": { name: "VIDEO", gid: "97283824" },
  "VIDEO CARD": { name: "VIDEO", gid: "97283824" },
  "EXPERIENCE": { name: "EXPIRINCE", gid: "1999507439" },
  "EXPIRINCE": { name: "EXPIRINCE", gid: "1999507439" },
  "EXPERIENCES": { name: "EXPIRINCE", gid: "1999507439" },
  "SKILLS": { name: "SKILLS", gid: "484003839" },
  "SKILL": { name: "SKILLS", gid: "484003839" },
  "RESUME": { name: "RESUME", gid: "840354792" },
  "RESUMES": { name: "RESUME", gid: "840354792" },
  "SOCIAL LINK": { name: "SOCIAL LINK", gid: "736380310" },
  "SOCIAL LINKS": { name: "SOCIAL LINK", gid: "736380310" },
  "SOCIAL_LINK": { name: "SOCIAL LINK", gid: "736380310" },
  "SOCIAL_LINKS": { name: "SOCIAL LINK", gid: "736380310" },
  "SOCIAL_SERVICES": { name: "SOCIAL LINK", gid: "736380310" },
  "CONTACT DETAILS": { name: "CONTACT DETAILS", gid: "1835024605" },
  "CONTACT_DETAILS": { name: "CONTACT DETAILS", gid: "1835024605" },
  "CONTACT": { name: "CONTACT DETAILS", gid: "1835024605" },
  "HOME CENTER VIDEO TAB CORNER": { name: "HOME_CENTER_VIDEO_TAB_CORNER" },
  "HOME_CENTER_VIDEO_TAB_CORNER": { name: "HOME_CENTER_VIDEO_TAB_CORNER" },
  "HOME CENTER VIDEO": { name: "HOME_CENTER_VIDEO_TAB_CORNER" },
  "HOME CENTER": { name: "HOME_CENTER_VIDEO_TAB_CORNER" },
  "VIDEO CORNER": { name: "HOME_CENTER_VIDEO_TAB_CORNER" }
};

// Low-level fetch and parse helper by sheet name using exact GIDs or Sheet Name fallback
async function fetchSheetByNameRaw(sheetName: string): Promise<any[]> {
  const normKey = sheetName.toUpperCase().trim();
  const config = VALID_SHEETS_CONFIG[normKey];
  const targetSheetName = config ? config.name : sheetName;

  let url = "";
  if (config && config.gid) {
    url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${config.gid}&_t=${Date.now()}`;
  } else {
    // Dynamic query by sheet name directly if gid doesn't exist, which fits new user tabs beautifully!
    url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(targetSheetName)}&_t=${Date.now()}`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      logDiagnostic(targetSheetName, "error", `Fetch failed with HTTP status: ${res.status}`);
      return [];
    }
    const text = await res.text();
    sheetDiagnostics.rawResponses[targetSheetName] = text;
    
    // Check if returned content is HTML (Private sheets/login screens)
    if (text.trim().startsWith("<!DOCTYPE html") || text.includes("<html")) {
      logDiagnostic(
        targetSheetName, 
        "error", 
        "Fetched sheet response returned HTML. This generally occurs when the Google Sheet is Private. Please share with 'Anyone with the link can view'."
      );
      return [];
    }

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) {
      logDiagnostic(targetSheetName, "error", "Failed to resolve JSON wrapping delimiters inside response payload.");
      return [];
    }
    const jsonStr = text.substring(jsonStart, jsonEnd + 1);
    
    let data;
    try {
      data = JSON.parse(jsonStr);
    } catch (parseError: any) {
      logDiagnostic(targetSheetName, "error", `Malformed JSON structure: ${parseError.message}`);
      return [];
    }
    
    if (!data.table || !data.table.rows) {
      logDiagnostic(targetSheetName, "error", "Parsed JSON successfully, but is missing standard table.cols or table.rows layout.");
      return [];
    }
    
    const rows = data.table.rows;
    const mapped = rows.map((r: any) => {
      const rowData: any = {};
      if (r && r.c) {
        r.c.forEach((cell: any, idx: number) => {
          const colLabel = String.fromCharCode(65 + idx); // A, B, C...
          rowData[colLabel] = cell?.v ?? null;
        });
      }
      return rowData;
    });

    const isHeaderRow = (row: any): boolean => {
      if (!row) return false;
      const colA = String(row["A"] || "").toLowerCase().trim();
      const colB = String(row["B"] || "").toLowerCase().trim();
      const colC = String(row["C"] || "").toLowerCase().trim();
      return (
        colA === "direction" || colA === "role" || colA === "platform" || colA === "phone" || colA === "resume_no" || colA === "resume no." || colA === "name section" || colA === "platform name" || colA === "title" || colA === "link" || colA === "url" || colA === "image" ||
        colB === "company" || colB === "level" || colB === "email" || colB === "resume name" || colB === "welcome section" ||
        colC === "about me section" || colC === "pdf drive link" || colC === "rating"
      );
    };

    // Filter out rows that are headers, leaving only active content rows
    return mapped.filter(row => {
      const keys = Object.keys(row);
      if (keys.length === 0) return false;
      if (isHeaderRow(row)) return false;
      return keys.some(k => row[k] !== null && String(row[k]).trim() !== "");
    });
  } catch (error: any) {
    logDiagnostic(targetSheetName, "error", `Fatal parser exception: ${error.message}`);
    return [];
  }
}

// Fallback resolver for misspelled sheet tabs matching user screenshots
export async function fetchSheetByName(sheetName: string): Promise<any[]> {
  const normKey = sheetName.toUpperCase().trim();
  const config = VALID_SHEETS_CONFIG[normKey];
  const targetSheetName = config ? config.name : sheetName;

  const rows = await fetchSheetByNameRaw(sheetName);
  if (rows && rows.length > 0) {
    console.log(`[Google Sheet Integration] Successfully fetched active layout for tab: "${targetSheetName}"`);
    return rows;
  }
  
  console.warn(`[Google Sheet Integration] No rows retrieved from tab "${targetSheetName}"`);
  return [];
}

// Fetch HOME PAGE data under the 10 sheets layout
export async function getHomePageData(): Promise<HomePageData> {
  const homeTextRows = await fetchSheetByName("HOME TEXT");
  const cleanHomeText = homeTextRows.filter(r => cleanCellText(r["A"]).toLowerCase() !== "name");
  
  let name = demoData.name;
  let welcomeSection = demoData.welcomeSection;
  let aboutMe = demoData.aboutMe;
  
  if (cleanHomeText.length > 0) {
    const row = cleanHomeText[0];
    name = cleanCellText(row["A"]) || name;
    welcomeSection = cleanCellText(row["B"]) || welcomeSection;
    aboutMe = cleanCellText(row["C"]) || aboutMe;
  }
  
  const avatarImageMap: Record<string, string> = STATIC_AVATAR_IMAGES;
  const centerImages: string[] = Object.values(STATIC_AVATAR_IMAGES);
  
  const videoCardPaths: string[] = STATIC_VIDEO_CARDS.map(v => v.driveLink);
  let videoCardPath: string | null = videoCardPaths[0] || null;

  return {
    centerImages,
    avatarImageMap,
    aboutMe,
    name,
    welcomeSection,
    videoCardPath,
    videoCardPaths
  };
}

// Fetch BOTTOM NAVBAR details
export async function getBottomNavbarData(): Promise<BottomNavbarData> {
  const contactRows = await fetchSheetByName("CONTACT DETAILS");
  const cleanContactRows = contactRows.filter(r => cleanCellText(r["A"]).toLowerCase() !== "phone");
  
  let phone = demoData.contact.phone;
  let email = demoData.contact.email;
  let location = demoData.contact.location;
  
  if (cleanContactRows.length > 0) {
    const row = cleanContactRows[0];
    phone = cleanCellText(row["A"]) || phone;
    email = cleanCellText(row["B"]) || email;
    location = cleanCellText(row["C"]) || location;
  }

  const homeTextRows = await fetchSheetByName("HOME TEXT");
  const cleanHomeText = homeTextRows.filter(r => cleanCellText(r["A"]).toLowerCase() !== "name");
  let welcomeSection = demoData.welcomeSection;
  let aboutMe = demoData.aboutMe;
  if (cleanHomeText.length > 0) {
    welcomeSection = cleanCellText(cleanHomeText[0]["B"]) || welcomeSection;
    aboutMe = cleanCellText(cleanHomeText[0]["C"]) || aboutMe;
  }

  return {
    home: welcomeSection,
    about: aboutMe,
    work: "",
    workItems: [],
    skills: [],
    contact: { phone, email, location }
  };
}

// Fetch P&J CORNERS data
export async function getCornerVideosData(): Promise<CornerVideosData> {
  let topLeft = "https://assets.mixkit.co/videos/preview/mixkit-cinematographer-operating-camera-rig-on-gimbal-41487-large.mp4";
  let topRight = "https://assets.mixkit.co/videos/preview/mixkit-video-editing-software-timeline-on-dual-monitors-40455-large.mp4";
  let bottomLeft = "https://assets.mixkit.co/videos/preview/mixkit-clapperboard-in-front-of-lights-set-33152-large.mp4";
  let bottomRight = "https://assets.mixkit.co/videos/preview/mixkit-colored-audio-frequency-on-soundboard-screen-40334-large.mp4";

  return {
    topLeft,
    topRight,
    bottomLeft,
    bottomRight
  };
}

export function getYouTubeId(url: string): string {
  return resolverGetYouTubeId(url);
}

export function getVimeoId(url: string): string {
  return resolverGetVimeoVideoId(url);
}

export function resolveVideoUrl(fileName: string): string {
  return resolverResolveVideoUrl(fileName);
}

// Static/Backup list for VideItems
export function getVideosList(): VideoItem[] {
  return [
    {
      id: "vid-backup-1",
      title: "Cinematic Showcase",
      category: "Editing",
      duration: "Live Stream",
      thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-holding-a-video-camera-editing-a-scene-40899-large.mp4"
    }
  ];
}

export let lastLoadSource: "live" | "cache" | "local" = "live";

export let memoryCachedData: PortfolioData | null = null;

export function clearMemoryCache() {
  memoryCachedData = null;
}

// Full 10 Sheets Aggregate Data loader with real-time direct prioritization
export async function getCompletePortfolioData(forceRefresh = false): Promise<PortfolioData> {
  // If we already have the sheet data in memory, absolutely return it directly.
  // This satisfies optimization task 15 (fetch only once and cache in memory to prevent repeated calls within the session).
  if (memoryCachedData && !forceRefresh) {
    console.log("[Portfolio] Loading Google Sheet data from Memory Cache");
    lastLoadSource = "cache";
    return memoryCachedData;
  }

  // Page reloads/refreshes have memoryCachedData = null. To ensure "current to current data" sync with Google Sheets (with no stale cache blocks),
  // we always execute a live dynamic fetch. Only if the live fetch fails do we fall back to cached data.
  console.log("[Portfolio] Pulling real-time 10 sheets schema dynamically...");
  lastLoadSource = "live";
  try {
    // 1. HOME TEXT
    const homeTextRows = await fetchSheetByName("HOME TEXT");
    const cleanHomeText = homeTextRows.filter(r => cleanCellText(r["A"]).toLowerCase() !== "name");
    
    let name = demoData.name;
    let welcomeSection = demoData.welcomeSection;
    let aboutMe = demoData.aboutMe;
    let homeCenterImage: string | undefined = undefined;
    let videoSectionCornerImage: string | undefined = undefined;

    if (cleanHomeText.length > 0) {
      const row = cleanHomeText[0];
      
      // Col A, B, C: Name, Welcome banner text, and About me bio text
      name = cleanCellText(row["A"]) || name;
      welcomeSection = cleanCellText(row["B"]) || welcomeSection;
      aboutMe = cleanCellText(row["C"]) || aboutMe;

      // Col D & E: HOME CENTER image link and VIDEO TAB CORNER image link (fallback to D if E is blank)
      const colDVal = cleanCellText(row["D"]);
      const colEVal = cleanCellText(row["E"]) || colDVal;

      if (colDVal && (colDVal.toLowerCase().startsWith("http://") || colDVal.toLowerCase().startsWith("https://"))) {
        homeCenterImage = resolveImageUrl(colDVal);
      }
      if (colEVal && (colEVal.toLowerCase().startsWith("http://") || colEVal.toLowerCase().startsWith("https://"))) {
        videoSectionCornerImage = resolveImageUrl(colEVal);
      }

      console.log(`[Google Sheets HOME TEXT Image Sync] Resolved successfully from HOME TEXT Row 2:`, {
        name,
        welcomeSection,
        aboutMe,
        rawD: colDVal,
        rawE: colEVal,
        resolvedHomeCenter: homeCenterImage,
        resolvedVideoCorner: videoSectionCornerImage
      });
    }

    const resolvedHomeCenterImage = homeCenterImage || homeAvatar;
    const resolvedVideoCornerImage = videoSectionCornerImage || resolvedHomeCenterImage;

    const avatarImageMap: Record<string, string> = {
      ...STATIC_AVATAR_IMAGES,
      center_default: resolvedHomeCenterImage
    };
    const centerImages: string[] = [resolvedHomeCenterImage];

    // 3. FLOATING LOGO (Built-in orbit fallback in FloatingLogos component)
    const floatingLogos: FloatingLogoItem[] = [];

    // 4. VDO CARD (Dynamic Sheet Fetch + Static Fallback)
    const vdoRows = await fetchSheetByName("VDO CARD");
    const cleanVdoRows = vdoRows.filter(r => {
      const title = cleanCellText(r["A"]).toLowerCase();
      return title !== "title" && title !== "";
    });
    
    let videoCards: VideoCardItem[] = [];
    if (cleanVdoRows.length > 0) {
      videoCards = cleanVdoRows.map((row, idx) => {
        const title = cleanCellText(row["A"]);
        const description = cleanCellText(row["B"]);
        const driveLink = cleanCellText(row["C"]);
        const enabledText = cleanCellText(row["D"]).toUpperCase();
        const enabled = enabledText === "" ? true : enabledText !== "FALSE";
        const position = `grid-${(idx % 4) + 1}`;
        return { title, description, driveLink, position, enabled };
      });
    }

    if (videoCards.length === 0) {
      videoCards = STATIC_VIDEO_CARDS;
    }

    // 5. P&J CORNERS (Static Fallback)
    const pjCorners: PJCornerItem[] = STATIC_PJ_CORNERS;

    // 6. EXPERIENCE
    const experienceRows = await fetchSheetByName("EXPERIENCE");
    const cleanExpRows = experienceRows.filter(r => cleanCellText(r["A"]).toLowerCase() !== "role");
    const experiences: ExperienceItem[] = cleanExpRows
      .filter(row => {
        const role = cleanCellText(row["A"]);
        // Exclude leaky default tab content
        return role !== "DHIRAJ KUMAR" && role !== "";
      })
      .map(row => {
        const role = cleanCellText(row["A"]);
        const company = cleanCellText(row["B"]);
        const period = cleanCellText(row["C"]);
        const desc = cleanCellText(row["D"]);
        let bullets: string[] = [];
        if (desc) {
          bullets = desc
            .split(/[\n•;]+/)
            .map(part => part.trim())
            .filter(part => part !== "" && part.length > 2);
        }
        if (bullets.length === 0) {
          bullets = [desc || "Visual storytelling production workflow."];
        }
        return { role, company, period, bullets };
      });

    if (experiences.length === 0) {
      experiences.push(...demoData.experiences);
    }

    // 7. SKILLS
    const skillsRows = await fetchSheetByName("SKILLS");
    const cleanSkillsRows = skillsRows.filter(r => cleanCellText(r["A"]).toLowerCase() !== "name");
    const skills: SkillItem[] = cleanSkillsRows
      .filter(row => {
        const name = cleanCellText(row["A"]);
        // Exclude leaky default tab content
        return name !== "DHIRAJ KUMAR" && name !== "";
      })
      .map(row => {
        const name = cleanCellText(row["A"]);
        const levelVal = cleanCellText(row["B"]);
        const ratingVal = cleanCellText(row["C"]);
        
        const parsedC = parseFloat(ratingVal);
        let levelNum = 85;
        if (!isNaN(parsedC)) {
          if (parsedC <= 1.0 && parsedC > 0) {
            levelNum = Math.round(parsedC * 100);
          } else if (parsedC > 1 && parsedC <= 100) {
            levelNum = Math.round(parsedC);
          }
        }
        
        return { 
          name, 
          level: levelNum, 
          rating: parsedC || 4,
          levelName: levelVal || "Expert" 
        };
      });

    // We do not push default skills to ensure only the spreadsheet skills are displayed as requested.

    // 8. RESUME
    const resumeRows = await fetchSheetByName("RESUME");
    const cleanResumeRows = resumeRows.filter(r => {
      const valA = cleanCellText(r["A"]).toLowerCase().trim();
      return valA !== "resume_no" && valA !== "resume name" && valA !== "resume_name" && valA !== "resume";
    });
    const resume: ResumeItem[] = cleanResumeRows
      .filter(row => {
        const resumeNo = cleanCellText(row["A"]);
        // Exclude leaky default tab content
        return resumeNo !== "DHIRAJ KUMAR" && resumeNo !== "";
      })
      .map(row => {
        const resumeNo = cleanCellText(row["A"]);
        const pdfDriveLink = cleanCellText(row["B"]);
        const htmlLink = cleanCellText(row["C"]);
        return {
          resumeNo,
          resumeLink: pdfDriveLink || htmlLink,
          pdfDriveLink,
          htmlLink
        };
      });

    if (resume.length === 0) {
      resume.push(...demoData.resume);
    }

    // 9. SOCIAL LINK
    const socialRows = await fetchSheetByName("SOCIAL LINK");
    const cleanSocialRows = socialRows.filter(r => cleanCellText(r["A"]).toLowerCase() !== "platform");
    const socialLinks: SocialLinkItem[] = cleanSocialRows
      .filter(row => {
        const plat = cleanCellText(row["A"]);
        // Exclude leaky default tab content
        if (plat === "DHIRAJ KUMAR" || plat === "") return false;
        // Keep even if directUrl is empty, and ignore rows explicitly disabled with "FALSE" in column D
        return cleanCellText(row["D"]).toUpperCase() !== "FALSE";
      })
      .map(row => {
        const platform = cleanCellText(row["A"]);
        const directUrl = cleanCellText(row["B"]) || "";
        const orderVal = cleanCellText(row["C"]);
        const orderNum = parseInt(orderVal, 10) || 100;
        return { platform, directUrl, order: orderNum, enabled: true };
      })
      .sort((a, b) => a.order - b.order);

    // 10. CONTACT DETAILS
    const contactRows = await fetchSheetByName("CONTACT DETAILS");
    const cleanContactRows = contactRows.filter(r => cleanCellText(r["A"]).toLowerCase() !== "phone");
    let contact = {
      phone: demoData.contact.phone,
      email: demoData.contact.email,
      location: demoData.contact.location
    };
    if (cleanContactRows.length > 0) {
      const row = cleanContactRows[0];
      contact = {
        phone: cleanCellText(row["A"]) || contact.phone,
        email: cleanCellText(row["B"]) || contact.email,
        location: cleanCellText(row["C"]) || contact.location
      };
    }

    // Compile dynamic videos list from all enabled VDO CARDs
    const videos: VideoItem[] = videoCards.map((v, index) => {
      const fileId = getDriveFileId(v.driveLink);
      const ytId = getYouTubeId(v.driveLink);
      let category = "Editing";
      const titleLow = v.title.toLowerCase();
      if (titleLow.includes("crypto") || titleLow.includes("bitcoin") || titleLow.includes("dhiru")) {
        category = "Crypto";
      } else if (titleLow.includes("nishant") || titleLow.includes("sir") || titleLow.includes("education")) {
        category = "Education";
      } else if (titleLow.includes("cinematic") || titleLow.includes("film") || titleLow.includes("vlog") || titleLow.includes("trailer")) {
        category = "Cinematic";
      }

      let thumbnail = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800";
      if (fileId) {
        thumbnail = `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;
      } else if (ytId) {
        thumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      }

      return {
        id: `vdo-${index}`,
        title: v.title,
        thumbnail,
        videoUrl: resolveVideoUrl(v.driveLink),
        category,
        duration: "Portfolio",
        description: v.description,
        driveLink: v.driveLink
      };
    });

    const result: PortfolioData = {
      name,
      aboutMe,
      welcomeSection,
      centerImages: centerImages.length > 0 ? centerImages : demoData.centerImages,
      avatarImageMap,
      homeCenterImage: resolvedHomeCenterImage,
      videoSectionCornerImage: resolvedVideoCornerImage,
      floatingLogos,
      videoCards,
      pjCorners,
      resume,
      socialLinks,
      contact,
      experiences,
      skills,
      videos
    };

    try {
      localStorage.setItem("dhiraj_portfolio_sheet_cache", JSON.stringify(result));
      localStorage.setItem("dhiraj_portfolio_sheet_cache_time", Date.now().toString());
    } catch (e) {
      console.error("Failed to commit fetched Google Sheet data to cache:", e);
    }

    memoryCachedData = result;
    return result;

  } catch (err: any) {
    logDiagnostic("ALL", "error", `Fatal sheet aggregate compiler error: ${err.message}`);
    
    // Attempt offline raw lookup fallbacks to preserve uptime during network failures
    try {
      const cachedData = localStorage.getItem("dhiraj_portfolio_sheet_cache");
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (parsed && typeof parsed === "object" && parsed.name) {
          console.log("[Portfolio] Offline Recovery: Loaded cached Google Sheet image footprint.");
          lastLoadSource = "cache";
          memoryCachedData = parsed;
          return parsed;
        }
      }
    } catch (_) {}

    try {
      const localOverride = localStorage.getItem("dhiraj_portfolio_data");
      if (localOverride) {
        const parsed = JSON.parse(localOverride);
        if (parsed && typeof parsed === "object" && parsed.name) {
          console.log("[Portfolio] Offline Recovery: Loaded custom browser profile footprint.");
          lastLoadSource = "local";
          memoryCachedData = parsed;
          return parsed;
        }
      }
    } catch (_) {}
  }

  memoryCachedData = demoData;
  return demoData;
}

// Local persistence functions
export function saveLocalPortfolioData(data: PortfolioData): void {
  try {
    localStorage.setItem("dhiraj_portfolio_data", JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save local portfolio override:", e);
  }
}

export function resetLocalPortfolioData(): void {
  try {
    localStorage.removeItem("dhiraj_portfolio_data");
    localStorage.removeItem("dhiraj_portfolio_sheet_cache");
    localStorage.removeItem("dhiraj_portfolio_sheet_cache_time");
  } catch (e) {
    console.error("Failed to reset local portfolio storage:", e);
  }
}
