import React from "react";
import { motion } from "framer-motion";

// Base container animation
const containerVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96],
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
  out: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(10px)",
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96],
      when: "afterChildren",
      staggerChildren: 0.06,
      staggerDirection: -1,
    },
  },
};

// Header animation variant
const headerVariants = {
  initial: { opacity: 0, y: -30 },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 200,
      delay: 0.15,
    },
  },
  out: {
    opacity: 0,
    y: -30,
    scale: 0.9,
    filter: "blur(5px)",
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// Left side element variant (score display)
const leftElementVariants = {
  initial: { opacity: 0, x: -50 },
  in: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      delay: 0.2,
    },
  },
  out: {
    opacity: 0,
    x: -50,
    filter: "blur(3px)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Main content items variant
const itemVariants = {
  initial: { opacity: 0, y: 20 },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      delay: 0.25,
    },
  },
  out: {
    opacity: 0,
    y: -30,
    scale: 0.95,
    filter: "blur(4px)",
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

// Song card variants
const songCardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  out: {
    opacity: 0,
    y: -25,
    scale: 0.95,
    filter: "blur(6px)",
    rotateX: 5,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

// Dot variants for progress indicators
const dotVariants = {
  initial: { scale: 0, opacity: 0 },
  in: (custom) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.2 + custom * 0.08,
      type: "spring",
      stiffness: 400,
      damping: 15,
    },
  }),
  out: {
    scale: 0,
    opacity: 0,
    y: -10,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

// Result message variants
const resultMessageVariants = {
  initial: { opacity: 0, scale: 0.8, y: 10 },
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: 0.6,
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  },
  out: {
    opacity: 0,
    scale: 0.85,
    y: -20,
    filter: "blur(8px)",
    transition: {
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

// Button variants
const buttonVariants = {
  initial: { opacity: 0, y: 30, scale: 0.9 },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      delay: 0.5,
    },
  },
  out: {
    opacity: 0,
    y: 30,
    scale: 0.9,
    filter: "blur(3px)",
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
};

// Recursive function to add variants to children based on element type
const addVariantsToChildren = (children) => {
  return React.Children.map(children, (child) => {
    // Skip non-React elements or strings
    if (!React.isValidElement(child)) {
      return child;
    }

    let variantToUse = null;
    let customProp = null;

    // Determine which variant to use based on className or component type
    const className = child.props.className || "";

    // Match element by className or props
    if (className.includes("top-4") || className.includes("header")) {
      variantToUse = headerVariants;
    } else if (className.includes("left-8") || className.includes("score")) {
      variantToUse = leftElementVariants;
    } else if (
      child.props.onClick &&
      child.props.className &&
      child.props.className.includes("bg-yellow-400")
    ) {
      variantToUse = buttonVariants;
    } else if (
      child.key &&
      /\d+/.test(child.key) &&
      className.includes("rounded-full")
    ) {
      variantToUse = dotVariants;
      customProp = parseInt(child.key, 10);
    } else if (
      className.includes("song-card") ||
      child.props.whileHover === "hover"
    ) {
      variantToUse = songCardVariants;
    } else if (
      className.includes("font-extrabold") &&
      (className.includes("text-green-400") ||
        className.includes("text-red-400"))
    ) {
      variantToUse = resultMessageVariants;
    } else {
      variantToUse = itemVariants;
    }

    // If the element already has variants prop, respect it
    if (child.props.variants) {
      variantToUse = child.props.variants;
    }

    // Add variants to child and process its children recursively
    return React.cloneElement(child, {
      variants: variantToUse,
      custom: customProp,
      ...(child.props.children
        ? { children: addVariantsToChildren(child.props.children) }
        : {}),
    });
  });
};

function SolutionPageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={containerVariants}
      className="w-full h-full"
    >
      {addVariantsToChildren(children)}
    </motion.div>
  );
}

export default SolutionPageTransition;
