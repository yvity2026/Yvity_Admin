"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { SidebarProvider } from "./SidebarContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const response = await fetch("/api/auth/me");
        const result = await response.json();

        if (response.ok && result?.success && result?.data) {
          setAdmin(result.data);
        } else {
          setAdmin(null);
        }
      } catch (error) {
        console.error("Auth fetch error:", error);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ admin, setAdmin, loading, setLoading }}>
      <SidebarProvider>{children}</SidebarProvider>
    </AuthContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AuthContext);
}
