import React from "react";
import { motion } from "framer-motion";

// Page transition animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96], // Custom easing for smooth movement
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  out: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: {
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96], // Custom easing
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

// Additional animation for page content
const contentVariants = {
  initial: { opacity: 0, y: 10 },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  out: {
    opacity: 0,
    y: -10,
    transition: {
      type: "tween",
      ease: "easeInOut",
      duration: 0.3,
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

// For each child element that needs to animate
const childVariants = {
  initial: { opacity: 0, y: 20 },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  out: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

function PageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="w-full h-full"
    >
      <motion.div variants={contentVariants} className="w-full h-full">
        {children}
      </motion.div>
    </motion.div>
  );
}

// Export the childVariants so other components can use them
export { childVariants };

export default PageTransition;
