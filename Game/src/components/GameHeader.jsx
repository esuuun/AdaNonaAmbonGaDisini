import { Menu, UserCircle, LogOut } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "/logo.png";
import { UserContext } from "../context/AuthContext";
import GameSidebar from "./GameSidebar";

function GameHeader() {
  const { user, logout } = useContext(UserContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleNavigateHome = () => {
    navigate("/");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <GameSidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        onNavigate={handleNavigateHome}
      />

      <header className="absolute top-0 left-0 w-full px-4 py-4 flex items-center justify-between z-30 bg-blue-950/20 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Icon */}
          <button
            onClick={handleMenuClick}
            className="text-white hover:text-yellow-400 transition-colors"
          >
            <Menu size={28} />
          </button>
          {/* Logo */}
          <div
            onClick={handleNavigateHome}
            className="ml-10 absolute cursor-pointer group"
          >
            <img
              src={logoImage}
              alt="Logo"
              className="w-20 h-20 rounded-full transition-transform transform group-hover:scale-110"
            />
          </div>
        </div>

        {/* User Profile or Login Button */}
        <div className="relative">
          {user ? (
            <div className="relative">
              {" "}
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2.5 px-2 py-2 text-sm font-bold text-white hover:bg-blue-900/30 rounded-lg transition-colors"
              >
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
                <span className="hidden sm:inline">{user.name}</span>
              </button>
              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg py-1 z-50">
                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-slate-700"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleLoginClick}
              className="flex items-center gap-2.5 px-5 py-2.5 text-sm font-bold text-slate-900 bg-yellow-400 hover:bg-yellow-300 rounded-lg shadow-md transition-colors transform hover:scale-105"
            >
              <UserCircle size={20} />
              <span className="hidden sm:inline">Login</span>
            </button>
          )}
        </div>
      </header>
    </>
  );
}

export default GameHeader;
