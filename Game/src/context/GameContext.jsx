import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  genres,
  TOTAL_ROUNDS,
  POINTS_PER_CORRECT_ANSWER,
} from "../constants/gameData";
import {
  gameRoomApi,
  roundsApi,
  songsApi,
  playerAnswersApi,
  gamePlayersApi,
} from "../services/api";
import { UserContext } from "./AuthContext";

// Create the context
const GameContext = createContext();

// Custom hook to use the game context
export const useGame = () => useContext(GameContext);

// Provider component
export const GameProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [currentSongs, setCurrentSongs] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentGameRoom, setCurrentGameRoom] = useState(null);
  const [currentRounds, setCurrentRounds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset audio when navigating
  useEffect(() => {
    return () => {
      // Cleanup audio if needed
      const audio = document.querySelector("audio");
      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  // Start game with selected genre
  const startGame = useCallback(
    async (genreId) => {
      try {
        setIsLoading(true);
        setError(null);

        const genreData = genres.find((g) => g.id === genreId);
        setSelectedGenre(genreData);

        // Create a new game room
        const gameRoomResponse = await gameRoomApi.create(genreId);
        console.log("Game room created:", gameRoomResponse.data);

        const gameRoom = gameRoomResponse.data.payload;
        const roomId = gameRoom.roomId;

        console.log("Game room ID:", roomId);
        setCurrentGameRoom(gameRoom);

        // Create rounds for this game room
        await roundsApi.createRounds(roomId, TOTAL_ROUNDS);
        console.log("Rounds created for room:", roomId);

        // Get rounds created for this room
        const roundsResponse = await roundsApi.getRoundsByRoomId(roomId);
        console.log("Get Rounds", roundsResponse.data);
        const rounds = roundsResponse.data.payload;
        setCurrentRounds(rounds);

        // Add the current user to the game room
        const userId = user.userId;
        if (userId) {
          try {
            const gamePlayerResponse = await gamePlayersApi.addPlayer(
              roomId,
              userId
            );
            const gamePlayer = gamePlayerResponse.data;
            // Save the gamePlayerId for later score updates
            localStorage.setItem("gamePlayerId", gamePlayer.gamePlayerId);
          } catch (error) {
            console.error("Failed to add player to game room:", error);
          }
        }

        // Fetch songs and options for each round
        const songsPromises = rounds.map(async (round) => {
          try {
            console.log("round", round);
            const songId = round.correctSongId;
            const songResponse = await songsApi.getSongById(songId);
            console.log("Song fetched:", songResponse.data);
            const optionsResponse = await songsApi.getSongOptions(songId);
            console.log("Options fetched:", optionsResponse.data);

            return {
              ...songResponse.data.payload,
              options: optionsResponse.data.payload.options,
              correct: optionsResponse.data.payload.correctIndex,
              roundId: round.roundId,
              audioSrc: songResponse.data.payload.previewUrl, // Gunakan previewUrl sebagai audioSrc
            };
          } catch (error) {
            console.error(
              `Error fetching song for round ${round.roundId}:`,
              error
            );
            // Return a fallback song object if the API fails
            return {
              songId: round.songIdCorrect,
              title: "Fallback Song",
              artist: { name: "Fallback Artist" },
              previewUrl:
                "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
              albumArtUrl: "https://via.placeholder.com/150?text=Fallback",
              audioSrc:
                "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
              options: [
                { songId: round.songIdCorrect, title: "Fallback Song" },
                { songId: crypto.randomUUID(), title: "Wrong Option 1" },
                { songId: crypto.randomUUID(), title: "Wrong Option 2" },
                { songId: crypto.randomUUID(), title: "Wrong Option 3" },
              ],
              correct: 0,
              roundId: round.roundId,
            };
          }
        });

        const fetchedSongs = await Promise.all(songsPromises);
        setCurrentSongs(fetchedSongs);
        setCurrentQuestionIndex(0);
        setScore(0);
        setUserAnswers([]);
        navigate("/ready");
      } catch (error) {
        console.error("Error starting game:", error);
        setError("Failed to start the game. Please try again.");
        // Show an alert or set an error state that can be displayed to the user
        alert("Gagal memulai permainan. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  ); // Move to next question
  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < currentSongs.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      navigate("/question");
    } else {
      navigate("/results");
    }
  }, [currentQuestionIndex, currentSongs.length, navigate]);

  // Handle user answer
  const handleAnswer = useCallback(
    async (answerIndex, usedHint, answerTime) => {
      const currentQuestion = currentSongs[currentQuestionIndex];
      if (!currentQuestion) return;

      const isCorrect = answerIndex === currentQuestion.correct;
      let pointsEarned = 0;
      if (isCorrect) {
        pointsEarned = POINTS_PER_CORRECT_ANSWER;
        if (usedHint) {
          pointsEarned = Math.max(0, pointsEarned - 2);
        }
        setScore((prevScore) => prevScore + pointsEarned);
      }

      // Get current user ID
      const userId = localStorage.getItem("userId");

      // If user is logged in, submit their answer to backend
      if (userId) {
        try {
          // Submit player answer to backend
          await playerAnswersApi.submitAnswer(
            userId,
            currentQuestion.roundId,
            currentQuestion.options[answerIndex]?.songId || null, // Safely handle options
            answerTime
          );

          // If correct answer, update player score
          if (isCorrect && pointsEarned > 0) {
            const gamePlayerId = localStorage.getItem("gamePlayerId");
            if (gamePlayerId) {
              await gamePlayersApi.updateScore(gamePlayerId, pointsEarned);
            }
          }
        } catch (error) {
          console.error("Error submitting answer:", error);
          // Continue the game even if the API call fails
        }
      }

      setUserAnswers((prevAnswers) => [
        ...prevAnswers,
        {
          questionIndex: currentQuestionIndex,
          answerIndex,
          isCorrect,
          questionTitle: currentQuestion.title,
          roundId: currentQuestion.roundId,
          answerTime: answerTime || 0,
        },
      ]);
    },
    [currentSongs, currentQuestionIndex, navigate]
  );

  // Get current question data
  const getCurrentQuestion = () => currentSongs[currentQuestionIndex] || null;

  // Get last answer for solution page
  const getLastAnswer = () => userAnswers[userAnswers.length - 1] || null; // Value object to be provided to consumers
  const value = {
    selectedGenre,
    currentSongs,
    currentQuestionIndex,
    score,
    userAnswers,
    startGame,
    nextQuestion,
    handleAnswer,
    getCurrentQuestion,
    getLastAnswer,
    totalRounds: currentSongs.length,
    currentRound: currentQuestionIndex + 1,
    answerHistory: userAnswers.map((answer) => answer.isCorrect),
    totalPossibleScore: currentSongs.length * POINTS_PER_CORRECT_ANSWER,
    currentGameRoom,
    currentRounds,
    isLoading,
    error,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export default GameContext;
