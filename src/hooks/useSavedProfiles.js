import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for managing saved advisor profiles
 * Handles save, remove, check, and list operations
 */
export function useSavedProfiles() {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Save an advisor profile
   * @param {string} advisorProfileId - The advisor profile ID to save
   * @returns {Promise<Object>} - Response data
   */
  const saveProfile = useCallback(async (advisorProfileId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/advisor/saved-profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ advisorProfileId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save profile");
      }

      setIsSaved(true);
      return { success: true, data, message: data.message };
    } catch (err) {
      const errorMessage = err.message || "Failed to save profile";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Remove a saved advisor profile
   * @param {string} advisorProfileId - The advisor profile ID to remove
   * @returns {Promise<Object>} - Response data
   */
  const removeProfile = useCallback(async (advisorProfileId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/advisor/saved-profiles/${advisorProfileId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove profile");
      }

      setIsSaved(false);
      return { success: true, data, message: data.message };
    } catch (err) {
      const errorMessage = err.message || "Failed to remove profile";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Check if a profile is saved
   * @param {string} advisorProfileId - The advisor profile ID to check
   * @returns {Promise<Object>} - { isSaved, error }
   */
  const checkSaveStatus = useCallback(async (advisorProfileId) => {
    try {
      const response = await fetch(
        `/api/advisor/saved-profiles/check/${advisorProfileId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to check save status");
      }

      setIsSaved(data.data.isSaved);
      return { isSaved: data.data.isSaved, error: null };
    } catch (err) {
      const errorMessage = err.message || "Failed to check save status";
      setError(errorMessage);
      return { isSaved: false, error: errorMessage };
    }
  }, []);

  /**
   * Toggle save/unsave status
   * @param {string} advisorProfileId - The advisor profile ID to toggle
   * @returns {Promise<Object>} - Response data
   */
  const toggleSaveProfile = useCallback(
    async (advisorProfileId) => {
      if (isSaved) {
        return removeProfile(advisorProfileId);
      } else {
        return saveProfile(advisorProfileId);
      }
    },
    [isSaved, saveProfile, removeProfile]
  );

  return {
    isSaved,
    isLoading,
    error,
    saveProfile,
    removeProfile,
    checkSaveStatus,
    toggleSaveProfile,
    setIsSaved, // Allow external control if needed
  };
}

/**
 * Custom hook for fetching saved profiles with pagination
 */
export function useFetchSavedProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfiles = useCallback(async (page = 1, limit = 10) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/advisor/saved-profiles?page=${page}&limit=${limit}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch saved profiles");
      }

      setProfiles(data.data || []);
      setPagination(data.pagination);
      return { success: true, data: data.data, pagination: data.pagination };
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch saved profiles";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const goToPage = useCallback(
    async (page, limit = 10) => {
      return fetchProfiles(page, limit);
    },
    [fetchProfiles]
  );

  const nextPage = useCallback(async () => {
    if (pagination?.hasNextPage) {
      return goToPage(pagination.currentPage + 1);
    }
  }, [pagination, goToPage]);

  const previousPage = useCallback(async () => {
    if (pagination?.hasPreviousPage) {
      return goToPage(pagination.currentPage - 1);
    }
  }, [pagination, goToPage]);

  return {
    profiles,
    pagination,
    isLoading,
    error,
    fetchProfiles,
    goToPage,
    nextPage,
    previousPage,
    refetch: fetchProfiles,
  };
}
