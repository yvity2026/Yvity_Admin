"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

export const DEFAULT_TESTIMONIAL_AUDIENCE = {
  userType: "all",
  city: "all",
  service: "all",
  company: "all",
  plan: "all",
  registeredWithin: "30d",
  registeredFrom: "",
  registeredTo: "",
  sort: "latest",
  limit: 50,
  excludeWithPlatformTestimonial: true,
};

function buildAudienceQuery(filters = {}) {
  const search = new URLSearchParams();

  Object.entries({ ...DEFAULT_TESTIMONIAL_AUDIENCE, ...filters }).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (key === "excludeWithPlatformTestimonial") {
      search.set(key, value ? "true" : "false");
      return;
    }
    search.set(key, String(value));
  });

  return `?${search.toString()}`;
}

async function fetchTestimonialAudience(filters) {
  const res = await fetch(
    `/api/admin/testimonials/request/audience${buildAudienceQuery(filters)}`,
  );
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json?.error || "Failed to preview audience");
  }

  return json;
}

async function sendBulkTestimonialRequest({ filters, message }) {
  const res = await fetch("/api/admin/testimonials/request/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filters, message }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json?.error || "Failed to send bulk requests");
  }

  return json;
}

export function useTestimonialAudiencePreview(filters = DEFAULT_TESTIMONIAL_AUDIENCE) {
  return useQuery({
    queryKey: ["testimonial-audience-preview", filters],
    queryFn: () => fetchTestimonialAudience(filters),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
}

export function useBulkTestimonialRequest() {
  return useMutation({
    mutationFn: sendBulkTestimonialRequest,
  });
}
