import { createAdminClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import {
  computePlatformOverview,
  filterPlatformReviewRows,
  paginatePlatformRows,
} from "@/lib/admin/platform-reviews/filterPlatformReviews";
import { mapPlatformReviewRow } from "@/lib/admin/platform-reviews/mapPlatformReviewRecord";
import {
  listLocalPlatformReviews,
  updateLocalPlatformReview,
  useLocalPlatformReviews,
} from "@/lib/local-data/platform-reviews";
import { NextResponse } from "next/server";

function escapeIlike(value) {
  return String(value || "").replace(/[%_,]/g, "");
}

function mapStatusFilter(status) {
  if (status === "published") return ["approved"];
  if (status === "hidden") return ["hidden", "rejected"];
  if (status === "pending") return ["pending", "submitted"];
  return null;
}

async function fetchSupabaseOverview(supabase) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [
    totalRes,
    pendingRes,
    publishedRes,
    hiddenRes,
    textRes,
    audioRes,
    videoRes,
    todayRes,
    replyRes,
    ratingsRes,
  ] = await Promise.all([
    supabase.from("yvity_testimonials").select("*", { count: "exact", head: true }),
    supabase
      .from("yvity_testimonials")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending", "submitted"]),
    supabase
      .from("yvity_testimonials")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved"),
    supabase
      .from("yvity_testimonials")
      .select("*", { count: "exact", head: true })
      .in("status", ["hidden", "rejected"]),
    supabase
      .from("yvity_testimonials")
      .select("*", { count: "exact", head: true })
      .eq("testimonial_type", "text"),
    supabase
      .from("yvity_testimonials")
      .select("*", { count: "exact", head: true })
      .eq("testimonial_type", "audio"),
    supabase
      .from("yvity_testimonials")
      .select("*", { count: "exact", head: true })
      .eq("testimonial_type", "video"),
    supabase
      .from("yvity_testimonials")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfDay.toISOString()),
    supabase
      .from("yvity_testimonials")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved")
      .not("yvity_reply", "is", null)
      .neq("yvity_reply", ""),
    supabase.from("yvity_testimonials").select("testimonial_rating"),
  ]);

  const ratings = (ratingsRes.data || [])
    .map((row) => Number(row.testimonial_rating) || 0)
    .filter((value) => value > 0);

  return {
    totalReviews: totalRes.count || 0,
    averageRating: ratings.length
      ? Number((ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1))
      : 0,
    pendingReviews: pendingRes.count || 0,
    publishedReviews: publishedRes.count || 0,
    hiddenReviews: hiddenRes.count || 0,
    textReviews: textRes.count || 0,
    audioReviews: audioRes.count || 0,
    videoReviews: videoRes.count || 0,
    withPlatformReply: replyRes.count || 0,
    newToday: todayRes.count || 0,
    attention: {
      pendingReview: pendingRes.count || 0,
      awaitingReply: 0,
    },
  };
}

function applySupabaseFilters(query, params) {
  const q = (params.q || "").trim();
  if (q) {
    const term = escapeIlike(q);
    const like = `%${term}%`;
    query = query.or(`name.ilike.${like},city.ilike.${like},profession.ilike.${like}`);
  }

  const statusValues = mapStatusFilter(params.status);
  if (statusValues) {
    query = query.in("status", statusValues);
  }

  if (params.queue === "pending") {
    query = query.in("status", ["pending", "submitted"]);
  } else if (params.queue === "published") {
    query = query.eq("status", "approved");
  } else if (params.queue === "hidden") {
    query = query.in("status", ["hidden", "rejected"]);
  } else if (params.queue === "attention") {
    query = query.in("status", ["pending", "submitted"]);
  }

  if (params.type && params.type !== "all") {
    query = query.eq("testimonial_type", params.type);
  }

  if (params.respondent === "customer") {
    query = query.eq("respondent_type", "customer");
  } else if (params.respondent === "professional") {
    query = query.eq("respondent_type", "advisor");
  }

  if (params.rating && params.rating !== "all") {
    const ratingValue = parseInt(params.rating, 10);
    if (ratingValue >= 1 && ratingValue <= 5) {
      query = query.eq("testimonial_rating", ratingValue);
    }
  }

  return query;
}

export async function GET(req) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const params = {
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 10,
      q: searchParams.get("q") || "",
      status: searchParams.get("status") || "all",
      queue: searchParams.get("queue") || "all",
      type: searchParams.get("type") || "all",
      respondent: searchParams.get("respondent") || "all",
      rating: searchParams.get("rating") || "all",
    };

    if (useLocalPlatformReviews()) {
      return NextResponse.json(listLocalPlatformReviews(params));
    }

    const supabase = createAdminClient();
    const page = Math.max(parseInt(params.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(params.limit, 10) || 10, 1), 50);
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const overview = await fetchSupabaseOverview(supabase);

    let query = supabase
      .from("yvity_testimonials")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    query = applySupabaseFilters(query, params);

    const { data, error, count } = await query.range(from, to);

    if (error) {
      console.error("GET /api/admin/platform-testimonials failed:", error);
      return NextResponse.json(
        { error: "Unable to load platform reviews", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      overview,
      attention: overview.attention,
      data: (data || []).map(mapPlatformReviewRow),
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/platform-testimonials failed:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const reviewId = String(body?.reviewId || body?.testimonialId || "").trim();
    const action = String(body?.action || "").trim().toLowerCase();
    const reply = String(body?.reply || "").trim();

    if (!reviewId) {
      return NextResponse.json({ error: "reviewId is required" }, { status: 400 });
    }

    if (!["approve", "hide", "restore", "send_reply"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (useLocalPlatformReviews()) {
      const updated = updateLocalPlatformReview(reviewId, { action, reply });
      if (!updated) {
        return NextResponse.json({ error: "Review not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: mapPlatformReviewRow(updated) });
    }

    const supabase = createAdminClient();
    const updates = { updated_at: new Date().toISOString() };

    if (action === "approve" || action === "restore") {
      updates.status = "approved";
    } else if (action === "hide") {
      updates.status = "hidden";
    }

    if ((action === "approve" || action === "send_reply") && reply) {
      updates.yvity_reply = reply;
    }

    const { data, error } = await supabase
      .from("yvity_testimonials")
      .update(updates)
      .eq("id", reviewId)
      .select("*")
      .single();

    if (error) {
      console.error("Failed to update platform review", error);
      return NextResponse.json({ error: "Failed to update platform review" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: mapPlatformReviewRow(data) });
  } catch (error) {
    console.error("POST /api/admin/platform-testimonials failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
