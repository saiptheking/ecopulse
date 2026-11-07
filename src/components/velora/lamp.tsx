"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "../../client/lib/utils";

interface LampProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A glowing lamp-line header. The light cone expands as it scrolls
 * into view; children render beneath the glow.
 */
export function Lamp({ children, className }: LampProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      data-slot="lamp"
      className={cn(
        "relative z-0 flex w-full flex-col items-center justify-center overflow-hidden py-24",
        className
      )}
    >
      <div className="relative isolate z-0 flex w-full flex-1 items-center justify-center">
        {/* Light cones */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0.4, width: "12rem" }}
          whileInView={{ opacity: 0.9, width: "28rem" }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0 : 0.8, ease: "easeInOut" }}
          className="absolute right-1/2 h-44 [background-image:conic-gradient(from_70deg_at_center_top,var(--brand),transparent,transparent)]"
          style={{ opacity: 0.5 }}
        />
        <motion.div
          aria-hidden
          initial={{ opacity: 0.4, width: "12rem" }}
          whileInView={{ opacity: 0.9, width: "28rem" }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0 : 0.8, ease: "easeInOut" }}
          className="absolute left-1/2 h-44 [background-image:conic-gradient(from_290deg_at_center_top,transparent,transparent,var(--brand))]"
          style={{ opacity: 0.5 }}
        />
        {/* Glow blob */}
        <div
          aria-hidden
          className="absolute top-10 z-0 h-36 w-[28rem] -translate-y-1/2 rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--brand)" }}
        />
        {/* Lamp line */}
        <motion.div
          aria-hidden
          initial={{ width: "8rem" }}
          whileInView={{ width: "20rem" }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0 : 0.8, ease: "easeInOut" }}
          className="absolute z-30 h-0.5 -translate-y-[4.5rem] rounded-full"
          style={{
            background: "var(--brand)",
            boxShadow: "0 0 24px 4px color-mix(in oklab, var(--brand) 60%, transparent)",
          }}
        />
        {/* Mask above the line */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 z-20 h-[calc(50%-4.5rem)] bg-background"
        />
      </div>
      <div className="relative z-40 -mt-16 flex flex-col items-center px-5 text-center">
        {children}
      </div>
    </div>
  );
}
