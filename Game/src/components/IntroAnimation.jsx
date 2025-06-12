import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

const IntroAnimation = ({ onAnimationComplete }) => {
  const [showAnimation, setShowAnimation] = useState(true);
  useEffect(() => {
    // Prevent scrolling during animation
    document.body.style.overflow = "hidden";

    // Stage 1: Display logo for 2 seconds
    const logoDisplayTimer = setTimeout(() => {
      // Stage 2: Start logo exit animation
      setShowAnimation(false);

      // Wait for the exit animation to complete before transitioning
      const exitAnimationTimer = setTimeout(() => {
        // Final stage: Complete the animation and transition to next page
        onAnimationComplete();
      }, 1000); // Give time for exit animation to be visible

      return () => clearTimeout(exitAnimationTimer);
    }, 2000); // Time before logo starts exiting

    return () => {
      document.body.style.overflow = "auto";
      clearTimeout(logoDisplayTimer);
    };
  }, [onAnimationComplete]);

  return (
    <AnimatePresence mode="wait">
      {showAnimation && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.2,
            filter: "blur(8px)",
          }}
          transition={{
            duration: 1.0, // Increased back to 1.0 for more visible exit
            ease: [0.43, 0.13, 0.23, 0.96], // Custom easing for smoother exit
          }}
        >
          {/* Background music note particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `rgba(${Math.random() * 255}, ${
                    Math.random() * 255
                  }, ${Math.random() * 255}, 0.3)`,
                  width: `${Math.random() * 40 + 10}px`,
                  height: `${Math.random() * 40 + 10}px`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.7, 0],
                  x: [0, Math.random() * 200 - 100],
                  y: [0, Math.random() * 200 - 100],
                }}
                transition={{
                  duration: 1.5, // Reduced from 3
                  delay: Math.random() * 0.5, // Reduced from 2
                  repeat: 1, // Limited repeats
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Logo animation container */}
          <motion.div
            className="relative"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{
              scale: 0,
              rotate: 180,
              opacity: 0,
              filter: "blur(5px)",
            }}
            transition={{
              type: "spring",
              stiffness: 100, // Increased for faster animation
              damping: 12,
              delay: 0.2, // Reduced from 0.5
              exit: {
                type: "spring",
                stiffness: 80,
                damping: 10,
                duration: 1.0, // Increased back to 1.0 for more visible exit
                ease: [0.19, 1, 0.22, 1], // Custom easing for very smooth exit
              },
            }}
          >
            <motion.div
              className="relative"
              animate={{
                y: [0, -10, 0],
              }}
              exit={{
                y: [0, -10, 0],
                opacity: [1, 0.5, 0],
                transition: {
                  duration: 1.0,
                  ease: "easeInOut",
                  times: [0, 0.5, 1],
                },
              }}
              transition={{
                duration: 1, // Reduced from 2
                repeat: 2, // Adjusted for 3 seconds total
                repeatType: "loop",
              }}
            >
              <motion.img
                src={logo}
                alt="Logo"
                className="w-80 h-80 object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0,
                  rotate: -180,
                  filter: ["blur(0px)", "blur(3px)", "blur(8px)"],
                }}
                transition={{
                  duration: 0.3,
                  delay: 0.2, // Reduced from 0.3 for faster start
                  exit: {
                    duration: 1.0, // Increased back to 1.0 for more visible exit
                    ease: "easeInOut",
                  },
                }}
              />
            </motion.div>
          </motion.div>

          {/* Text animation */}
          <motion.div
            className="absolute bottom-52"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: [1, 0.7, 0],
              y: [0, 10, 30],
              scale: [1, 0.95, 0.9],
              filter: ["blur(0px)", "blur(2px)", "blur(5px)"],
            }}
            transition={{
              duration: 0.5,
              delay: 0.8,
              exit: {
                duration: 1.0,
                times: [0, 0.5, 1],
                ease: "easeInOut",
              },
            }}
          ></motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
