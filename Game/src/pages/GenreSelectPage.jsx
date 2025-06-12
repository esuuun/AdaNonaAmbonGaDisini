// Import React and necessary hooks
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { motion } from "framer-motion";
import { childVariants } from "../components/PageTransition";

// Import genres from constants
import { genres as defaultGenres } from "../constants/gameData";

function GenreSelectPage() {
  const navigate = useNavigate();
  const { startGame, isLoading } = useGame();
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startingGenre, setStartingGenre] = useState(null);
  const itemsPerPage = 9;

  // Fetch available genres from API when component mounts
  useEffect(() => {
    const fetchAvailableGenres = async () => {
      try {
        // This is a placeholder - you might need to create an endpoint that returns available genres
        // For now, we'll just use the default genres but later you can implement this API call
        setAvailableGenres(
          defaultGenres.map((genre) => ({
            ...genre,
            hasApiSongs:
              genre.id !== "jazz" &&
              genre.id !== "hiphop" &&
              genre.id !== "country" &&
              genre.id !== "dangdut" &&
              genre.id !== "rock",
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setLoading(false);
      }
    };

    fetchAvailableGenres();
  }, []);

  // Filter genres that have songs available via API
  const genresWithApiSongs = availableGenres.filter((g) => g.hasApiSongs);
  const comingSoonGenres = availableGenres.filter((g) => !g.hasApiSongs);
  const displayableGenres = [...genresWithApiSongs, ...comingSoonGenres]; // Show available first

  const totalPages = Math.ceil(displayableGenres.length / itemsPerPage);

  const currentDisplayGenres = displayableGenres.slice(
    currentPageIdx * itemsPerPage,
    (currentPageIdx + 1) * itemsPerPage
  );

  const handleBack = () => {
    navigate("/");
  };

  const handleSelectGenre = (genreId) => {
    setStartingGenre(genreId);
    startGame(genreId);
  };
  return (
    <div className="p-4 md:p-8 flex flex-col items-center justify-center h-screen pt-20 ">
      {isLoading && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center flex-col">
          <div className="animate-spin mb-4">
            <Loader size={48} className="text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Membuat Permainan
          </h2>
          <p className="text-slate-300">
            Sedang menyiapkan lagu-lagu{" "}
            {startingGenre &&
              defaultGenres.find((g) => g.id === startingGenre)?.name}
            ...
          </p>
        </div>
      )}

      <motion.button
        variants={childVariants}
        onClick={handleBack}
        className="absolute top-28 left-2 md:left-8 text-slate-300 hover:text-white transition-colors flex items-center text-sm z-10"
      >
        <ChevronLeft size={32} className="mr-1" />
      </motion.button>

      {loading ? (
        <div className="text-white text-lg">Loading genres...</div>
      ) : currentDisplayGenres.length === 0 ? (
        <p className="text-slate-400 text-lg">
          Belum ada genre yang tersedia saat ini. Coba lagi nanti!
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-4 w-full max-w-4xl mb-8">
          {currentDisplayGenres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleSelectGenre(genre.id)}
              disabled={!genre.hasApiSongs || isLoading}
              className={
                genre.hasApiSongs
                  ? `group relative flex flex-col items-center justify-center p-6 ${
                      isLoading
                        ? "bg-purple-800"
                        : "bg-purple-600 hover:bg-purple-700"
                    } rounded-xl shadow-xl transform ${
                      isLoading ? "" : "hover:scale-105"
                    } transition-all duration-300 ease-in-out h-48 ${
                      isLoading ? "cursor-wait" : ""
                    }`
                  : "group relative flex flex-col items-center justify-center p-6 bg-slate-700 rounded-xl shadow-xl h-48 opacity-50 cursor-not-allowed"
              }
            >
              {React.cloneElement(genre.icon, {
                className: `h-12 w-12 ${
                  !genre.hasApiSongs ? "text-slate-500" : "text-white"
                }`,
              })}
              <h2
                className={`text-2xl font-bold ${
                  !genre.hasApiSongs ? "text-slate-500" : "text-white"
                }`}
              >
                {genre.name}
              </h2>
              {!genre.hasApiSongs && (
                <p className="text-sm font-bold text-slate-500">Segera Hadir</p>
              )}
            </button>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 my-6">
          <button
            onClick={() => setCurrentPageIdx((p) => Math.max(0, p - 1))}
            disabled={currentPageIdx === 0}
            className="p-2 text-slate-300 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          {/* Numbered pagination */}
          <div className="flex items-center space-x-2">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPageIdx(idx)}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
                  currentPageIdx === idx ? "bg-yellow-500" : "bg-indigo-700"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              setCurrentPageIdx((p) => Math.min(totalPages - 1, p + 1))
            }
            disabled={currentPageIdx === totalPages - 1}
            className="p-2 text-slate-300 disabled:opacity-50 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}

export default GenreSelectPage;
