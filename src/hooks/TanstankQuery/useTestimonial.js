import { useQuery } from "@tanstack/react-query";

async function fetchTestimonials(page) {
  const res = await fetch(
    `/api/admin/testimonials?page=${page}&limit=10`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch testimonials");
  }

  return res.json();
}

// ── TanStack Hook ──────────────────────────────────────
export function useTestimonials(page) {
  return useQuery({
    queryKey: ["testimonials", page],

    queryFn: () => fetchTestimonials(page),

    staleTime: 1000 * 60 * 5,

    refetchOnWindowFocus: false,
  });
}