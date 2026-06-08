import React, { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverScale?: boolean;
  onClick?: () => void;
  id?: string;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  key?: React.Key;
}

export default function GlassCard({
  children,
  className = "",
  hoverScale = true,
  onClick,
  id,
  ...props
}: GlassCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const hoverProps = useMemo(() => {
    if (!hoverScale || shouldReduceMotion) return {};
    return {
      whileHover: { y: -6, scale: 1.015 },
      whileTap: { scale: 0.985 },
    };
  }, [hoverScale, shouldReduceMotion]);

  return (
    <motion.div
      id={id}
      onClick={onClick}
      {...hoverProps}
      {...props}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      style={{ willChange: "transform" }}
      className={`
        relative overflow-hidden rounded-[30px] 
        liquid-glass-card
        transition-colors duration-300
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {/* Real 3D Physical Glare Highlights for High-End Glassmorphism */}
      <div className="absolute top-0 inset-x-0 h-[40%] bg-gradient-to-b from-white/30 to-white/0 pointer-events-none rounded-t-[30px]" />
      <div className="absolute bottom-0 inset-x-0 h-[30%] bg-gradient-to-t from-white/10 to-transparent pointer-events-none rounded-b-[30px]" />
      {/* Light side rim reflection line */}
      <div className="absolute inset-[1.5px] rounded-[28px] border border-white/40 pointer-events-none -z-10" />
      {children}
    </motion.div>
  );
}
