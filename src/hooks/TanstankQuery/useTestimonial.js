import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchTestimonials(page, limit = 10) {
  const res = await fetch(
    `/api/admin/testimonials?page=${page}&limit=${limit}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch testimonials");
  }

  return res.json();
}

// ── TanStack Hook ──────────────────────────────────────
export function useTestimonials(page, limit = 10) {
  return useQuery({
    queryKey: ["testimonials", page, limit],

    queryFn: () => fetchTestimonials(page, limit),

    staleTime: 1000 * 60 * 5,

    refetchOnWindowFocus: false,
  });
}

async function updateTestimonialStatus({ testimonialId, action, reply }) {
  const res = await fetch("/api/admin/testimonials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      testimonialId,
      action,
      reply,
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
    approve: (testimonialId, reply) =>
      mutation.mutateAsync({ testimonialId, action: "approve", reply }),
    reject: (testimonialId) =>
      mutation.mutateAsync({ testimonialId, action: "reject" }),
    sendReply: (testimonialId, reply) =>
      mutation.mutateAsync({ testimonialId, action: "send_reply", reply }),
    isProcessing: mutation.isPending,
  };
}
