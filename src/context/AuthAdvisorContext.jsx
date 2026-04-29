"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext(null);

/**
 * Production-level Auth Provider for Advisor
 * Manages advisor authentication and fetches all section data:
 * - Services, Testimonials, Achievements, Gallery, Journey
 */
export function AuthadvisorProvider({ children }) {
  // Auth states
  const [user, setUser] = useState(null);
  const [advisor, setAdvisor] = useState(null);
  
  // Data states
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [journey, setJourney] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState({
    services: false,
    testimonials: false,
    achievements: false,
    gallery: false,
    journey: false,
  });

  // Error states
  const [errors, setErrors] = useState({
    services: null,
    testimonials: null,
    achievements: null,
    gallery: null,
    journey: null,
  });

  /**
   * Fetch user authentication info
   */
  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);

        // Fetch general user info
        const response = await fetch("/api/auth/me");
        const result = await response.json();
        const currentUser = result.data;
        setUser(currentUser);

        // If user is an advisor, fetch advisor-specific info
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

  /**
   * Fetch services data
   */
  const fetchServices = useCallback(async () => {
    setDataLoading((prev) => ({ ...prev, services: true }));
    setErrors((prev) => ({ ...prev, services: null }));
    
    try {
      const res = await fetch("/api/advisor/services");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch services");
      }

      setServices(Array.isArray(data.services) ? data.services : []);
    } catch (err) {
      console.error("Failed to load services:", err);
      setErrors((prev) => ({ ...prev, services: err.message }));
      setServices([]);
    } finally {
      setDataLoading((prev) => ({ ...prev, services: false }));
    }
  }, []);

  /**
   * Fetch testimonials data
   */
  const fetchTestimonials = useCallback(async () => {
    setDataLoading((prev) => ({ ...prev, testimonials: true }));
    setErrors((prev) => ({ ...prev, testimonials: null }));
    
    try {
      const res = await fetch("/api/advisor/testimonials");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch testimonials");
      }

      setTestimonials(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Failed to load testimonials:", err);
      setErrors((prev) => ({ ...prev, testimonials: err.message }));
      setTestimonials([]);
    } finally {
      setDataLoading((prev) => ({ ...prev, testimonials: false }));
    }
  }, []);

  /**
   * Fetch achievements data
   */
  const fetchAchievements = useCallback(async () => {
    setDataLoading((prev) => ({ ...prev, achievements: true }));
    setErrors((prev) => ({ ...prev, achievements: null }));
    
    try {
      const res = await fetch("/api/advisor/achievements");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch achievements");
      }

      setAchievements(Array.isArray(data.achievements) ? data.achievements : []);
    } catch (err) {
      console.error("Failed to load achievements:", err);
      setErrors((prev) => ({ ...prev, achievements: err.message }));
      setAchievements([]);
    } finally {
      setDataLoading((prev) => ({ ...prev, achievements: false }));
    }
  }, []);

  /**
   * Fetch gallery data
   */
  const fetchGallery = useCallback(async () => {
    setDataLoading((prev) => ({ ...prev, gallery: true }));
    setErrors((prev) => ({ ...prev, gallery: null }));
    
    try {
      const res = await fetch("/api/advisor/gallery");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch gallery");
      }

      setGallery(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Failed to load gallery:", err);
      setErrors((prev) => ({ ...prev, gallery: err.message }));
      setGallery([]);
    } finally {
      setDataLoading((prev) => ({ ...prev, gallery: false }));
    }
  }, []);

  /**
   * Fetch professional journey data
   */
  const fetchJourney = useCallback(async () => {
    setDataLoading((prev) => ({ ...prev, journey: true }));
    setErrors((prev) => ({ ...prev, journey: null }));
    
    try {
      const res = await fetch("/api/advisor/journey");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch journey");
      }

      setJourney(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load journey:", err);
      setErrors((prev) => ({ ...prev, journey: err.message }));
      setJourney([]);
    } finally {
      setDataLoading((prev) => ({ ...prev, journey: false }));
    }
  }, []);

  /**
   * PUBLIC: Fetch advisor data by advisor ID (for viewing public profiles)
   * These functions are used when viewing another advisor's public profile
   */
  
  const fetchPublicAdvisorServices = useCallback(async (advisorId) => {
    if (!advisorId) return [];
    try {
      const res = await fetch(`/api/public/advisor/${advisorId}/services`);
      const data = await res.json();
      return data.success && Array.isArray(data.data) ? data.data : [];
    } catch (err) {
      console.error("Failed to load public services:", err);
      return [];
    }
  }, []);

  const fetchPublicAdvisorTestimonials = useCallback(async (advisorId) => {
    if (!advisorId) return [];
    try {
      const res = await fetch(`/api/public/advisor/${advisorId}/testimonials`);
      const data = await res.json();
      return data.success && Array.isArray(data.data) ? data.data : [];
    } catch (err) {
      console.error("Failed to load public testimonials:", err);
      return [];
    }
  }, []);

  const fetchPublicAdvisorAchievements = useCallback(async (advisorId) => {
    if (!advisorId) return [];
    try {
      const res = await fetch(`/api/public/advisor/${advisorId}/achievements`);
      const data = await res.json();
      return data.success && Array.isArray(data.data) ? data.data : [];
    } catch (err) {
      console.error("Failed to load public achievements:", err);
      return [];
    }
  }, []);

  const fetchPublicAdvisorGallery = useCallback(async (advisorId) => {
    if (!advisorId) return [];
    try {
      const res = await fetch(`/api/public/advisor/${advisorId}/gallery`);
      const data = await res.json();
      return data.success && Array.isArray(data.data) ? data.data : [];
    } catch (err) {
      console.error("Failed to load public gallery:", err);
      return [];
    }
  }, []);

  const fetchPublicAdvisorJourney = useCallback(async (advisorId) => {
    if (!advisorId) return [];
    try {
      const res = await fetch(`/api/public/advisor/${advisorId}/journey`);
      const data = await res.json();
      return data.success && Array.isArray(data.data) ? data.data : [];
    } catch (err) {
      console.error("Failed to load public journey:", err);
      return [];
    }
  }, []);

  /**
   * Fetch all advisor data once advisor is confirmed
   */
  useEffect(() => {
    if (advisor?.id) {
      fetchServices();
      fetchTestimonials();
      fetchAchievements();
      fetchGallery();
      fetchJourney();
    }
  }, [advisor?.id, fetchServices, fetchTestimonials, fetchAchievements, fetchGallery, fetchJourney]);

  // Context value object
  const value = {
    // Auth
    user,
    advisor,
    setUser,
    setAdvisor,
    loading,

    // Data
    services,
    testimonials,
    achievements,
    gallery,
    journey,

    // Loading states
    dataLoading,

    // Errors
    errors,

    // Refetch functions (for authenticated advisor)
    refetchServices: fetchServices,
    refetchTestimonials: fetchTestimonials,
    refetchAchievements: fetchAchievements,
    refetchGallery: fetchGallery,
    refetchJourney: fetchJourney,

    // Public fetch functions (for viewing other advisors' profiles)
    fetchPublicAdvisorServices,
    fetchPublicAdvisorTestimonials,
    fetchPublicAdvisorAchievements,
    fetchPublicAdvisorGallery,
    fetchPublicAdvisorJourney,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use advisor auth context
 */
export function useAdvisorAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error(
      "useAdvisorAuth must be used within AuthadvisorProvider. Make sure your page/layout is wrapped with <AuthadvisorProvider>."
    );
  }
  
  return context;
}