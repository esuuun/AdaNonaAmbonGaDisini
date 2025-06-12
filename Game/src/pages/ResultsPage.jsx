import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import {
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Music,
  Medal,
  ChevronUp,
} from "lucide-react";
import { POINTS_PER_CORRECT_ANSWER } from "../constants/gameData";
import { UserContext } from "../context/AuthContext";

function ResultsPage() {
  const navigate = useNavigate();
  const {
    score,
    totalPossibleScore,
    userAnswers,
    selectedGenre,
    currentSongs,
  } = useGame();
  const [isAnimatingScore, setIsAnimatingScore] = useState(true);
  const [animatedScore, setAnimatedScore] = useState(0);
  const { user } = useContext(UserContext);

  // Start score animation on mount
  useEffect(() => {
    if (score > 0) {
      let currentScore = 0;
      const increment = Math.max(1, Math.ceil(score / 50)); // Increase by at least 1, or more for larger scores
      const interval = setInterval(() => {
        currentScore += increment;
        if (currentScore >= score) {
          currentScore = score;
          clearInterval(interval);
          setIsAnimatingScore(false);
        }
        setAnimatedScore(currentScore);
      }, 50);
      return () => clearInterval(interval);
    } else {
      setIsAnimatingScore(false);
      setAnimatedScore(0);
    }
  }, [score]);

  const accuracy =
    totalPossibleScore > 0 ? (score / totalPossibleScore) * 100 : 0;

  // Calculate average answer time if available in user answers
  const calculateAvgTime = () => {
    if (!userAnswers || userAnswers.length === 0) return 0;

    // Filter out answers that have answerTime property
    const answersWithTime = userAnswers.filter((answer) => answer.answerTime);

    if (answersWithTime.length === 0) return 0;

    // Calculate average time in seconds
    const totalTime = answersWithTime.reduce(
      (sum, answer) => sum + answer.answerTime,
      0
    );
    return (totalTime / 1000 / answersWithTime.length).toFixed(2);
  };

  const avgTime = calculateAvgTime();

  // Calculate correct and incorrect answers
  const correctAnswers = userAnswers.filter(
    (answer) => answer.isCorrect
  ).length;
  const incorrectAnswers = userAnswers.length - correctAnswers;

  const handlePlayAgain = () => {
    navigate("/genre");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  // Determine performance rating
  const getRating = () => {
    if (accuracy >= 90)
      return { text: "LUAR BIASA!", class: "text-yellow-400" };
    if (accuracy >= 70)
      return { text: "SANGAT BAIK!", class: "text-green-400" };
    if (accuracy >= 50) return { text: "BAIK!", class: "text-blue-400" };
    if (accuracy >= 30) return { text: "LUMAYAN!", class: "text-purple-400" };
    return { text: "COBA LAGI!", class: "text-red-400" };
  };

  const rating = getRating();

  return (
    <div className="p-4 md:p-8 flex flex-col items-center justify-center min-h-screen w-full relative overflow-hidden ">
      {/* Stars background */}
      <div className="absolute inset-0 z-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.8 + 0.2,
              animationDuration: `${Math.random() * 5 + 2}s`,
            }}
          />
        ))}
      </div>
      {/* Header */}
      <div className="w-full max-w-3xl z-10 text-center mb-8">
        <div className="bg-[#1F1F4D]/80 py-5 px-8 rounded-xl shadow-lg mb-8 backdrop-blur-sm border border-indigo-900/50">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
            LEADERBOARDS
          </h1>
          <h2 className="text-2xl md:text-3xl font-extrabold text-yellow-400 tracking-wide">
            HASIL
          </h2>
        </div>
      </div>
      {/* Genre info */}
      {selectedGenre && (
        <div className="z-10 mb-6 bg-[#1F1F4D]/80 px-8 py-3 rounded-full shadow-md backdrop-blur-sm border border-indigo-900/50 transform transition-all hover:scale-105">
          <p className="text-white font-medium">
            <span className="text-slate-300">Genre:</span>{" "}
            <span className="text-yellow-400 font-extrabold">
              {selectedGenre.name}
            </span>
          </p>
        </div>
      )}
      {/* Character Avatar */}
      <div className="z-10 mb-6">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-yellow-400 bg-[#1F1F4D]/80 flex items-center justify-center shadow-xl backdrop-blur-sm">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-yellow-400 object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-2 border-yellow-400 bg-yellow-400 flex items-center justify-center text-slate-900 font-extrabold text-3xl">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>
      </div>{" "}
      {/* Performance rating */}
      <div className="z-10 text-center mb-8">
        <h3 className="text-white text-xl mb-2 font-semibold tracking-wide">
          {correctAnswers > incorrectAnswers ? "Selamat!" : "Belajar lagi!"}
        </h3>
        <h2
          className={`text-4xl font-extrabold ${rating.class} mb-4 tracking-wide animate-pulse`}
        >
          {rating.text}
        </h2>
        <div className="flex items-center justify-center bg-[#1F1F4D]/70 px-8 py-3 rounded-xl backdrop-blur-sm border border-indigo-900/50 shadow-lg">
          {accuracy >= 70 && (
            <Medal className="text-yellow-400 h-10 w-10 mr-3" />
          )}
          <h3 className="text-2xl md:text-3xl font-extrabold text-white">
            NILAI AKHIR:{" "}
            <span className="text-yellow-400 text-3xl md:text-4xl">
              {isAnimatingScore ? animatedScore : score}
            </span>
          </h3>
        </div>
      </div>
      {/* Score cards */}
      <div className="flex flex-wrap justify-center gap-5 mb-12 z-10 w-full max-w-3xl">
        <div className="bg-[#1F1F4D]/80 rounded-xl p-5 flex-1 min-w-[180px] text-center border border-indigo-900/50 shadow-xl transition-transform hover:scale-105 backdrop-blur-sm">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-indigo-900/50 rounded-full p-3">
              <Award className="text-yellow-400 h-8 w-8" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-white mb-1">
            {correctAnswers} / {userAnswers.length}
          </h3>
          <p className="text-slate-300 font-medium">Jawaban Benar</p>
        </div>

        <div className="bg-[#1F1F4D]/80 rounded-xl p-5 flex-1 min-w-[180px] text-center border border-indigo-900/50 shadow-xl transition-transform hover:scale-105 backdrop-blur-sm">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-indigo-900/50 rounded-full p-3">
              <Clock className="text-yellow-400 h-8 w-8" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-white mb-1">
            {avgTime}s
          </h3>
          <p className="text-slate-300 font-medium">Waktu rata-rata</p>
        </div>

        <div className="bg-[#1F1F4D]/80 rounded-xl p-5 flex-1 min-w-[180px] text-center border border-indigo-900/50 shadow-xl transition-transform hover:scale-105 backdrop-blur-sm">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-indigo-900/50 rounded-full p-3">
              <CheckCircle size={20} className="text-yellow-400 h-8 w-8" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-white mb-1">
            {accuracy.toFixed(0)}%
          </h3>
          <p className="text-slate-300 font-medium">Ketepatan</p>
        </div>
      </div>{" "}
      {/* Song summary */}
      {currentSongs && currentSongs.length > 0 && (
        <div className="z-10 w-full max-w-3xl mb-10">
          <h3 className="text-xl font-extrabold text-white mb-4 flex items-center tracking-wide">
            <Music className="mr-3 text-yellow-400" />
            Lagu yang Ditebak
          </h3>
          <div className="bg-[#1F1F4D]/80 rounded-xl p-5 overflow-hidden shadow-xl backdrop-blur-sm border border-indigo-900/50">
            <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {currentSongs.map((song, index) => {
                const userAnswer = userAnswers[index];
                return (
                  <div
                    key={index}
                    className={`flex items-center py-3 px-4 rounded-lg mb-3 transition-all hover:translate-x-1 ${
                      userAnswer?.isCorrect
                        ? "bg-green-900/30 border border-green-700"
                        : "bg-red-900/30 border border-red-700"
                    }`}
                  >
                    <div className="mr-4">
                      {userAnswer?.isCorrect ? (
                        <CheckCircle size={22} className="text-green-400" />
                      ) : (
                        <XCircle size={22} className="text-red-400" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="text-white text-base font-bold">
                        {song.title}
                      </p>
                      <p className="text-gray-300 text-sm">
                        {typeof song.artist === "object"
                          ? song.artist.name
                          : song.artist}
                      </p>
                    </div>
                    {userAnswer?.answerTime && (
                      <div className="text-right bg-[#2A2A60]/70 px-3 py-1 rounded-lg">
                        <p className="text-yellow-400 font-bold">
                          {(userAnswer.answerTime / 1000).toFixed(1)}s
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}{" "}
      {/* Action buttons */}
      <div className="z-10 w-full max-w-sm">
        <button
          onClick={handlePlayAgain}
          className="w-full mb-5 py-4 px-8 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 rounded-xl text-xl font-extrabold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-yellow-400/20 hover:shadow-xl"
        >
          MAIN LAGI
        </button>

        <button
          onClick={handleGoHome}
          className="w-full py-3 px-8 bg-[#1F1F4D]/80 backdrop-blur-sm border border-indigo-900/50 hover:bg-slate-800 text-white rounded-xl text-lg font-bold transition-all duration-300 hover:scale-105 hover:border-yellow-400/50"
        >
          Menu Utama
        </button>
      </div>
    </div>
  );
}

export default ResultsPage;
