import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Cpu, Sparkles, Orbit, Radio, Command } from "lucide-react";

export default function CrazyLoadingIndicator() {
  const [activeSegment, setActiveSegment] = useState(0);
  const [displayText, setDisplayText] = useState("Synchronizing Quantum Matrices");

  const bootLogs = [
    "Initializing Cosmic Hyper-Drives...",
    "Re-routing Gravity Fields around Orbiters...",
    "Decoupling Tachyon Energy Waveguides...",
    "Calibrating Inter-Planetary Solar Sails...",
    "Retrieving Live Astrological Schematics...",
    "Synthesizing Nebula Particle Accretion...",
    "Securing Sub-Space Telemetry Arrays...",
    "Igniting Quantum Dark Matter Reactor..."
  ];

  useEffect(() => {
    // Cycle text logs every 900ms for that high-frequency sensory feel
    const textInterval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * bootLogs.length);
      setDisplayText(bootLogs[randomIdx]);
    }, 900);

    // Active segment ticker
    const segmentInterval = setInterval(() => {
      setActiveSegment((prev) => (prev + 1) % 12);
    }, 150);

    return () => {
      clearInterval(textInterval);
      clearInterval(segmentInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[550px] px-6 select-none relative overflow-hidden">
      {/* Absolute Ambient Background Lights for cosmic look */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-rose-500/10 blur-[60px] pointer-events-none animate-pulse" />

      {/* CRAZY MULTI-RING ATOMIC COLLIDER GENERATOR */}
      <div className="relative w-48 h-48 flex items-center justify-center scale-90 sm:scale-100">
        
        {/* Layer 1: Outermost Celestial Orbit (Slow Reverse Spin) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-purple-500/20 flex items-center justify-center"
        >
          {/* External satellite particle node */}
          <div className="absolute -top-1.5 w-3 h-3 bg-indigo-400 rounded-full shadow-[0_0_12px_rgba(129,140,248,0.8)] border border-white/40" />
          <div className="absolute -bottom-1 w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_8px_rgba(192,132,252,0.8)] border border-white/20" />
        </motion.div>

        {/* Layer 2: Speed Star Tracker (Fast Spin) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 rounded-full border-2 border-transparent border-t-pink-500/40 border-b-cyan-500/40"
        >
          {/* Sparkly crossing star */}
          <Sparkles className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 text-pink-400 animate-bounce" />
        </motion.div>

        {/* Layer 3: Cybernetic Circular Telemetry Segment Ring */}
        <div className="absolute inset-8 rounded-full border border-indigo-500/10 flex items-center justify-center">
          <div className="w-full h-full relative flex items-center justify-center">
            {[...Array(12)].map((_, i) => {
              const isActive = activeSegment === i;
              const rotation = i * (360 / 12);
              return (
                <div
                  key={i}
                  className="absolute w-1 h-3 rounded-full transition-all duration-150"
                  style={{
                    transform: `rotate(${rotation}deg) translateY(-24px)`,
                    backgroundColor: isActive 
                      ? "#f43f5e" // Rose glow
                      : i % 3 === 0 
                      ? "rgba(99, 102, 241, 0.45)" // Indigo
                      : "rgba(255, 255, 255, 0.12)",
                    boxShadow: isActive ? "0 0 10px #f43f5e, 0 0 20px #f43f5e" : "none",
                    height: isActive ? "16px" : "12px",
                    width: isActive ? "3px" : "2px"
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Layer 4: Interactive Inner Gyroscope rings */}
        <motion.div
          animate={{ rotateX: [15, -15, 15], rotateY: [30, -30, 30], rotateZ: [0, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-12 rounded-full border border-emerald-500/25 flex items-center justify-center transform style-3d"
        >
          <div className="w-full h-full rounded-full border-t border-b border-rose-500/30 opacity-70" />
        </motion.div>

        {/* Layer 5: Nucleus Core Glow Sphere */}
        <div className="absolute w-16 h-16 rounded-full bg-slate-950/80 border border-white/10 flex items-center justify-center p-1.5 shadow-2xl overflow-hidden group">
          {/* Pulsing inner gradient plasma */}
          <motion.div
            animate={{
              scale: [0.95, 1.12, 0.95],
              background: [
                "radial-gradient(circle, rgba(168,85,247,0.7) 0%, rgba(99,102,241,0.2) 100%)",
                "radial-gradient(circle, rgba(244,63,94,0.7) 0%, rgba(168,85,247,0.2) 100%)",
                "radial-gradient(circle, rgba(6,182,212,0.7) 0%, rgba(99,102,241,0.2) 100%)",
                "radial-gradient(circle, rgba(168,85,247,0.7) 0%, rgba(99,102,241,0.2) 100%)"
              ]
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-1 rounded-full flex items-center justify-center"
          >
            {/* Spinning core reactor icon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
              className="relative text-white z-10"
            >
              <Cpu className="w-6 h-6 text-indigo-100 select-none drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            </motion.div>
          </motion.div>
        </div>

        {/* Orbiting Satellite Dots forming cross patterns */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-3 w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
          <div className="absolute top-1/2 right-3 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping delay-300" />
        </div>
      </div>

      {/* TEXT LOADING RIG */}
      <div className="mt-8 flex flex-col items-center justify-center gap-2.5 max-w-sm text-center">
        {/* Animated Cyber Title */}
        <div className="flex items-center gap-2.5">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 text-rose-500"
          >
            <Command className="w-4 h-4" />
          </motion.div>
          <span className="text-xs font-mono font-black uppercase text-slate-300 tracking-[0.25em] flex items-center gap-1">
            CREATOR SYSTEM
            <span className="text-rose-500 animate-pulse font-sans">○</span>
            <span className="text-emerald-500 animate-ping font-sans">●</span>
          </span>
        </div>

        {/* Randomly changing real-time quantum boot status logs */}
        <div className="h-6 flex items-center justify-center">
          <motion.p
            key={displayText}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.2 }}
            className="text-[11px] font-mono font-medium text-purple-400/90 tracking-wide glow-purple"
          >
            {displayText}
          </motion.p>
        </div>

        {/* Cyber Progress Indicator block */}
        <div className="w-56 h-1 rounded-full bg-white/5 border border-white/5 overflow-hidden relative">
          <motion.div
            initial={{ left: "-40%" }}
            animate={{ left: "110%" }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-rose-500 to-indigo-500 rounded-full"
          />
        </div>

        <span className="text-[9px] font-mono text-slate-500 font-extrabold tracking-widest uppercase">
          STABLE NEUTRON CORRELATOR v4.0.8
        </span>
      </div>
    </div>
  );
}
