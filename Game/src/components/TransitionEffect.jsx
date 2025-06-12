import React from "react";
import { motion } from "framer-motion";

/**
 * TransitionEffect - Komponen yang menambahkan efek transisi global
 * untuk meningkatkan pengalaman navigasi antar halaman
 */
const TransitionEffect = () => {
  return (
    <>
      {/* Slide overlay */}
      <motion.div
        className="fixed top-0 bottom-0 right-full w-screen h-screen z-50 bg-purple-900"
        initial={{ x: "100%", width: "100%" }}
        animate={{ x: "0%", width: "0%" }}
        exit={{ x: ["0%", "100%"], width: ["0%", "100%"] }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Smooth fade overlay */}
      <motion.div
        className="fixed inset-0 z-40 bg-slate-900 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 0.5 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
    </>
  );
};

export default TransitionEffect;
