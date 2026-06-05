export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface SkillItem {
  name: string;
  level: number;
  rating?: number;
  levelName?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  category: string;
  duration: string;
  description?: string;
  driveLink?: string;
}

export interface AuditRecord {
  id: string;
  type: "image" | "video";
  source: string;
  originalUrl: string;
  resolvedUrl: string;
  status: "pending" | "success" | "failed";
  reason?: string;
}

export interface VideoCardItem {
  title: string;
  description: string;
  driveLink: string;
  position: string;
  enabled: boolean;
}

export interface FloatingLogoItem {
  name: string;
  driveLink: string;
  enabled: boolean;
}

export interface PJCornerItem {
  title: string;
  description: string;
  driveLink: string;
  enabled: boolean;
}

export interface ResumeItem {
  resumeNo: string;
  resumeLink: string;
  pdfDriveLink: string;
  htmlLink: string;
}

export interface SocialLinkItem {
  platform: string;
  directUrl: string;
  order: number;
  enabled: boolean;
}

export interface PortfolioData {
  name: string;
  aboutMe: string;
  welcomeSection: string;
  centerImages: string[];
  avatarImageMap?: Record<string, string>;
  floatingLogos?: FloatingLogoItem[];
  videoCards?: VideoCardItem[];
  pjCorners?: PJCornerItem[];
  resume?: ResumeItem[];
  socialLinks?: SocialLinkItem[];
  contact: {
    phone: string;
    email: string;
    location: string;
  };
  experiences: ExperienceItem[];
  skills: SkillItem[];
  videos?: VideoItem[];
}

