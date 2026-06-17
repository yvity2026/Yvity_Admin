import { createAdminClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import { escapeIlike } from "@/lib/search/escapeIlike";
import { hasPermission } from "@/lib/admin/permissions";
import { mapAdvisorReviewRow } from "@/lib/admin/advisor-reviews/mapAdvisorReviewRecord";
import {
  attachReportsToReviews,
  fetchSupabaseReportsByReviewIds,
} from "@/lib/admin/advisor-reviews/attachReportContext";
import {
  listLocalAdvisorReviews,
  updateLocalAdvisorReview,
  useLocalAdvisorReviews,
} from "@/lib/local-data/advisor-reviews";
import { NextResponse } from "next/server";


async function resolveAdvisorIds(supabase, query) {
  const term = escapeIlike(query.trim());
  if (!term) return null;

  const like = `%${term}%`;
  const ids = new Set();

  if (/^[0-9a-f-]{8,36}$/i.test(term)) {
    ids.add(term);
  }

  const { data: users } = await supabase
    .from("users")
    .select("id, name")
    .or(`name.ilike.${like},city.ilike.${like}`);

  for (const row of users || []) {
    if (row.id) ids.add(row.id);
  }

  return Array.from(ids);
}

async function attachAdvisorContext(supabase, rows = []) {
  const advisorIds = [...new Set(rows.map((row) => row.advisor_id).filter(Boolean))];
  if (!advisorIds.length) {
    return rows.map((row) => mapAdvisorReviewRow(row));
  }

  const [{ data: advisors }, { data: profiles }] = await Promise.all([
    supabase.from("users").select("id, name, city").in("id", advisorIds),
    supabase
      .from("advisor_profiles")
      .select("advisor_id, profile_slug, designation, subscription_plan")
      .in("advisor_id", advisorIds),
  ]);

  const advisorById = new Map((advisors || []).map((row) => [row.id, row]));
  const profileByAdvisor = new Map((profiles || []).map((row) => [row.advisor_id, row]));

  return rows.map((row) =>
    mapAdvisorReviewRow(row, {
      advisor: advisorById.get(row.advisor_id) || null,
      profile: profileByAdvisor.get(row.advisor_id) || null,
    }),
  );
}

async function resolveAdvisorIdsByPlan(supabase, plan) {
  if (!plan || plan === "all") return null;

  const { data } = await supabase
    .from("advisor_profiles")
    .select("advisor_id")
    .eq("subscription_plan", plan);

  return (data || []).map((row) => row.advisor_id).filter(Boolean);
}

async function fetchOverview(supabase) {
  const [totalRes, reportedRes, hiddenRes, pendingRes] = await Promise.all([
    supabase.from("advisor_testimonials").select("*", { count: "exact", head: true }),
    supabase
      .from("advisor_testimonials")
      .select("*", { count: "exact", head: true })
      .gt("reported_count", 0),
    supabase
      .from("advisor_testimonials")
      .select("*", { count: "exact", head: true })
      .eq("admin_visibility", "hidden"),
    supabase
      .from("advisor_testimonials")
      .select("*", { count: "exact", head: true })
      .gt("reported_count", 0)
      .eq("admin_visibility", "public"),
  ]);

  const reported = reportedRes.error ? 0 : reportedRes.count || 0;
  const hidden = hiddenRes.error ? 0 : hiddenRes.count || 0;
  const pending = pendingRes.error ? 0 : pendingRes.count || 0;

  return {
    totalReviews: totalRes.count || 0,
    reportedReviews: reported,
    hiddenReviews: hidden,
    pendingActionReviews: pending,
    attention: {
      reported,
      pending,
      hidden,
    },
  };
}

async function resolveReviewIdsByReason(supabase, reason) {
  if (!reason || reason === "all") return null;

  const { data, error } = await supabase
    .from("platform_complaints")
    .select("entity_id")
    .eq("entity_type", "advisor_testimonial")
    .eq("reason", reason);

  if (error) return null;
  return (data || []).map((row) => row.entity_id).filter(Boolean);
}

function applyQueueFilter(query, queue) {
  if (queue === "reported") {
    return query.gt("reported_count", 0);
  }
  if (queue === "hidden") {
    return query.eq("admin_visibility", "hidden");
  }
  if (queue === "pending") {
    return query.gt("reported_count", 0).eq("admin_visibility", "public");
  }
  if (queue === "resolved") {
    return query.or("admin_visibility.eq.hidden,admin_reviewed_at.not.is.null");
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
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "10", 10), 1), 50);
    const q = (searchParams.get("q") || "").trim();
    const queue = searchParams.get("queue") || "reported";
    const reason = searchParams.get("reason") || "all";
    const type = searchParams.get("type") || "all";
    const reply = searchParams.get("reply") || "all";
    const plan = searchParams.get("plan") || "all";

    if (useLocalAdvisorReviews()) {
      return NextResponse.json(
        listLocalAdvisorReviews({ page, limit, q, queue, reason, type, reply, plan }),
      );
    }

    const supabase = createAdminClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const overview = await fetchOverview(supabase);
    const searchAdvisorIds = q ? await resolveAdvisorIds(supabase, q) : null;
    const planAdvisorIds = await resolveAdvisorIdsByPlan(supabase, plan);
    const reasonReviewIds = await resolveReviewIdsByReason(supabase, reason);

    let query = supabase
      .from("advisor_testimonials")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (q) {
      const term = escapeIlike(q);
      const like = `%${term}%`;
      if (searchAdvisorIds?.length) {
        query = query.or(
          `name.ilike.${like},content.ilike.${like},advisor_id.in.(${searchAdvisorIds.join(",")})`,
        );
      } else {
        query = query.or(`name.ilike.${like},content.ilike.${like}`);
      }
    }

    query = applyQueueFilter(query, queue);

    if (reasonReviewIds) {
      if (!reasonReviewIds.length) {
        return NextResponse.json({
          success: true,
          overview,
          attention: overview.attention,
          data: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
          meta: { source: "supabase" },
        });
      }
      query = query.in("id", reasonReviewIds);
    }

    if (type !== "all") {
      query = query.eq("testimonial_type", type);
    }

    if (reply === "with_reply") {
      query = query.not("reply_text", "is", null).neq("reply_text", "");
    } else if (reply === "without_reply") {
      query = query.or("reply_text.is.null,reply_text.eq.");
    }

    if (planAdvisorIds?.length) {
      query = query.in("advisor_id", planAdvisorIds);
    } else if (plan !== "all") {
      return NextResponse.json({
        success: true,
        overview,
        attention: overview.attention,
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        meta: { source: "supabase" },
      });
    }

    let result = await query.range(from, to);

    if (result.error && /risk_score|reported_count|admin_visibility|admin_reviewed_at/i.test(result.error.message || "")) {
      let fallbackQuery = supabase
        .from("advisor_testimonials")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (q) {
        const term = escapeIlike(q);
        fallbackQuery = fallbackQuery.or(`name.ilike.%${term}%,content.ilike.%${term}%`);
      }
      if (type !== "all") {
        fallbackQuery = fallbackQuery.eq("testimonial_type", type);
      }

      result = await fallbackQuery.range(from, to);
      overview.reportedReviews = 0;
      overview.hiddenReviews = 0;
      overview.pendingActionReviews = 0;
      overview.attention = { reported: 0, pending: 0, hidden: 0 };
    }

    if (result.error) {
      console.error("GET /api/admin/advisor-testimonials failed:", result.error);
      return NextResponse.json(
        { error: "Unable to load advisor reviews", details: result.error.message },
        { status: 500 },
      );
    }

    const mapped = await attachAdvisorContext(supabase, result.data || []);
    const reportsByReview = await fetchSupabaseReportsByReviewIds(
      supabase,
      mapped.map((row) => row.id),
    );
    const enriched = attachReportsToReviews(mapped, reportsByReview);

    return NextResponse.json({
      success: true,
      overview,
      attention: overview.attention,
      data: enriched,
      pagination: {
        page,
        limit,
        total: result.count || 0,
        totalPages: Math.ceil((result.count || 0) / limit),
      },
      meta: { source: "supabase" },
    });
  } catch (error) {
    console.error("GET /api/admin/advisor-testimonials failed:", error);
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

    if (!hasPermission(admin, "moderate_advisor_testimonials")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const reviewId = String(body?.reviewId || "").trim();
    const action = String(body?.action || "").trim().toLowerCase();
    const note = String(body?.note || body?.adminNote || "").trim();

    if (!reviewId) {
      return NextResponse.json({ error: "reviewId is required" }, { status: 400 });
    }

    if (!["hide", "restore", "remove", "save_note"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (useLocalAdvisorReviews()) {
      const updates = {
        admin_reviewed_at: new Date().toISOString(),
        admin_reviewed_by: admin.id,
      };

      if (action === "hide") updates.admin_visibility = "hidden";
      if (action === "restore") updates.admin_visibility = "public";
      if (action === "remove") updates.admin_visibility = "removed";
      if (action === "save_note" && note) updates.admin_note = note;

      const data = updateLocalAdvisorReview(reviewId, updates);
      return NextResponse.json({ success: true, data });
    }

    const supabase = createAdminClient();
    const updates = {
      admin_reviewed_at: new Date().toISOString(),
      admin_reviewed_by: admin.id,
    };

    if (action === "hide") updates.admin_visibility = "hidden";
    if (action === "restore") updates.admin_visibility = "public";
    if (action === "remove") updates.admin_visibility = "removed";
    if (action === "save_note" && note) updates.admin_note = note;

    const { data, error } = await supabase
      .from("advisor_testimonials")
      .update(updates)
      .eq("id", reviewId)
      .select("id, admin_visibility, admin_note, admin_reviewed_at")
      .single();

    if (error) {
      console.error("Failed to moderate advisor review", error);
      return NextResponse.json(
        { error: "Failed to update advisor review", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("POST /api/admin/advisor-testimonials failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
