import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes module

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Add 'children' to props validation outside the component
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);
