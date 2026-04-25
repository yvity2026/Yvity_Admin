"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJsonWithRetry(url, options = {}, retries = 1) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
        credentials: "include",
        ...options,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || result?.error || `Request failed: ${response.status}`);
      }

      return result;
    } catch (error) {
      lastError = error;

      if (attempt < retries) {
        await wait(300);
      }
    }
  }

  throw lastError;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [advisor, setAdvisor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      try {
        setLoading(true);

        const result = await fetchJsonWithRetry("/api/auth/me");
        const currentUser = result.data;

        if (!isMounted) return;
        setUser(currentUser);

        if (Array.isArray(currentUser?.roles) && currentUser.roles.includes("advisor")) {
          const advResult = await fetchJsonWithRetry("/api/advisor/auth/me");
          if (!isMounted) return;
          setAdvisor(advResult.data);
        } else {
          if (!isMounted) return;
          setAdvisor(null);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Auth fetch error:", error);
        setUser(null);
        setAdvisor(null);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, advisor, setUser, setAdvisor, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
