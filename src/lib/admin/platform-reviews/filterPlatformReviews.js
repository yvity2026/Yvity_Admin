export function filterPlatformReviewRows(rows = [], params = {}) {
  let filtered = [...rows];
  const q = (params.q || "").trim().toLowerCase();

  if (q) {
    filtered = filtered.filter(
      (row) =>
        row.reviewerName.toLowerCase().includes(q) ||
        row.profession.toLowerCase().includes(q) ||
        row.city.toLowerCase().includes(q) ||
        row.preview.toLowerCase().includes(q),
    );
  }

  const queue = params.queue || "all";
  if (queue === "pending") {
    filtered = filtered.filter((row) => row.status === "pending");
  } else if (queue === "published") {
    filtered = filtered.filter((row) => row.status === "published");
  } else if (queue === "hidden") {
    filtered = filtered.filter((row) => row.status === "hidden");
  } else if (queue === "attention") {
    filtered = filtered.filter((row) => row.status === "pending");
  }

  if (params.status && params.status !== "all") {
    filtered = filtered.filter((row) => row.status === params.status);
  }

  if (params.type && params.type !== "all") {
    filtered = filtered.filter((row) => row.type === params.type);
  }

  if (params.respondent === "customer") {
    filtered = filtered.filter((row) => row.respondentType === "customer");
  } else if (params.respondent === "professional") {
    filtered = filtered.filter((row) => row.respondentType === "advisor");
  }

  if (params.rating && params.rating !== "all") {
    const ratingValue = parseInt(params.rating, 10);
    if (ratingValue >= 1 && ratingValue <= 5) {
      filtered = filtered.filter((row) => row.rating === ratingValue);
    }
  }

  return filtered;
}

export function paginatePlatformRows(rows, page = 1, limit = 10) {
  const safePage = Math.max(parseInt(page, 10) || 1, 1);
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
  const from = (safePage - 1) * safeLimit;

  return {
    data: rows.slice(from, from + safeLimit),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total: rows.length,
      totalPages: Math.ceil(rows.length / safeLimit) || 0,
    },
  };
}

export function computePlatformOverview(rows = []) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const ratings = rows.map((row) => row.rating).filter((value) => value > 0);
  const averageRating = ratings.length
    ? Number((ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1))
    : 0;

  return {
    totalReviews: rows.length,
    averageRating,
    pendingReviews: rows.filter((row) => row.status === "pending").length,
    publishedReviews: rows.filter((row) => row.status === "published").length,
    hiddenReviews: rows.filter((row) => row.status === "hidden").length,
    textReviews: rows.filter((row) => row.type === "text").length,
    audioReviews: rows.filter((row) => row.type === "audio").length,
    videoReviews: rows.filter((row) => row.type === "video").length,
    withPlatformReply: rows.filter((row) => row.hasPlatformReply).length,
    newToday: rows.filter((row) => {
      const created = new Date(row.submittedAt);
      return created >= startOfDay;
    }).length,
    attention: {
      pendingReview: rows.filter((row) => row.status === "pending").length,
      awaitingReply: rows.filter((row) => row.isPublished && !row.hasPlatformReply).length,
    },
  };
}
