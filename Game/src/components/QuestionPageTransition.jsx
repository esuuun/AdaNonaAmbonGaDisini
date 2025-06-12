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
      staggerChildren: 0.07,
    },
  },
  out: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(8px)",
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96],
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

// Timer animation variant
const timerVariants = {
  initial: { opacity: 0, y: -20, scale: 0.9 },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
      delay: 0.1,
    },
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.8,
    filter: "blur(5px)",
    transition: { duration: 0.4, ease: "easeOut" },
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
    y: -20,
    transition: { duration: 0.2 },
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
    x: -30,
    transition: { duration: 0.2 },
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
    y: -20,
    transition: { duration: 0.2 },
  },
};

// Option buttons variants with custom delay based on index
const optionButtonVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  in: (custom) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
      delay: 0.3 + custom * 0.1,
    },
  }),
  out: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

// Continue button variant
const continueButtonVariants = {
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
    y: 20,
    transition: { duration: 0.2 },
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
    if (className.includes("timer") || className.includes("top-32")) {
      variantToUse = timerVariants;
    } else if (className.includes("header") || className.includes("top-4")) {
      variantToUse = headerVariants;
    } else if (className.includes("left-8") || className.includes("score")) {
      variantToUse = leftElementVariants;
    } else if (
      child.props.onClick &&
      child.props.className &&
      child.props.className.includes("bg-yellow-400")
    ) {
      variantToUse = continueButtonVariants;
    } else if (
      child.key &&
      /\d+/.test(child.key) &&
      className.includes("button")
    ) {
      variantToUse = optionButtonVariants;
      customProp = parseInt(child.key, 10);
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

function QuestionPageTransition({ children }) {
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

export default QuestionPageTransition;
