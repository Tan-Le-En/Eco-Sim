/**
 * ECO//SIM — Reveal wrapper
 * One-time entrance animation when the element scrolls into view.
 * Uses IntersectionObserver with a margin offset for scroll-triggered reveal.
 * Designed to replace framer-motion's whileInView for simple cases where we
 * want the element to remain interactive after reveal (no animation re-trigger).
 */
import { motion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms
  once?: boolean;
}

export default function Reveal({ children, className, delay = 0, once = true }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ delay: delay / 1000, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
