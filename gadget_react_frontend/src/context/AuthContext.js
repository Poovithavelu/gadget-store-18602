import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

// PUBLIC_INTERFACE
export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: false,
  login: async (_email, _password) => {},
  signup: async (_name, _email, _password) => {},
  logout: () => {},
  refreshProfile: async () => {},
});

/**
 * PUBLIC_INTERFACE
 * Provides authentication context for the app.
 * Persists JWT token in localStorage and fetches user profile.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const me = await api.me();
      setUser(me);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // On mount try to load current profile if token exists
    const token = localStorage.getItem("authToken");
    if (token) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [loadProfile]);

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    if (data && data.access_token) {
      localStorage.setItem("authToken", data.access_token);
      await loadProfile();
    }
    return data;
  }, [loadProfile]);

  const signup = useCallback(async (name, email, password) => {
    const data = await api.signup(name, email, password);
    // Some backends return token on signup, others not.
    if (data && data.access_token) {
      localStorage.setItem("authToken", data.access_token);
      await loadProfile();
    } else {
      // Fallback: auto-login after signup
      try {
        const loginResp = await api.login(email, password);
        if (loginResp?.access_token) {
          localStorage.setItem("authToken", loginResp.access_token);
          await loadProfile();
        }
      } catch {
        // ignore
      }
    }
    return data;
  }, [loadProfile]);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    loading,
    login,
    signup,
    logout,
    refreshProfile: loadProfile,
  }), [user, loading, login, signup, logout, loadProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
