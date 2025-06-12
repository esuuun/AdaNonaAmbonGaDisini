import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import {
  TIME_PER_QUESTION,
  POINTS_PER_CORRECT_ANSWER,
} from "../constants/gameData";
import { Music } from "lucide-react";
import { UserContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

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

// Animation variants untuk timer
const timerVariants = {
  hidden: { opacity: 0, y: -20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
      delay: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
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
}; // Animation variants untuk option buttons
const optionButtonVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (custom) => ({
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
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
  hover: {
    scale: 1.05,
    backgroundColor: "#7B1FA2", // Warna ungu yang lebih cerah saat hover
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { duration: 0.2 },
  },
  correct: {
    opacity: 1,
    scale: 1.05,
    backgroundColor: "#4AFCDC",
    color: "#11112A",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  incorrect: {
    opacity: 1,
    scale: 1.05,
    backgroundColor: "#ef4444",
    color: "#ffffff",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  correctAnswer: {
    opacity: 1,
    scale: 1.05,
    backgroundColor: "#4AFCDC",
    color: "#11112A",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  disabled: {
    opacity: 0.7,
    scale: 0.98,
    backgroundColor: "#334155",
    color: "#cbd5e1", // Tambahkan warna teks yang lebih terang
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

// Animation variants untuk continue button
const continueButtonVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      delay: 0.2,
    },
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

// Animation variants untuk checkmark
const checkmarkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 15,
      delay: 0.1,
    },
  },
};

function QuestionPage({ audioRef, isMuted }) {
  const navigate = useNavigate();
  const {
    getCurrentQuestion,
    handleAnswer,
    currentRound,
    totalRounds,
    score,
    isLoading,
  } = useGame();

  const question = getCurrentQuestion();

  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [showHint, setShowHint] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [pointsToAdd, setPointsToAdd] = useState(0);
  const startTimeRef = useRef(Date.now());
  const answerTimeRef = useRef(0);
  const timerRef = useRef(null);

  const { user } = useContext(UserContext);
  // Effect for audio and timer handling
  useEffect(() => {
    // Reset status untuk setiap pertanyaan baru
    setAudioLoaded(false);
    setAudioError(false);

    // Gunakan audioRef.current secara langsung
    const audio = audioRef.current;

    if (audio && question?.audioSrc) {
      // Flag untuk memastikan handleCanPlay hanya dijalankan sekali
      let hasPlayed = false;

      // Fungsi yang akan dijalankan saat audio siap diputar
      const handleCanPlay = () => {
        // Skip jika sudah pernah dijalankan untuk pertanyaan ini
        if (hasPlayed) return;
        hasPlayed = true;

        setAudioLoaded(true);

        try {
          const audioDuration = audio.duration;

          // Hanya randomisasi jika klip lebih dari 10 detik
          // dan menyisakan minimal 7 detik waktu putar
          if (audioDuration > 10) {
            const maxStartTime = Math.max(0, audioDuration - 7);
            const randomStartTime = Math.floor(Math.random() * maxStartTime);

            console.log(
              `Durasi audio: ${audioDuration}s, mulai dari: ${randomStartTime}s`
            );
            audio.currentTime = randomStartTime;
          }

          // Mulai putar audio di sini, setelah currentTime diatur
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.warn("Autoplay dicegah:", error);
              setAudioError(true);
              // Anda bisa menampilkan tombol 'Play' manual di UI jika ini terjadi
            });
          }
        } catch (error) {
          console.warn("Gagal mengatur waktu mulai acak:", error);
          setAudioError(true);
        }
      };

      // Fungsi untuk menangani error pemuatan audio
      const handleError = (e) => {
        console.error("Error audio:", e);
        setAudioError(true);
      };

      // Tambahkan event listeners
      audio.addEventListener("canplaythrough", handleCanPlay);
      audio.addEventListener("error", handleError);

      // Set src dan muted, lalu muat audio
      audio.src = question.audioSrc;
      audio.muted = isMuted;
      audio.load(); // Memanggil load() secara eksplisit adalah praktik yang baik

      // Fungsi cleanup
      return () => {
        // Periksa lagi jika 'audio' masih ada
        if (audio) {
          audio.removeEventListener("canplaythrough", handleCanPlay);
          audio.removeEventListener("error", handleError);
          audio.pause();
          audio.src = ""; // Mengosongkan src untuk menghentikan download
          audio.removeAttribute("src");
          audio.load();
        }
      };
    }
  }, [question, isMuted, audioRef]);

  // Effect for timer
  useEffect(() => {
    setTimeLeft(TIME_PER_QUESTION); // Reset timer for new question
    setShowHint(false); // Reset hint visibility
    setCorrectAnswer(null); // Reset correct answer highlight
    setPointsToAdd(0); // Reset points to add

    if (!question) return; // Don't start timer if no question

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          // Don't automatically handle answer when time is up
          // Just let the user know time is up
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      // Cleanup function
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [question]);

  const selectAnswer = (index) => {
    // Store the selected answer index
    setCorrectAnswer(index);

    // Calculate answer time in milliseconds
    answerTimeRef.current = Date.now() - startTimeRef.current;

    // Stop the timer when an answer is selected
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Stop the music when an answer is selected
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Calculate points to add for UI display
    if (index === question.correct) {
      setPointsToAdd(POINTS_PER_CORRECT_ANSWER);
    } else {
      setPointsToAdd(0);
    }

    // Submit the answer immediately when user clicks an option
    handleAnswer(index, showHint, answerTimeRef.current);
  };

  const submitAnswer = () => {
    // Just navigate to solution page without handling answer again
    navigate("/solution");
  };

  // Watch for timer reaching zero
  useEffect(() => {
    if (timeLeft === 0 && correctAnswer === null) {
      // Stop the audio when time is up
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Pass null as answerIndex to indicate no selection and go directly to solution
      handleAnswer(null, showHint, TIME_PER_QUESTION * 1000);
    }
  }, [timeLeft, handleAnswer, showHint, correctAnswer, audioRef]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
        <p className="text-slate-300 text-lg">Memuat pertanyaan...</p>
      </div>
    );
  }

  // Handle case where no question is available
  if (!question) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden">
        <p className="text-slate-300 text-lg text-center px-4">
          Tidak ada pertanyaan tersedia. Silakan kembali ke menu utama.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-4 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 rounded-lg"
        >
          Kembali ke Menu
        </button>
      </div>
    );
  }
  return (
    <motion.div
      className={`fixed inset-0 flex flex-col items-center justify-center overflow-hidden question-container`}
      initial="hidden"
      animate="visible"
      exit="exit"
      data-question-container="true"
    >
      {/* Time remaining display with progress bar */}
      <motion.div
        className="absolute top-32 left-0 right-0 mx-auto text-center w-full max-w-xl px-4"
        variants={timerVariants}
      >
        <div className="w-full bg-slate-700 rounded-full h-4 mb-1 shadow-inner overflow-hidden">
          <div
            className="bg-yellow-500 h-4 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / TIME_PER_QUESTION) * 100}%` }}
          ></div>
        </div>
      </motion.div>

      {/* Score display - positioned on the left side */}
      <motion.div
        className="fixed left-8 top-[30%] z-10"
        variants={leftElementVariants}
      >
        <div className="bg-slate-700 border-2 border-yellow-400 rounded-lg py-2 px-6">
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
              </span>{" "}
              <span className="text-white ml-3 font-bold">
                {score}/{totalRounds * POINTS_PER_CORRECT_ANSWER}
              </span>
              <AnimatePresence>
                {correctAnswer !== null && pointsToAdd > 0 && (
                  <motion.span
                    className="font-bold ml-2 text-green-400"
                    initial={{ opacity: 0, scale: 0.5, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    +{pointsToAdd}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Round header */}
      <motion.div
        className="absolute w-full max-w-2xl mx-auto -translate-y-5 top-4 left-0 right-0"
        variants={headerVariants}
      >
        <div className="bg-[#1e1e4b] py-4 px-4 shadow-lg shadow-black/50 rounded-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-center">
            <span className="text-white">RONDE {currentRound}:</span>
            <br />
            <span className="text-yellow-400 text-2xl sm:text-3xl">
              APAKAH KAMU TAHU?
            </span>
          </h2>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="w-full max-w-3xl px-4">
        {/* Question text */}
        <motion.div className="text-center mb-6" variants={itemVariants}>
          <motion.h3
            className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2 sm:mb-4 tracking-wider"
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.3,
                duration: 0.5,
                type: "spring",
                stiffness: 300,
                damping: 15,
              },
            }}
          >
            TEBAK LAGUNYA!
          </motion.h3>

          {/* Audio status indicators */}
          <AnimatePresence mode="wait">
            {!audioLoaded && !audioError && (
              <motion.div
                className="flex justify-center items-center mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="animate-pulse text-yellow-400 flex items-center">
                  <Music className="mr-2" />
                  <span>Memuat audio...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {audioError && (
              <motion.div
                className="text-red-400 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p>
                  Gagal memuat audio. Silakan pilih jawaban berdasarkan teks
                  pertanyaan.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>{" "}
        {/* Answer options grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-7 max-w-3xl mx-auto"
          variants={itemVariants}
          layout
        >
          {" "}
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => selectAnswer(index)}
              disabled={correctAnswer !== null || timeLeft === 0}
              className="relative py-4 px-4 rounded-xl text-base md:text-lg font-semibold flex flex-col items-center justify-center bg-slate-700 shadow-xl"
              variants={optionButtonVariants}
              initial="hidden"
              animate={
                correctAnswer !== null &&
                index === correctAnswer &&
                index !== question.correct
                  ? "incorrect" // Jawaban yang dipilih tetapi salah
                  : correctAnswer === index
                  ? "correct" // Jawaban yang dipilih dan benar
                  : correctAnswer !== null && index === question.correct
                  ? "correctAnswer" // Menampilkan jawaban yang benar (jika pengguna memilih yang salah)
                  : correctAnswer !== null
                  ? "disabled" // Jawaban lain yang tidak dipilih setelah menjawab
                  : timeLeft === 0
                  ? "disabled" // Semua jawaban jika waktu habis
                  : "visible" // Status normal sebelum menjawab
              }
              whileHover={correctAnswer === null ? "hover" : ""}
              custom={index}
            >
              {/* If option is an object with title property (from API) use that, otherwise use the string directly */}{" "}
              <span className="line-clamp-2 text-white">
                {typeof option === "object" ? option.title : option}
              </span>
              <AnimatePresence>
                {index === question.correct && correctAnswer !== null && (
                  <motion.div
                    className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                    variants={checkmarkVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <span className="text-white text-xl">✓</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </motion.div>
        {/* Bottom continue button - only show after answer is selected or time is up */}
        <AnimatePresence>
          {(correctAnswer !== null || timeLeft === 0) && (
            <motion.div
              className="fixed bottom-6 left-0 right-0 text-center"
              variants={itemVariants}
            >
              <motion.button
                onClick={submitAnswer}
                className="bg-yellow-400 text-[#11112A] font-extrabold py-3 px-16 rounded-lg shadow-lg"
                variants={continueButtonVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
              >
                LANJUTKAN
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default QuestionPage;
