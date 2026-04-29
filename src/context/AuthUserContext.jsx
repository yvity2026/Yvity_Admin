"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [advisor, setAdvisor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);

        // fetch general user info
        const response = await fetch("/api/auth/me");
        const result = await response.json();
        const currentUser = result.data;
        setUser(currentUser);

        let advisorData = null

        try {
          const advRes = await fetch("/api/advisor/auth/me");
          if (advRes.ok) {
            const advResult = await advRes.json();
            advisorData = advResult?.data || null;
          } else {
            advisorData = null;
          }
        } catch (err) {
          advisorData = null;
        }
        setAdvisor(advisorData)

      } catch (error) {
        console.error("Auth fetch error:", error);
        setUser(null);
        setAdvisor(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
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