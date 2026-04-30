/**
 * useTestimonial Hook
 * Manages testimonial submission and media upload
 */

import { useState, useCallback } from "react";

export const useTestimonial = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Upload media file to S3
   * Only required for audio and video testimonials
   */
  const uploadMedia = useCallback(async (file, mediaType) => {
    try {
      setUploading(true);
      setError(null);

      if (!file) {
        throw new Error("File is required");
      }

      if (!["audio", "video"].includes(mediaType)) {
        throw new Error("Invalid media type");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("mediaType", mediaType);

      const response = await fetch("/api/upload/media", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      return data.url;
    } catch (err) {
      const errorMsg = err.message || "Failed to upload media";
      setError(errorMsg);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  /**
   * Submit testimonial to advisor
   * For authenticated advisors only
   */
  const submitTestimonial = useCallback(
    async ({
      testimonialType = "text",
      content,
      mediaUrl = null,
      rating = 5,
    }) => {
      try {
        setLoading(true);
        setError(null);

        if (!content || !content.trim()) {
          throw new Error("Content is required");
        }

        const response = await fetch("/api/advisor/testimonials", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            testimonialType,
            content: content.trim(),
            mediaUrl,
            rating: Number(rating),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to submit testimonial");
        }

        const data = await response.json();
        return data.data;
      } catch (err) {
        const errorMsg = err.message || "Failed to submit testimonial";
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Submit public testimonial (user testimonial for advisor)
   */
  const submitPublicTestimonial = useCallback(
    async (advisorId, {
      name,
      mobileNumber,
      testimonialType = "text",
      content,
      mediaUrl = null,
      testimonialRating = 5,
    }) => {
      try {
        setLoading(true);
        setError(null);

        if (!advisorId) {
          throw new Error("Advisor ID is required");
        }

        if (!name || !name.trim()) {
          throw new Error("Name is required");
        }

        if (!mobileNumber || !mobileNumber.trim()) {
          throw new Error("Mobile number is required");
        }

        if (!content || !content.trim()) {
          throw new Error("Content is required");
        }

        const response = await fetch(
          `/api/public/advisor/${advisorId}/testimonials`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name.trim(),
              mobileNumber: mobileNumber.trim(),
              testimonialType,
              content: content.trim(),
              mediaUrl,
              testimonialRating: Number(testimonialRating),
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to submit testimonial"
          );
        }

        const data = await response.json();
        return data.data;
      } catch (err) {
        const errorMsg = err.message || "Failed to submit testimonial";
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    uploading,
    error,
    uploadMedia,
    submitTestimonial,
    submitPublicTestimonial,
  };
};
