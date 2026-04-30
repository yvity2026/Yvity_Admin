/**
 * useRecommendation Hook
 * Manages recommendation submission for advisors
 */

import { useState, useCallback } from "react";

export const useRecommendation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Submit recommendation for advisor
   * For authenticated advisors only
   */
  const submitRecommendation = useCallback(async (recommendations) => {
    try {
      setLoading(true);
      setError(null);

      if (!Array.isArray(recommendations) || recommendations.length === 0) {
        throw new Error("At least one recommendation is required");
      }

      const filteredRecs = recommendations.filter((rec) => rec && rec.trim());
      if (filteredRecs.length === 0) {
        throw new Error("At least one valid recommendation is required");
      }

      const response = await fetch("/api/advisor/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recommendations: filteredRecs,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit recommendation");
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      const errorMsg = err.message || "Failed to submit recommendation";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Submit public recommendation (user recommendation for advisor)
   * No authentication required
   */
  const submitPublicRecommendation = useCallback(
    async (advisorId, { recommendations, mobileNumber, email, name }) => {
      try {
        setLoading(true);
        setError(null);

        if (!advisorId) {
          throw new Error("Advisor ID is required");
        }

        if (!Array.isArray(recommendations) || recommendations.length === 0) {
          throw new Error("At least one recommendation is required");
        }

        const filteredRecs = recommendations.filter((rec) => rec && rec.trim());
        if (filteredRecs.length === 0) {
          throw new Error("At least one valid recommendation is required");
        }

        const response = await fetch(
          `/api/public/advisor/${advisorId}/recommendations`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              recommendations: filteredRecs,
              mobileNumber: mobileNumber || undefined,
              email: email || undefined,
              name: name || undefined,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to submit recommendation"
          );
        }

        const data = await response.json();
        return data.data;
      } catch (err) {
        const errorMsg = err.message || "Failed to submit recommendation";
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Fetch recommendations for advisor
   */
  const fetchRecommendations = useCallback(async (advisorId) => {
    try {
      setLoading(true);
      setError(null);

      if (!advisorId) {
        throw new Error("Advisor ID is required");
      }

      const response = await fetch(
        `/api/public/advisor/${advisorId}/recommendations`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch recommendations";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    submitRecommendation,
    submitPublicRecommendation,
    fetchRecommendations,
  };
};
