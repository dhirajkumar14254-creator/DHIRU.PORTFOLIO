import React from "react";
import { motion } from "motion/react";

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
  const hoverProps = hoverScale
    ? {
        whileHover: { y: -8, scale: 1.02, boxShadow: "0 20px 40px 0 rgba(139, 92, 246, 0.25)" },
        whileTap: { scale: 0.98 },
      }
    : {};

  return (
    <motion.div
      id={id}
      onClick={onClick}
      {...hoverProps}
      {...props}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        relative overflow-hidden rounded-[30px] 
        liquid-glass-card
        transition-all duration-300
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
