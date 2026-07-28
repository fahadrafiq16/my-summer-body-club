import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  AUTH_STORAGE_KEY,
  clearAuthStorage,
  handleUnauthorizedSession,
  installAuthSessionGuards,
  isJwtExpired,
  setUnauthorizedHandler,
} from "../utils/authSession";

const AuthContext = createContext({
  isAuthenticated: false,
  token: null,
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setToken(null);
    setUser(null);
    clearAuthStorage();
  };

  useEffect(() => {
    installAuthSessionGuards();
    setUnauthorizedHandler(() => {
      setToken(null);
      setUser(null);
    });

    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.token && !isJwtExpired(parsed.token)) {
          setToken(parsed.token);
          setUser(parsed.user || null);
        } else if (parsed?.token) {
          // Expired token in storage — clear silently and stay logged out
          clearAuthStorage();
        }
      }
    } catch (err) {
      console.error("Failed to read auth storage:", err);
      clearAuthStorage();
    } finally {
      setLoading(false);
    }

    return () => setUnauthorizedHandler(null);
  }, []);

  const login = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        token: authToken,
        user: authUser,
        timestamp: Date.now(),
      })
    );
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      token,
      user,
      loading,
      login,
      logout,
      handleUnauthorized: handleUnauthorizedSession,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
