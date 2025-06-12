import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { motion, AnimatePresence } from "framer-motion";

function GameReadyPage() {
  const navigate = useNavigate();
  const { selectedGenre } = useGame();
  const [countdown, setCountdown] = useState(3);
  const [showReadyPrompt, setShowReadyPrompt] = useState(true);
  const [showPointsInfo, setShowPointsInfo] = useState(false);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Start exit animation for ready prompt
          setShowReadyPrompt(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Show points info after ready prompt exits
    const showPointsTimer = setTimeout(() => {
      setShowPointsInfo(true);
    }, 4000); // 3s countdown + 1s for exit animation

    // Hide points info after some time
    const hidePointsTimer = setTimeout(() => {
      setShowPointsInfo(false);
    }, 7000); // 4s for first sequence + 3s to show points

    // Navigate after all animations complete
    const navigationTimer = setTimeout(() => {
      navigate("/question");
    }, 8500); // Total animation sequence time

    return () => {
      clearInterval(timer);
      clearTimeout(showPointsTimer);
      clearTimeout(hidePointsTimer);
      clearTimeout(navigationTimer);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-8">
      <AnimatePresence>
        {showReadyPrompt && (
          <div className="flex flex-col items-center gap-8">
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: [1, 1.05, 1],
                transition: {
                  opacity: { duration: 0.5 },
                  y: { duration: 0.5 },
                  scale: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  },
                },
              }}
              exit={{
                opacity: 0,
                y: -50,
                transition: { duration: 0.5 },
              }}
              className="text-4xl md:text-6xl font-bold text-white"
            >
              APAKAH KAMU SIAP?
            </motion.p>

            <motion.div
              key={countdown}
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { duration: 0.5 },
              }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.5 } }}
              className="text-7xl font-bold text-yellow-400 mt-8"
            >
              {countdown}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPointsInfo && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.7 },
            }}
            exit={{
              opacity: 0,
              y: -50,
              transition: { duration: 0.7 },
            }}
            className="bg-slate-800 p-4 rounded-lg shadow-xl text-white w-full max-w-sm"
          >
            <div className="text-center mb-4">
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {selectedGenre ? selectedGenre.name.toUpperCase() : "GENRE"}
              </span>
            </div>
            <div className="text-center mb-4">
              <p className="text-5xl font-bold text-yellow-400">+10</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold">POIN PER JAWABAN BENAR</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GameReadyPage;
