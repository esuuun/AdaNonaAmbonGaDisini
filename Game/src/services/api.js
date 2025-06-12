// API service for game interactions
import axios from "axios";

const API_BASE_URL = "http://localhost:8080"; // Change this to your backend URL

// Flag to determine if we should use mock data (for development when backend is not available)
const USE_MOCK_DATA = false; // Set this to false when connecting to a real backend

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    // If we're in development mode and using mock data, return mock responses
    if (USE_MOCK_DATA) {
      console.log("Using mock data fallback");
      return mockApiResponse(error.config);
    }

    return Promise.reject(error);
  }
);

// Helper function to generate mock responses based on the request
const mockApiResponse = (config) => {
  const { url, data } = config;

  // Generate a UUID for entities
  const generateId = () => crypto.randomUUID();

  // Parse request data if present
  const requestData = data ? JSON.parse(data) : {};

  // Mock data for different endpoints
  if (url.includes("/gamerooms/create")) {
    return Promise.resolve({
      data: {
        roomId: generateId(),
        roomCode: "MOCK123",
        gameMode: requestData.gameMode || "standard",
        genre: requestData.genre || "pop",
        status: "waiting",
      },
    });
  }

  if (url.includes("/rounds/create-for-room")) {
    const roomId = url.split("/").pop();
    const count = requestData.count || 5;
    const rounds = Array(count)
      .fill(0)
      .map((_, index) => ({
        roundId: generateId(),
        roomId: roomId,
        songIdCorrect: generateId(),
        roundNumber: index + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    return Promise.resolve({ data: rounds });
  }

  if (url.includes("/rounds/room/")) {
    const roomId = url.split("/").pop();
    const rounds = Array(5)
      .fill(0)
      .map((_, index) => ({
        roundId: generateId(),
        roomId: roomId,
        songIdCorrect: generateId(),
        roundNumber: index + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    return Promise.resolve({ data: rounds });
  }

  if (url.includes("/songs/random")) {
    const genre = new URLSearchParams(url.split("?")[1]).get("genre");
    const count = parseInt(
      new URLSearchParams(url.split("?")[1]).get("count") || "5"
    );

    const songs = Array(count)
      .fill(0)
      .map((_, index) => ({
        songId: generateId(),
        title: `${genre.charAt(0).toUpperCase() + genre.slice(1)} Song ${
          index + 1
        }`,
        genre: genre,
        artist: {
          artistId: generateId(),
          name: `Artist ${index + 1}`,
        },
        previewUrl: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${
          index + 1
        }.mp3`,
        albumArtUrl: `https://via.placeholder.com/150?text=${genre}+${
          index + 1
        }`,
      }));

    return Promise.resolve({ data: songs });
  }

  if (url.match(/\/songs\/[a-f0-9-]+$/)) {
    // Single song fetch
    const songId = url.split("/").pop();
    return Promise.resolve({
      data: {
        songId: songId,
        title: "Mock Song Title",
        artist: {
          artistId: generateId(),
          name: "Mock Artist",
        },
        genre: "pop",
        previewUrl:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        albumArtUrl: "https://via.placeholder.com/150?text=Album+Art",
        audioSrc:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
    });
  }

  if (url.match(/\/songs\/[a-f0-9-]+\/options$/)) {
    // Song options for guessing
    const songId = url.split("/")[2];

    const options = [
      { songId: songId, title: "Correct Song Title" },
      { songId: generateId(), title: "Distractor Song 1" },
      { songId: generateId(), title: "Distractor Song 2" },
      { songId: generateId(), title: "Distractor Song 3" },
    ];

    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    // Find the correct index
    const correctIndex = options.findIndex((opt) => opt.songId === songId);

    return Promise.resolve({
      data: {
        options: options,
        correctIndex: correctIndex,
      },
    });
  }

  if (url.includes("/player-answers/submit")) {
    return Promise.resolve({
      data: {
        playerAnswerId: generateId(),
        userId: requestData.userId,
        roundId: requestData.roundId,
        songIdGuess: requestData.songIdGuess,
        answerTimeMs: requestData.answerTimeMs,
        isCorrect: Math.random() > 0.5, // Randomly determine if correct
        createdAt: new Date().toISOString(),
      },
    });
  }

  if (url.includes("/game-players/add")) {
    return Promise.resolve({
      data: {
        gamePlayerId: generateId(),
        roomId: requestData.roomId,
        userId: requestData.userId,
        score: 0,
        joinedAt: new Date().toISOString(),
      },
    });
  }

  // Default fallback
  return Promise.resolve({ data: {} });
};

// Game Room APIs
export const gameRoomApi = {
  // Create a new game room
  create: (gameMode) => {
    return api.post("/gamerooms/create", { gameMode });
  },

  // Get game room by ID
  getById: (roomId) => {
    return api.get(`/gamerooms/${roomId}`);
  },

  // Get game room by code
  getByCode: (code) => {
    return api.get(`/gamerooms/code/${code}`);
  },

  // Update game room status
  updateStatus: (roomId, status) => {
    return api.patch(`/gamerooms/${roomId}/status`, { status });
  },
};

// Rounds APIs
export const roundsApi = {
  // Create rounds for a game room
  createRounds: (roomId, count = 5) => {
    return api.post(`/rounds/create-for-room/${roomId}`, { count });
  },

  // Get all rounds for a game room
  getRoundsByRoomId: (roomId) => {
    return api.get(`/rounds/room/${roomId}`);
  },
};

// Songs APIs
export const songsApi = {
  // Get random songs by genre
  getRandomByGenre: (genre, count = 5) => {
    return api.get(`/songs/random?genre=${genre}&count=${count}`);
  },

  // Get a song by ID
  getSongById: (songId) => {
    return api.get(`/songs/${songId}`);
  },

  // Get song options for guessing (correct answer + distractors)
  getSongOptions: (songId) => {
    return api.get(`/songs/${songId}/options`);
  },
};

// Player Answers APIs
export const playerAnswersApi = {
  // Submit player answer
  submitAnswer: (userId, roundId, songIdGuess, answerTime) => {
    return api.post("/player-answers/submit", {
      userId,
      roundId,
      songIdGuess,
      answerTimeMs: answerTime,
    });
  },

  // Get answers for a round
  getAnswersForRound: (roundId) => {
    return api.get(`/player-answers/round/${roundId}`);
  },
};

// Game Players APIs
export const gamePlayersApi = {
  // Add player to game room
  addPlayer: (roomId, userId) => {
    return api.post("/game-players/add", { roomId, userId });
  },

  // Update player score
  updateScore: (gamePlayerId, scoreToAdd) => {
    return api.patch(`/game-players/${gamePlayerId}/score`, { scoreToAdd });
  },

  // Get players in a game room
  getPlayersByRoomId: (roomId) => {
    return api.get(`/game-players/room/${roomId}`);
  },
};

// Export all API services
export default {
  gameRoomApi,
  roundsApi,
  songsApi,
  playerAnswersApi,
  gamePlayersApi,
};
