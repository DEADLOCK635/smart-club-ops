"use client";

import { motion } from "framer-motion";

// Re-mounted on every navigation → buttery page transition for every route.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
