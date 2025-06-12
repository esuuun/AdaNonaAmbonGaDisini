// ini context buat user session

import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve user from sessionStorage if available
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData)); // Save user data to sessionStorage
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user"); // Remove user data from sessionStorage
  };

  const isLoggedIn = () => {
    return user !== null;
  };

  useEffect(() => {
    // Load user from sessionStorage on component mount
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  const updateProfileImage = (newImageUrl) => {
    if (user) {
      const updatedUser = { ...user, profileImage: newImageUrl };
      setUser(updatedUser);
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <UserContext.Provider
      value={{ user, login, logout, isLoggedIn, updateProfileImage }}
    >
      {children}
    </UserContext.Provider>
  );
};
