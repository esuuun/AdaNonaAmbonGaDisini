import React, { useEffect } from "react";
import { Music, Edit3, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";

function HomePage() {
  const navigate = useNavigate();
  const controls = useAnimation();

  useEffect(() => {
    // Start the animation as soon as component mounts
    controls.start("visible");
  }, [controls]);
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Even faster staggering
        delayChildren: 0.05, // Minimal delay for immediate appearance after intro
      },
    },
    exit: {
      opacity: 0,
      filter: "blur(8px)",
      scale: 0.95,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        staggerChildren: 0.1,
        staggerDirection: -1,
        when: "afterChildren",
      },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.92 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100, // Increased from 80 for snappier animation
        damping: 10, // Slightly reduced for faster animation
      },
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.9,
      filter: "blur(5px)",
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };
  return (
    <div className="text-center p-8 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] pt-16">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-3xl"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.button
          onClick={() => navigate("/genre")}
          className="group relative flex flex-col items-center justify-center p-6 bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out h-48"
          variants={itemVariants}
          whileHover={{
            scale: 1.05,
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Music
            size={48}
            className="mb-3 text-purple-200 group-hover:text-white transition-colors"
          />
          <h2 className="text-2xl font-bold text-white">MUSIC QUIZ</h2>
          <p className="text-sm font-bold text-purple-200 group-hover:text-white transition-colors">
            Tes pengetahuan musikmu
          </p>
        </motion.button>
        <motion.button
          disabled
          className="group relative flex flex-col items-center justify-center p-6 bg-slate-700 rounded-xl shadow-xl h-48 opacity-50 cursor-not-allowed"
          variants={itemVariants}
        >
          <Edit3 size={48} className="mb-3 text-slate-400" />
          <h2 className="text-2xl font-bold text-slate-300">CREATE</h2>
          <p className="text-sm font-bold text-slate-400">
            Tantang temanmu (Segera Hadir)
          </p>
        </motion.button>
        <motion.button
          disabled
          className="group relative flex flex-col items-center justify-center p-6 bg-slate-700 rounded-xl shadow-xl h-48 opacity-50 cursor-not-allowed"
          variants={itemVariants}
        >
          <Users size={48} className="mb-3 text-slate-400" />
          <h2 className="text-2xl font-bold text-slate-300">MULTIPLAYER</h2>
          <p className="text-sm font-bold text-slate-400">
            Bermain bersama (Segera Hadir)
          </p>
        </motion.button>
      </motion.div>
    </div>
  );
}

export default HomePage;
