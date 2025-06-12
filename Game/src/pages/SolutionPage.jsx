import React, { useContext, useState } from "react";
import { useGame } from "../context/GameContext";
import {
  CheckCircle,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  Music,
  Clock,
} from "lucide-react";
import { POINTS_PER_CORRECT_ANSWER } from "../constants/gameData";
import { UserContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants untuk komponen-komponen halaman
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
};

// Animation variants khusus untuk header
const headerVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 15, stiffness: 200 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
};

// Animation variants untuk elemen yang masuk dari kiri
const leftElementVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 200, damping: 20, delay: 0.2 },
  },
  exit: {
    opacity: 0,
    x: -30,
    transition: { duration: 0.2 },
  },
};

// Animation variants untuk button
const buttonVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
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
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 },
  },
  hover: {
    scale: 1.05,
    backgroundColor: "#fcd34d",
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.95,
    backgroundColor: "#fbbf24",
    transition: { duration: 0.1 },
  },
};

// Animation variants untuk song card
const songCardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
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
  hover: {
    scale: 1.02,
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { duration: 0.2 },
  },
};

// Animation variants untuk dots
const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (custom) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.2 + custom * 0.08,
      type: "spring",
      stiffness: 400,
      damping: 15,
    },
  }),
};

// Animation variants for result messages
const resultMessageVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: {
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
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    transition: { duration: 0.2 },
  },
};

function SolutionPage() {
  const {
    getLastAnswer,
    getCurrentQuestion,
    nextQuestion,
    currentRound,
    totalRounds,
    score,
    answerHistory,
  } = useGame();
  const userAnswer = getLastAnswer();
  const question = getCurrentQuestion();
  const [currentQuestion, setCurrentQuestion] = useState(question);
  const { user } = useContext(UserContext);
  if (!userAnswer || !question) {
    // Guard clause
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden">
        {" "}
        <p className="text-slate-300 text-lg">Memuat solusi...</p>{" "}
        <button
          onClick={() => nextQuestion()}
          className="mt-4 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 rounded-lg"
        >
          Lanjut
        </button>
      </div>
    );
  }

  const isCorrect = userAnswer.isCorrect;
  // Function to render progress dots
  const renderProgressDots = () => {
    return (
      <div className="flex justify-center space-x-2 my-4">
        {answerHistory.map((correct, idx) => (
          <motion.div
            key={idx}
            className={`w-4 h-4 rounded-full ${
              correct ? "bg-green-500" : "bg-red-500"
            }`}
            variants={dotVariants}
            initial="hidden"
            animate="visible"
            custom={idx}
          ></motion.div>
        ))}
        {/* Remaining rounds - grey dots */}
        {[...Array(totalRounds - answerHistory.length)].map((_, idx) => (
          <motion.div
            key={`remaining-${idx}`}
            className="w-4 h-4 rounded-full bg-slate-600"
            variants={dotVariants}
            initial="hidden"
            animate="visible"
            custom={answerHistory.length + idx}
          ></motion.div>
        ))}
      </div>
    );
  };
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Top header with round info */}
      <motion.div
        className="absolute w-full max-w-2xl mx-auto -translate-y-5 top-4 left-0 right-0"
        variants={headerVariants}
      >
        <div className="bg-[#1e1e4b] py-4 px-4 shadow-lg shadow-black/50 rounded-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center">
            <span className="text-white">RONDE {currentRound}:</span>
            <br />
            <span className="text-yellow-400 text-2xl sm:text-3xl">
              APAKAH KAMU TAHU?
            </span>
          </h2>
        </div>
      </motion.div>
      {/* Score display */}
      <motion.div
        className="fixed left-8 top-[30%] z-10"
        variants={leftElementVariants}
      >
        <div className="bg-slate-700 border-yellow-400 border-2 rounded-lg py-2 px-6">
          <div className="flex items-center gap-3">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-yellow-400 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-yellow-400 bg-yellow-400 flex items-center justify-center text-slate-900 font-bold text-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div className="flex items-center">
              <span className="text-yellow-400 font-bold tracking-wide text-lg">
                {user.name || "Anda"}
              </span>
              <span className="text-white ml-3 font-bold">
                {score}/{totalRounds * POINTS_PER_CORRECT_ANSWER}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="w-full max-w-2xl px-4 mx-auto">
        {/* Progress indicator */}
        <motion.div className="text-center" variants={itemVariants}>
          {" "}
          {renderProgressDots()}
          <motion.p
            className={`text-lg sm:text-xl font-extrabold ${
              isCorrect ? "text-green-400" : "text-red-400"
            }`}
            variants={resultMessageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {isCorrect
              ? "KERJA BAGUS, TERUSKAN!"
              : "Terus mencoba, ketekunan adalah kunci keberhasilan!"}
          </motion.p>
        </motion.div>
        {/* Song info card */}
        <motion.div
          className="mt-6 mb-16 w-full flex flex-col items-center justify-center"
          variants={itemVariants}
        >
          {question.title && (
            <motion.div
              className="bg-[#1e1c42] rounded-lg p-3 w-full flex items-center"
              variants={songCardVariants}
              whileHover="hover"
            >
              <motion.div
                className="bg-[#121331] rounded-md p-2 mr-3"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    delay: 0.6,
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  },
                }}
              >
                {question.albumArtUrl ? (
                  <img
                    src={currentQuestion.albumArtUrl}
                    alt="Album Art"
                    className="w-10 h-10 rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/150?text=Music";
                    }}
                  />
                ) : (
                  <Music
                    size={32}
                    className="text-green-400"
                    style={{
                      filter: "drop-shadow(0 0 5px rgba(74, 222, 128, 0.5))",
                    }}
                  />
                )}
              </motion.div>
              <motion.div
                className="text-left flex-grow"
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { delay: 0.7, duration: 0.3 },
                }}
              >
                <h3 className="font-bold text-lg text-white line-clamp-1">
                  {currentQuestion.title}
                </h3>
                {question.artist && (
                  <p className="text-slate-300 text-sm line-clamp-1">
                    {typeof question.artist === "object"
                      ? currentQuestion.artist.name
                      : currentQuestion.artist}
                  </p>
                )}
                {question.genre && (
                  <p className="text-slate-400 text-xs">
                    {question.genre.charAt(0).toUpperCase() +
                      question.genre.slice(1)}
                  </p>
                )}
              </motion.div>
              <div className="ml-auto flex space-x-2">
                {question.previewUrl && (
                  <motion.button
                    className="bg-[#1DB954] p-2 rounded-full hover:bg-[#1ed760] transition-colors"
                    onClick={() => window.open(question.previewUrl, "_blank")}
                    title="Play on Spotify"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: {
                        delay: 0.8,
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      },
                    }}
                  >
                    <img
                      src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"
                      alt="Spotify"
                      className="h-5 w-auto"
                    />
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>{" "}
        {/* Next button */}
        <motion.div
          className="fixed bottom-6 left-0 right-0 text-center"
          variants={itemVariants}
        >
          {" "}
          <motion.button
            onClick={() => {
              // Simple delay to wait for exit animation to complete
              // before navigating to the next question
              setTimeout(() => {
                nextQuestion();
              }, 300); // 300ms should be enough for the exit animation
            }}
            className="bg-yellow-400 text-[#11112A] font-extrabold py-3 px-16 rounded-lg shadow-lg"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {currentRound < totalRounds ? "LANJUTKAN" : "LIHAT HASIL"}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default SolutionPage;
