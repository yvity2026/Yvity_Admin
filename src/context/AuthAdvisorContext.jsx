"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [advisor, setAdvisor] = useState(null);
  const [services, setServices] = useState(null)
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

        // if user is an advisor, fetch advisor-specific info
        if (Array.isArray(currentUser?.roles) && currentUser.roles.includes("advisor")) {
          const advResponse = await fetch("/api/advisor/auth/me");
          const advResult = await advResponse.json();
          setAdvisor(advResult.data);
        } else {
          setAdvisor(null);
        }

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

  useEffect(() => {
const fetchServices = async () => {
  try {
    const res = await fetch(API);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    setServices(data.services);
  } catch (err) {
    toast.error("Failed to load services");
  }
};

  fetchServices();
}, []);

  return (
    <AuthContext.Provider value={{ user, advisor, setUser, setAdvisor, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}