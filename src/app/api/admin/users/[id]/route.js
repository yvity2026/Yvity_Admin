import { createAdminClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import {
  mapAccountStatus,
  mapPlan,
  mapUserRow,
  mapUserType,
  maskEmail,
  maskPhone,
  shortUserId,
} from "@/lib/admin/users/mapUserRecord";
import {
  getLocalUser,
  updateLocalUser,
  useLocalUsers,
} from "@/lib/local-data/users";
import { NextResponse } from "next/server";

function formatRelativeTime(iso) {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - then);
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function buildActivityTimeline({ user, payments = [], recommendations = [] }) {
  const items = [];

  if (user.created_at) {
    items.push({
      id: "registered",
      title: "User registered",
      detail: user.city ? `Joined from ${user.city}` : "Account created",
      at: user.created_at,
      tone: "success",
    });
  }

  for (const payment of payments) {
    items.push({
      id: `payment-${payment.id}`,
      title: `${(payment.plan_id || "Plan").charAt(0).toUpperCase() + (payment.plan_id || "plan").slice(1)} plan upgraded`,
      detail: payment.paid_at ? formatRelativeTime(payment.paid_at) : "Subscription payment",
      at: payment.paid_at || payment.created_at,
      tone: payment.plan_id === "gold" ? "gold" : "success",
    });
  }

  for (const rec of recommendations) {
    items.push({
      id: `rec-${rec.id}`,
      title: "Recommendation given",
      detail: "Advisor recommendation submitted",
      at: rec.created_at,
      tone: "info",
    });
  }

  if (user.last_login_at) {
    items.push({
      id: "login",
      title: "Last login",
      detail: formatRelativeTime(user.last_login_at),
      at: user.last_login_at,
      tone: "info",
    });
  }

  return items
    .filter((item) => item.at)
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 8)
    .map((item) => ({
      ...item,
      time: formatRelativeTime(item.at),
    }));
}

export async function GET(_req, { params }) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await params;
    if (!userId) {
      return NextResponse.json({ error: "User id required" }, { status: 400 });
    }

    if (useLocalUsers()) {
      const localUser = getLocalUser(userId);
      if (!localUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: localUser });
    }

    const supabase = createAdminClient();

    const { data: user, error } = await supabase
      .from("users")
      .select(
        `
        *,
        advisor:advisor_profiles(
          id,
          advisor_id,
          subscription_plan,
          subscription_activated_at,
          subscription_expires_at,
          account_status,
          profile_status,
          profile_slug,
          created_at,
          updated_at
        )
      `,
      )
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("GET /api/admin/users/[id] failed:", error);
      return NextResponse.json(
        { error: "Unable to load user", details: error.message },
        { status: 500 },
      );
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const advisor = Array.isArray(user.advisor) ? user.advisor[0] : user.advisor;
    const userType = mapUserType(advisor);
    const status = mapAccountStatus(user.account_status || "active");

    const { data: services } = await supabase
      .from("advisor_services")
      .select("service_type, company, experience_years")
      .eq("advisor_id", userId);

    const userWithServices = { ...user, services: services || [] };

    const [
      savedProfilesRes,
      recommendationsRes,
      platformReviewsRes,
      advisorReviewsRes,
      paymentsRes,
      profileViewsRes,
    ] = await Promise.all([
      supabase
        .from("saved_profiles")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("advisor_recommendations")
        .select("id, created_at", { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("yvity_testimonials")
        .select("*", { count: "exact", head: true })
        .eq("name", user.name || ""),
      supabase
        .from("advisor_testimonials")
        .select("*", { count: "exact", head: true })
        .eq("advisor_id", userId),
      supabase
        .from("advisor_payments")
        .select("id, amount, plan_id, paid_at, created_at, status")
        .eq("user_id", userId)
        .eq("status", "paid")
        .order("paid_at", { ascending: false })
        .limit(8),
      advisor?.id
        ? supabase
            .from("advisor_profile_stats")
            .select("*", { count: "exact", head: true })
            .eq("profile_id", advisor.id)
        : Promise.resolve({ count: 0 }),
    ]);

    const payments = paymentsRes.data || [];
    const recommendations = recommendationsRes.data || [];

    const activity = buildActivityTimeline({
      user,
      payments,
      recommendations,
    });

    const listRow = mapUserRow(userWithServices);

    return NextResponse.json({
      success: true,
      data: {
        ...listRow,
        shortId: shortUserId(user.id),
        phoneMasked: maskPhone(user),
        emailMasked: maskEmail(user),
        statusLabel: status.label,
        statusTone: status.tone,
        userTypeLabel: userType.label,
        profileSlug: advisor?.profile_slug || null,
        advisorAccountStatus: advisor?.account_status || null,
        subscription: userType.key === "professional"
          ? {
              currentPlan: mapPlan(advisor),
              planKey: advisor?.subscription_plan || "free",
              startDate: advisor?.subscription_activated_at || null,
              expiryDate: advisor?.subscription_expires_at || null,
              upgradeHistory: payments.map((payment) => ({
                id: payment.id,
                plan: payment.plan_id,
                amount: (Number(payment.amount) || 0) / 100,
                paidAt: payment.paid_at || payment.created_at,
              })),
            }
          : null,
        activitySummary: {
          savedProfiles: savedProfilesRes.count || 0,
          recommendationsGiven: recommendationsRes.count ?? recommendations.length ?? 0,
          reviewsSubmitted:
            (platformReviewsRes.count || 0) + (advisorReviewsRes.count || 0),
          profileViews: userType.key === "professional" ? profileViewsRes.count || 0 : null,
        },
        activity,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/users/[id] failed:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await params;
    if (!userId) {
      return NextResponse.json({ error: "User id required" }, { status: 400 });
    }

    const body = await req.json();
    const action = String(body?.action || "").trim();

    if (!["suspend", "activate", "delete", "restore"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (useLocalUsers()) {
      const updated = updateLocalUser(userId, action);
      if (!updated) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: { id: userId, accountStatus: updated.account_status },
      });
    }

    const supabase = createAdminClient();
    const now = new Date().toISOString();

    let updates = null;

    if (action === "suspend") {
      updates = {
        account_status: "deactivated",
        account_status_updated_at: now,
        account_status_reason: body?.reason || "Suspended by admin",
      };
    } else if (action === "activate") {
      updates = {
        account_status: "active",
        account_status_updated_at: now,
        deactivated_until: null,
        account_status_reason: null,
      };
    } else if (action === "delete") {
      updates = {
        account_status: "deleted",
        deleted_at: now,
        account_status_updated_at: now,
        account_status_reason: body?.reason || "Deleted by admin",
      };
    } else if (action === "restore") {
      updates = {
        account_status: "active",
        deleted_at: null,
        account_status_updated_at: now,
        account_status_reason: null,
      };
    }

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select("id, account_status")
      .maybeSingle();

    if (error) {
      console.error("PATCH /api/admin/users/[id] failed:", error);
      return NextResponse.json(
        { error: "Unable to update user", details: error.message },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    supabase.from("admin_action_log").insert({
      admin_id: admin.id,
      action,
      entity_type: "user",
      entity_id: data.id,
      reason: body?.reason || null,
    }).then(({ error: logErr }) => {
      if (logErr) console.warn("audit log insert failed:", logErr.message);
    });

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        accountStatus: data.account_status,
      },
    });
  } catch (error) {
    console.error("PATCH /api/admin/users/[id] failed:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
