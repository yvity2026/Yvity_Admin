import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

async function updateTestimonialStatus({ testimonialId, action }) {
  const res = await fetch("/api/admin/testimonials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      testimonialId,
      action,
    }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json?.error || "Failed to update testimonial");
  }

  return json;
}

export function useTestimonialActions() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateTestimonialStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["testimonials"],
      });
    },
  });

  return {
    approve: (testimonialId) =>
      mutation.mutateAsync({ testimonialId, action: "approve" }),
    reject: (testimonialId) =>
      mutation.mutateAsync({ testimonialId, action: "reject" }),
    isProcessing: mutation.isPending,
  };
}
