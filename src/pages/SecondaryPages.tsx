import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Briefcase, 
  Code, 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle, 
  ChevronRight, 
  Compass, 
  ExternalLink,
  Copy,
  Check
} from "lucide-react";
import GlassCard from "../components/GlassCard";
import { PortfolioData } from "../types";
import { getDriveFileId, resolveResumeUrl } from "../utils/googleSheet";

interface SecondaryPagesProps {
  currentTab: string;
  portfolioData: PortfolioData;
}

export default function SecondaryPages({ currentTab, portfolioData }: SecondaryPagesProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [contactError, setContactError] = useState("");
  const [copiedPdf, setCopiedPdf] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [resumeViewerMode, setResumeViewerMode] = useState<"compiled" | "pdf" | "html">("compiled");

  const scriptUrl = "https://script.google.com/macros/s/AKfycbystF6f8QqI-r0CsHW46Ch93dtqPwiNk9p1b051HySkCVwwClAwYPIw_k317gj8rKN_Ug/exec";

  if (!portfolioData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 animate-spin" />
      </div>
    );
  }

  // Handle slide form submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      setContactError("Please fill out all fields before sending.");
      return;
    }
    setContactError("");
    setIsSending(true);

    try {
      const formData = new FormData();
      formData.append("name", formState.name);
      formData.append("email", formState.email);
      formData.append("message", formState.message);

      const response = await fetch(scriptUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.success === true) {
        setFormSubmitted(true);
        setFormState({ name: "", email: "", message: "" });
        setTimeout(() => setFormSubmitted(false), 6000); // hide success bubble after 6s
      } else {
        const errorMsg = (data && data.error) || (data && data.message) || "Failed to deliver message via Web App.";
        setContactError(errorMsg);
      }
    } catch (err: any) {
      console.error("Direct Message API Error:", err);
      setContactError(err.message || String(err));
    } finally {
      setIsSending(false);
    }
  };

  // Render PROJECTS / WORK Timeline View
  if (currentTab === "projects") {
    const experiences = portfolioData.experiences && portfolioData.experiences.length > 0 
      ? portfolioData.experiences 
      : [];

    return (
      <div id="projects-page-container" className="w-full max-w-4xl mx-auto py-12 px-4 flex flex-col gap-8 pb-32">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2 uppercase tracking-wide">
            Projects <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-sans">& Experience</span>
          </h2>
          <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">Selected career highlights and studio productions retrieved from Google Sheets.</p>
        </div>

        <div className="relative border-l-2 border-indigo-500/20 pl-6 md:pl-8 ml-4 flex flex-col gap-8">
          {experiences.map((exp, idx) => (
            <motion.div
              id={`timeline-card-${idx}`}
              key={idx}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.15 }}
              className="relative"
            >
              {/* Timeline bubble node matching the container overlay theme */}
              <div className="absolute -left-[41px] md:-left-[49px] top-1.5 w-6 h-6 rounded-full bg-blue-650 border-4 border-slate-200 shadow-sm flex items-center justify-center pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>

              <GlassCard className="p-6 w-full hoverScale">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-4">
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] font-sans font-bold tracking-widest text-indigo-600 uppercase">{exp.period}</span>
                    <h3 className="text-xl font-extrabold text-slate-800 leading-tight mt-0.5">{exp.role}</h3>
                  </div>
                  <span className="self-start md:self-center px-4 py-1 text-xs font-bold rounded-full bg-blue-50 border border-blue-200 text-blue-600">
                    {exp.company}
                  </span>
                </div>

                <ul className="flex flex-col gap-2.5 text-left">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex gap-2.5 items-start text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                      <ChevronRight size={16} className="text-indigo-600 stroke-[3px] shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Render SKILLS Progress Slider grid
  if (currentTab === "skills") {
    const skillList = portfolioData.skills && portfolioData.skills.length > 0 
      ? portfolioData.skills 
      : [];

    return (
      <div id="skills-page-container" className="w-full max-w-4xl mx-auto py-12 px-4 flex flex-col gap-8 pb-32">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2 uppercase tracking-wide">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-sans">Craft & Skills</span>
          </h2>
          <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">Production software mastery, equipment handling, and communication expertise.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillList.map((skill, idx) => {
            const level = skill.level;
            return (
              <motion.div
                id={`skill-slide-${idx}`}
                key={idx}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.08 }}
              >
                <GlassCard className="p-5 flex flex-col gap-3" hoverScale={true}>
                  <div className="flex justify-between items-start px-1">
                    <div className="flex flex-col gap-1 text-left">
                      <span className="font-bold text-sm sm:text-base text-slate-800 tracking-wide uppercase select-all">{skill.name}</span>
                      {skill.levelName && (
                        <span className="text-[10px] font-extrabold tracking-widest text-indigo-500 uppercase">
                          {skill.levelName}
                        </span>
                      )}
                    </div>
                    <span className="font-sans font-extrabold text-xs bg-indigo-50 border border-indigo-200 text-indigo-600 px-2.5 py-0.5 rounded-full shadow-sm">
                      {level}%
                    </span>
                  </div>

                  {/* Frosted Slider track indicator */}
                  <div className="w-full h-3 rounded-full bg-slate-100/85 border border-slate-200 overflow-hidden relative shadow-inner mt-1">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-650 rounded-full shadow-sm"
                      initial={{ width: 0 }}
                      animate={{ width: `${level}%` }}
                      transition={{ duration: 1.2, delay: 0.1, type: "spring" }}
                    />
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // Render RESUME Printable/Details view
  if (currentTab === "resume") {
    const resumeItem = portfolioData.resume && portfolioData.resume.length > 0 ? portfolioData.resume[0] : null;

    // Helper to resolve links seamlessly (maps local path spreadsheets to active website HTML file)
    const getResolvedLink = (linkStr: string | undefined): string => {
      return resolveResumeUrl(linkStr) || "#";
    };

    const copyToClipboard = (text: string, isPdf: boolean) => {
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        if (isPdf) {
          setCopiedPdf(true);
          setTimeout(() => setCopiedPdf(false), 2000);
        } else {
          setCopiedHtml(true);
          setTimeout(() => setCopiedHtml(false), 2000);
        }
      }).catch(err => {
        console.error("Failed to copy link text: ", err);
      });
    };

    return (
      <div id="resume-page-container" className="w-full max-w-3xl mx-auto py-12 px-4 flex flex-col gap-8 pb-32">
        <div className="text-center flex flex-col items-center gap-2 font-sans">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-1 uppercase tracking-wide">
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-sans">Resume</span>
          </h2>
          <p className="text-sm text-slate-500 font-semibold mb-2">View my structural curriculum vitae.</p>

          <div className="flex flex-wrap gap-2.5 justify-center items-center">
            {resumeItem && (
              <>
                {resumeItem.pdfDriveLink && (
                  <a
                    id="drive-pdf-btn"
                    href={getResolvedLink(resumeItem.pdfDriveLink)}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 border border-rose-300/30 rounded-full text-white text-xs font-bold leading-none uppercase tracking-widest
                      flex items-center gap-2 cursor-pointer shadow-sm transition-all duration-300 hover:scale-105 active:scale-95
                    "
                  >
                    <FileText size={14} />
                    <span>Download PDF</span>
                  </a>
                )}
                {resumeItem.htmlLink && (
                  <a
                    id="html-resume-btn"
                    href={getResolvedLink(resumeItem.htmlLink)}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 border border-indigo-300/30 rounded-full text-white text-xs font-bold leading-none uppercase tracking-widest
                      flex items-center gap-2 cursor-pointer shadow-sm transition-all duration-300 hover:scale-105 active:scale-95
                    "
                  >
                    <ExternalLink size={14} />
                    <span>View Web Portfolio</span>
                  </a>
                )}
              </>
            )}
          </div>
        </div>

        {/* Toggle Viewer Tabs with Micro-animations */}
        <div id="resume-view-tab-bar" className="flex items-center justify-center p-1 bg-slate-100/60 border border-slate-200/50 rounded-2xl max-w-lg mx-auto w-full select-none gap-1 font-sans print:hidden shadow-xs">
          {[
            { id: "compiled", label: "Compiled CV Layout", count: "1" },
            { id: "pdf", label: "Live PDF Player", count: "PDF" },
            { id: "html", label: "Live Web Preview", count: "HTML" }
          ].map((modeItem) => {
            const isSelected = resumeViewerMode === modeItem.id;
            return (
              <button
                key={modeItem.id}
                onClick={() => setResumeViewerMode(modeItem.id as any)}
                className={`
                  flex-1 py-2.5 px-3 rounded-xl text-xs font-bold leading-none uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer
                  ${isSelected 
                    ? "bg-white text-indigo-650 border border-slate-200/50 shadow-sm font-extrabold scale-103" 
                    : "text-slate-600 hover:text-indigo-600 hover:bg-white/40"}
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

        {/* VIEWPORTS: Render based on selected tab mode */}
        <AnimatePresence mode="wait">
          {resumeViewerMode === "compiled" && (
            <motion.div
              key="compiled"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8 w-full"
            >
              {/* CV sheet representation */}
              <div
                id="resume-sheet"
                className="w-full liquid-glass-card rounded-[30px] p-6 sm:p-10 flex flex-col gap-8 select-text text-left"
              >
                {/* Header CV details */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
                  <div className="flex flex-col text-left">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 uppercase">DHIRAJ KUMAR</h1>
                    <span className="text-sm font-bold text-blue-600 tracking-wider uppercase mt-1">Professional Video Editor</span>
                  </div>
                  <div className="flex flex-col text-xs font-sans font-bold text-slate-600 gap-1.5 md:text-right text-left">
                    <span className="flex items-center md:justify-end gap-1.5"><Phone size={13} className="text-indigo-600 stroke-[2.5px]" /> {portfolioData.contact.phone}</span>
                    <span className="flex items-center md:justify-end gap-1.5"><Mail size={13} className="text-indigo-600 stroke-[2.5px]" /> {portfolioData.contact.email}</span>
                    <span className="flex items-center md:justify-end gap-1.5"><MapPin size={13} className="text-indigo-600 stroke-[2.5px]" /> {portfolioData.contact.location}</span>
                  </div>
                </div>

                {/* Section: Profile info */}
                <div className="flex flex-col gap-3 text-left">
                  <h3 className="text-sm font-sans font-bold text-indigo-600 uppercase tracking-widest font-sans">Career Summary</h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-semibold whitespace-pre-wrap">
                    {portfolioData.aboutMe}
                  </p>
                </div>

                {/* Section: Employment */}
                <div className="flex flex-col gap-5 text-left font-sans">
                  <h3 className="text-sm font-sans font-bold text-indigo-600 uppercase tracking-widest border-b border-slate-200 pb-1">Work History</h3>
                  
                  {portfolioData.experiences.map((exp, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5 animate-fade-in text-left">
                      <div className="flex justify-between items-start gap-2 flex-wrap">
                        <h4 className="font-extrabold text-slate-800 text-base sm:text-lg">{exp.role} — <span className="text-blue-600">{exp.company}</span></h4>
                        <span className="text-xs font-bold text-slate-500 font-mono">{exp.period}</span>
                      </div>
                      <ul className="list-disc pl-5 text-sm text-slate-600 font-semibold flex flex-col gap-1 leading-relaxed">
                        {exp.bullets.map((bullet, bidx) => (
                          <li key={bidx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Section: Tools */}
                <div className="flex flex-col gap-3 text-left font-sans">
                  <h3 className="text-sm font-sans font-bold text-indigo-600 uppercase tracking-widest border-b border-slate-200 pb-1">Software & Tools</h3>
                  <div className="flex flex-wrap gap-2 text-left">
                    {portfolioData.skills.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-white/60 border border-white/80 text-xs font-bold rounded-full text-slate-700 shadow-sm">
                        {s.name} ({s.level}%)
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Relocated "Connected Google Sheet: RESUME Segment" panel to the bottom downside */}
              {resumeItem && (
                <div className="w-full bg-white/10 border border-white/30 backdrop-blur-md rounded-[24px] p-5 text-left flex flex-col gap-4 shadow-sm print:hidden">
                  <div className="flex items-center justify-between border-b border-indigo-500/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-[pulse_1.5s_infinite]" />
                      <h4 className="text-xs font-bold font-mono text-indigo-700 tracking-wider uppercase">
                        Connected Google Sheet: RESUME Segment
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold font-mono text-slate-400 uppercase select-none p-1 bg-slate-500/5 rounded animate-pulse">
                      Live Sync Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* PDF Drive Link Card */}
                    <div className="bg-white/45 border border-white/60 p-4 rounded-2xl flex flex-col justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider font-sans">
                            CV PDF File Link
                          </span>
                          <button
                            onClick={() => copyToClipboard(resumeItem.pdfDriveLink || "", true)}
                            className="p-1 text-slate-450 hover:text-indigo-650 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-1 text-[9px] font-bold font-mono"
                            title="Copy raw link to clipboard"
                          >
                            {copiedPdf ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                            <span>{copiedPdf ? "Copied!" : "Copy Raw"}</span>
                          </button>
                        </div>
                        <p className="text-xs font-bold text-slate-800 break-all select-all font-mono bg-white/30 p-2 rounded-xl border border-white/40 mt-1">
                          {resumeItem.pdfDriveLink || "No physical link uploaded yet."}
                        </p>
                        {resumeItem.pdfDriveLink && !resumeItem.pdfDriveLink.startsWith("http") && (
                          <span className="text-[9px] font-bold text-slate-450 italic mt-1 font-sans">
                            Relative filename resolved directly from live deployment directory.
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => setResumeViewerMode("pdf")}
                        className="w-full mt-2 py-2 text-center bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs font-sans"
                      >
                        <FileText size={13} className="text-red-500 font-sans" />
                        <span>Preview Live PDF Player</span>
                      </button>
                    </div>

                    {/* HTML Link Card */}
                    <div className="bg-white/45 border border-white/60 p-4 rounded-2xl flex flex-col justify-between gap-3">
                      <div className="flex flex-col gap-1 font-sans">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider font-sans">
                            CV HTML Link
                          </span>
                          <button
                            onClick={() => copyToClipboard(resumeItem.htmlLink || "", false)}
                            className="p-1 text-slate-450 hover:text-indigo-650 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-1 text-[9px] font-bold font-mono"
                            title="Copy raw link to clipboard font-sans"
                          >
                            {copiedHtml ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                            <span>{copiedHtml ? "Copied!" : "Copy Raw"}</span>
                          </button>
                        </div>
                        <p className="text-xs font-bold text-slate-800 break-all select-all font-mono bg-white/30 p-2 rounded-xl border border-white/40 mt-1">
                          {resumeItem.htmlLink || "No custom HTML link uploaded yet."}
                        </p>
                        {resumeItem.htmlLink && (resumeItem.htmlLink.startsWith("file://") || resumeItem.htmlLink.includes("Users/")) && (
                          <span className="text-[9px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded w-max mt-1.5 select-none font-sans">
                            💡 Spliced dynamically to active HTML viewer file!
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => setResumeViewerMode("html")}
                        className="w-full mt-2 py-2 text-center bg-indigo-600 hover:bg-indigo-700 border border-indigo-500 text-white rounded-xl text-xs font-bold transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs font-sans"
                      >
                        <ExternalLink size={13} />
                        <span>Preview Live Web Stream</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {resumeViewerMode === "pdf" && (
            <motion.div
              key="pdf"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col gap-3"
            >
              <div className="w-full h-[680px] bg-[#120b1e]/90 border border-white/10 rounded-[28px] overflow-hidden relative shadow-2xl p-4 flex flex-col backdrop-blur-3xl">
                {/* Embedded Frame Header bar */}
                <div className="flex justify-between items-center pb-3 px-2 border-b border-white/10 mb-3 select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                      Interactive PDF Document Player
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={getResolvedLink(resumeItem?.pdfDriveLink)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-sans font-bold text-indigo-300 hover:text-indigo-400 flex items-center gap-1 transition-colors"
                    >
                      <span>Open in New Tab</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>

                <div className="flex-grow w-full relative rounded-2xl overflow-hidden bg-[#151025] border border-white/5 shadow-inner">
                  {resumeItem?.pdfDriveLink ? (
                    <iframe
                      src={getResolvedLink(resumeItem.pdfDriveLink)}
                      className="w-full h-full absolute inset-0 border-none bg-slate-900"
                      title="Resume PDF Stream View"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center text-slate-400 font-sans">
                      <FileText size={40} className="text-slate-600 stroke-[1.5px]" />
                      <span className="font-extrabold text-sm text-slate-350">No PDF Drive Link Uploaded</span>
                      <p className="text-xs text-slate-505 max-w-xs">Upload your professional resume inside the RESUME tab of your Google Sheet to play the live document stream.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {resumeViewerMode === "html" && (
            <motion.div
              key="html"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col gap-3"
            >
              <div className="w-full h-[680px] bg-[#120b1e]/90 border border-white/10 rounded-[28px] overflow-hidden relative shadow-2xl p-4 flex flex-col backdrop-blur-3xl">
                {/* Embedded Frame Header bar */}
                <div className="flex justify-between items-center pb-3 px-2 border-b border-white/10 mb-3 select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                      Interactive Web Portfolio Streamer
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={getResolvedLink(resumeItem?.htmlLink)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-sans font-bold text-indigo-300 hover:text-indigo-400 flex items-center gap-1 transition-colors"
                    >
                      <span>Open in New Tab</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>

                <div className="flex-grow w-full relative rounded-2xl overflow-hidden bg-white border border-white/5 shadow-inner">
                  {resumeItem?.htmlLink ? (
                    <iframe
                      src={getResolvedLink(resumeItem.htmlLink)}
                      className="w-full h-full absolute inset-0 border-none"
                      title="Resume HTML Web Frame View"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center gap-2 p-6 text-center text-slate-400 font-sans">
                      <ExternalLink size={40} className="text-slate-600 stroke-[1.5px]" />
                      <span className="font-extrabold text-sm text-slate-350">No HTML Link Uploaded</span>
                      <p className="text-xs text-slate-500 max-w-xs">Provide a custom HTML web resume inside the RESUME tab of your Google Sheet to trigger this player stream.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Render GET IN TOUCH / CONTACT form View
  if (currentTab === "contact") {
    const formattedTime = new Date().toLocaleString();
    const formattedDate = new Date().toLocaleDateString();
    return (
      <div id="contact-page-container" className="w-full max-w-4xl mx-auto py-12 px-4 flex flex-col gap-8 pb-32">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2 uppercase tracking-wide">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-sans">Touch</span>
          </h2>
          <p className="text-sm text-slate-500 font-semibold max-w-md mx-auto">Have a project or studio opening? Send a message directly to my inbox.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Info Panels column */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <GlassCard className="p-6 flex flex-col gap-6 text-left" hoverScale={false}>
              <h3 className="font-extrabold text-xl text-slate-800">Contact Details</h3>
              
              <div className="flex flex-col gap-4.5">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 bubble-gloss shadow-sm">
                    <Phone size={18} className="stroke-[2.5px]" />
                  </div>
                  <div className="flex flex-col text-xs sm:text-sm text-left">
                    <span className="font-bold text-slate-400 font-sans tracking-widest uppercase text-[10px]">Phone</span>
                    <span className="font-extrabold text-slate-850 select-all leading-tight">{portfolioData.contact.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 bubble-gloss shadow-sm">
                    <Mail size={18} className="stroke-[2.5px]" />
                  </div>
                  <div className="flex flex-col text-xs sm:text-sm text-left">
                    <span className="font-bold text-slate-400 font-sans tracking-widest uppercase text-[10px]">Email</span>
                    <span className="font-extrabold text-slate-850 select-all leading-tight">{portfolioData.contact.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 bubble-gloss shadow-sm">
                    <MapPin size={18} className="stroke-[2.5px]" />
                  </div>
                  <div className="flex flex-col text-xs sm:text-sm text-left">
                    <span className="font-bold text-slate-400 font-sans tracking-widest uppercase text-[10px]">Location</span>
                    <span className="font-extrabold text-slate-850 select-all leading-tight">{portfolioData.contact.location}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Social links fetched in real-time from sheet */}
              {portfolioData.socialLinks && portfolioData.socialLinks.length > 0 && (
                <div className="pt-4 border-t border-slate-200 flex flex-col gap-2 text-left font-sans">
                  <span className="text-[10px] font-sans font-bold text-slate-400 tracking-widest uppercase mb-1">Social Profiles</span>
                  <div className="flex flex-wrap gap-2 text-left">
                    {portfolioData.socialLinks.map((social, idx) => (
                      <a
                        key={idx}
                        href={social.directUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="
                          px-4.5 py-1.5 bg-white/60 hover:bg-white/95 text-slate-800 text-xs font-bold leading-none rounded-xl border border-white/85
                          flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-97
                        "
                      >
                        <ExternalLink size={12} className="text-indigo-600 shrink-0" />
                        <span>{social.platform}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Status indicator pill */}
              <div className="pt-4 border-t border-slate-200 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-600">Available for Freelance & Full-time</span>
              </div>
            </GlassCard>
          </div>

          {/* Contact Input Form column */}
          <div className="md:col-span-7">
            <GlassCard className="p-6" hoverScale={false}>
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-4 text-left">
                <h3 className="font-extrabold text-xl text-slate-800 mb-1">Direct Message</h3>

                {contactError && (
                  <div className="px-3.5 py-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-200 text-xs font-bold tracking-wider uppercase">
                    {contactError}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Your Name</label>
                  <input
                    id="contact-name-input"
                    type="text"
                    required
                    disabled={isSending}
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Dhiraj Kumar"
                    className="
                      w-full px-4 py-2.5 bg-white/60 rounded-xl border border-white/80 text-sm font-semibold text-slate-800
                      placeholder-slate-400/80 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-md transition-all duration-300 shadow-inner
                      disabled:opacity-50
                    "
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Your Email</label>
                  <input
                    id="contact-email-input"
                    type="email"
                    required
                    disabled={isSending}
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="you@domain.com"
                    className="
                      w-full px-4 py-2.5 bg-white/60 rounded-xl border border-white/80 text-sm font-semibold text-slate-800
                      placeholder-slate-400/80 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-md transition-all duration-300 shadow-inner
                      disabled:opacity-50
                    "
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Message</label>
                  <textarea
                    id="contact-msg-textarea"
                    rows={4}
                    required
                    disabled={isSending}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Describe your editing project or opportunity..."
                    className="
                      w-full px-4 py-2.5 bg-white/60 rounded-xl border border-white/80 text-sm font-semibold text-slate-800
                      placeholder-slate-400/80 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-md transition-all duration-300 resize-none shadow-inner
                      disabled:opacity-50
                    "
                  />
                </div>

                <button
                  id="submit-contact-form"
                  type="submit"
                  disabled={isSending}
                  className="
                    mt-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest
                    shadow-md hover:scale-101 active:scale-99 transition-all duration-300 cursor-pointer text-center border border-white/20 hover:shadow-lg
                    disabled:opacity-75 flex items-center justify-center gap-2
                  "
                >
                  {isSending && <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0 font-sans" />}
                  <span>{isSending ? "Sending Message..." : "Send Message"}</span>
                </button>
              </form>
            </GlassCard>
          </div>

        </div>



        {/* Global floating success alert bubble */}
        <AnimatePresence>
          {formSubmitted && (
            <motion.div
              id="success-toast-alert"
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.95 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
            >
              <div className="flex items-center gap-3.5 px-6 py-4.5 bg-white/95 backdrop-blur-2xl border border-emerald-500/30 rounded-2xl glass-shadow shadow-xl text-left font-sans">
                <CheckCircle size={28} className="text-emerald-500 stroke-[2.5px] animate-bounce shrink-0" />
                <div className="flex flex-col text-left">
                  <h4 className="font-bold text-sm tracking-wide uppercase text-indigo-600 leading-none">Message Sent!</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-semibold">Thank you for your dispatch. Message saved securely on your portfolio!</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    );
  }

  return null;
}
