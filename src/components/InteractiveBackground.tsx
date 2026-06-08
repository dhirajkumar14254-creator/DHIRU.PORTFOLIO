import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface InteractiveBackgroundProps {
  lowPowerMode: boolean;
}

const InteractiveBackground = React.memo(function InteractiveBackground({ lowPowerMode }: InteractiveBackgroundProps) {
  const [bgMouse, setBgMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent || "");

    if (lowPowerMode || isMobile) {
      setBgMouse({ x: 0, y: 0 });
      return;
    }

    let frameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let lastUpdateTime = 0;

    const handleBgMouseMove = (e: MouseEvent) => {
      // Calculate relative ratio [-1, 1] relative to center of screen
      targetX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2 || 1) * 45;
      targetY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2 || 1) * 45;
    };

    // Smooth LERP frame ticker for ultra fluid, natural 120 FPS motion
    const updatePosition = (timestamp: number) => {
      // Lerp coefficient 0.08 for premium high responsiveness and inertia transitions
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      
      // Throttle React state setting to max 30 times per second (~33ms) to avoid over-rendering while remaining buttery smooth
      if (timestamp - lastUpdateTime >= 33) {
        setBgMouse({ x: currentX, y: currentY });
        lastUpdateTime = timestamp;
      }
      frameId = requestAnimationFrame(updatePosition);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameId);
      } else {
        cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(updatePosition);
      }
    };

    window.addEventListener("mousemove", handleBgMouseMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange, { passive: true });
    frameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove", handleBgMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(frameId);
    };
  }, [lowPowerMode]);

  return (
    <>
      <div className="liquid-glass-bg pointer-events-none select-none z-0">
        {/* Layer 1: Large primary physical crystal spheres reacting dynamically with parallax multipliers */}
        <motion.div 
          animate={{ x: bgMouse.x * 0.4, y: bgMouse.y * 0.4 }}
          transition={{ type: "tween", ease: "linear", duration: 0 }}
          className="liquid-blob background-blob liquid-blob-cyan left-[4vw] top-[8vh] w-[30vw] h-[30vw] max-w-[320px] max-h-[320px] will-change-transform" 
        />
        <motion.div 
          animate={{ x: bgMouse.x * -0.5, y: bgMouse.y * -0.5 }}
          transition={{ type: "tween", ease: "linear", duration: 0 }}
          className="liquid-blob background-blob liquid-blob-purple right-[6vw] top-[6vh] w-[35vw] h-[35vw] max-w-[360px] max-h-[360px] will-change-transform" 
        />

        {!lowPowerMode && (
          <>
            <motion.div 
              animate={{ x: bgMouse.x * 0.3, y: bgMouse.y * 0.6 }}
              transition={{ type: "tween", ease: "linear", duration: 0 }}
              className="liquid-blob background-blob liquid-blob-pink left-[8vw] bottom-[12vh] w-[32vw] h-[32vw] max-w-[320px] max-h-[320px] will-change-transform" 
            />
            <motion.div 
              animate={{ x: bgMouse.x * -0.4, y: bgMouse.y * 0.4 }}
              transition={{ type: "tween", ease: "linear", duration: 0 }}
              className="liquid-blob background-blob liquid-blob-indigo right-[12vw] bottom-[14vh] w-[28vw] h-[28vw] max-w-[280px] max-h-[280px] will-change-transform" 
            />

            {/* Layer 2: Smaller secondary crystal droplets drifting at offsets to create absolute parallax depth */}
            <motion.div 
              animate={{ x: bgMouse.x * -0.9, y: bgMouse.y * 0.9 }}
              transition={{ type: "tween", ease: "linear", duration: 0 }}
              className="liquid-blob background-blob liquid-blob-purple left-[35vw] top-[25vh] w-[15vw] h-[15vw] max-w-[150px] max-h-[150px] opacity-80 will-change-transform" 
              style={{ animationDelay: "-5s", filter: "blur(4px)" }} 
            />
            <motion.div 
              animate={{ x: bgMouse.x * 0.8, y: bgMouse.y * -0.7 }}
              transition={{ type: "tween", ease: "linear", duration: 0 }}
              className="liquid-blob background-blob liquid-blob-cyan right-[28vw] top-[50vh] w-[18vw] h-[18vw] max-w-[180px] max-h-[180px] opacity-85 will-change-transform" 
              style={{ animationDelay: "-12s", filter: "blur(3px)" }} 
            />
            <motion.div 
              animate={{ x: bgMouse.x * -0.7, y: bgMouse.y * -0.8 }}
              transition={{ type: "tween", ease: "linear", duration: 0 }}
              className="liquid-blob background-blob liquid-blob-pink left-[50vw] bottom-[18vh] w-[16vw] h-[16vw] max-w-[160px] max-h-[160px] opacity-75 will-change-transform" 
              style={{ animationDelay: "-8s", filter: "blur(5px)" }} 
            />
            <motion.div 
              animate={{ x: bgMouse.x * 1.1, y: bgMouse.y * 1.1 }}
              transition={{ type: "tween", ease: "linear", duration: 0 }}
              className="liquid-blob background-blob liquid-blob-indigo left-[18vw] top-[65vh] w-[14vw] h-[14vw] max-w-[140px] max-h-[140px] opacity-90 will-change-transform" 
              style={{ animationDelay: "-18s", filter: "blur(2px)" }} 
            />
          </>
        )}
      </div>

      {/* Animated Atmospheric Background Blurs (Pastel & Soft for immersive light balance) */}
      <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-purple-200/20 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[65vw] h-[65vw] rounded-full bg-blue-200/20 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-[10%] w-[45vw] h-[45vw] rounded-full bg-pink-200/25 blur-[120px] pointer-events-none -z-10" />
    </>
  );
});

export default InteractiveBackground;
