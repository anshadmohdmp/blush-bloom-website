import { createContext, useState, useEffect, useRef } from "react";
import {jwtDecode} from "jwt-decode"; // ✅ Correct import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // new loading state
  const inactivityTimer = useRef(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      if (isTokenExpired(storedToken)) {
        logout(); // logs out if token expired
      } else {
        setToken(storedToken);
        autoLogoutWhenTokenExpires(storedToken);
        startInactivityTimer();
      }
    }
    setLoading(false); // ✅ finished loading token

    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);

    return () => {
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      clearTimeout(inactivityTimer.current);
    };
  }, []);

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (err) {
      return true;
    }
  };

  const autoLogoutWhenTokenExpires = (token) => {
    try {
      const decoded = jwtDecode(token);
      const expiryTime = decoded.exp * 1000 - Date.now();
      setTimeout(() => logout(), expiryTime);
    } catch (err) {
      logout();
    }
  };

  const startInactivityTimer = () => {
    clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      logout();
      alert("You have been logged out due to inactivity.");
    }, 15 * 60 * 1000); // 15 minutes
  };

  const resetInactivityTimer = () => {
    if (token) startInactivityTimer();
  };

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    autoLogoutWhenTokenExpires(newToken);
    startInactivityTimer();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    clearTimeout(inactivityTimer.current);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
