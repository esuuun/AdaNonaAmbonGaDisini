import { Maximize2, Minimize2, Volume2, VolumeX } from "lucide-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Import components
import GameFooter from "./components/GameFooter";
import GameHeader from "./components/GameHeader";
import IntroAnimation from "./components/IntroAnimation";
import PageTransition from "./components/PageTransition";
import QuestionPageTransition from "./components/QuestionPageTransition";
import SolutionPageTransition from "./components/SolutionPageTransition";
import TransitionEffect from "./components/TransitionEffect";

// Import pages
import ErrorPage from "./pages/ErrorPage";
import GameReadyPage from "./pages/GameReadyPage";
import GenreSelectPage from "./pages/GenreSelectPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import QuestionPage from "./pages/QuestionPage";
import ResultsPage from "./pages/ResultsPage";
import SolutionPage from "./pages/SolutionPage";

// Game context to share state between routes
import { UserContext, UserProvider } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";

// HeaderWrapper component to conditionally render the header
const HeaderWrapper = () => {
  const location = useLocation();

  // Define routes where header should be hidden (in-game pages)
  const hideHeaderRoutes = ["/question", "/solution", "/ready"];

  // Check if current path is in the hideHeaderRoutes list
  const shouldShowHeader = !hideHeaderRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return shouldShowHeader ? <GameHeader /> : null;
};

// AppContent component to use context after provider is in place
const AppContent = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const audioRef = useRef(null);
  const location = useLocation();

  // Now this is safe because it's inside a component that renders after UserProvider
  const { user } = useContext(UserContext);

  // Toggle mute
  const toggleMute = () => {
    setIsMuted((prevMuted) => {
      const newMutedStatus = !prevMuted;
      if (audioRef.current) {
        audioRef.current.muted = newMutedStatus;
      }
      return newMutedStatus;
    });
  };

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => {
          console.error(
            `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
          );
        });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false));
      }
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Protected route handling
  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <div
      className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-start p-4 font-sans relative overflow-x-hidden"
      style={{
        backgroundImage:
          'url("https://www.transparenttextures.com/patterns/stardust.png")',
      }}
    >
      {" "}
      <AnimatePresence mode="wait">
        {showIntro && (
          <IntroAnimation onAnimationComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>
      <audio ref={audioRef} muted={isMuted} />{" "}
      <Routes>
        <Route path="*" element={<HeaderWrapper />} />
      </Routes>
      <div className="fixed bottom-5 right-4 flex space-x-2 z-30">
        <button
          onClick={toggleMute}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors shadow-md"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors shadow-md"
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>
      <main className="w-full max-w-4xl mx-auto mt-12 mb-12">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <HomePage />
                </PageTransition>
              }
            />
            <Route
              path="/login"
              element={
                <PageTransition>
                  <LoginPage />
                </PageTransition>
              }
            />
            <Route
              path="/genre"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <GenreSelectPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ready"
              element={
                <ProtectedRoute>
                  <GameReadyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/question"
              element={
                <ProtectedRoute>
                  <QuestionPage audioRef={audioRef} isMuted={isMuted} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/solution"
              element={
                <ProtectedRoute>
                  <SolutionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  <ResultsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/error"
              element={
                <PageTransition>
                  <ErrorPage />
                </PageTransition>
              }
            />
            <Route path="*" element={<Navigate to="/error" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      {/* <GameFooter /> */}
    </div>
  );
};

// Main App component that sets up the router
function App() {
  return (
    <Router>
      <UserProvider>
        <GameProvider>
          <AppContent />
        </GameProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
