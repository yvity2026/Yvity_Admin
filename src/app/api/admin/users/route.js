import { createAdminClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import { mapUserRow } from "@/lib/admin/users/mapUserRecord";
import { listLocalUsers, useLocalUsers } from "@/lib/local-data/users";
import { NextResponse } from "next/server";

function startOfTodayIso() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function escapeIlike(value) {
  return String(value || "").replace(/[%_,]/g, "");
}

async function getProfessionalUserIds(supabase) {
  const { data, error } = await supabase.from("advisor_profiles").select("advisor_id");

  if (error) {
    console.warn("Failed to load advisor ids:", error.message);
    return [];
  }

  return (data || []).map((row) => row.advisor_id).filter(Boolean);
}

async function getPlanUserIds(supabase, plan) {
  const { data, error } = await supabase
    .from("advisor_profiles")
    .select("advisor_id")
    .eq("subscription_plan", plan);

  if (error) {
    console.warn("Failed to load plan user ids:", error.message);
    return [];
  }

  return (data || []).map((row) => row.advisor_id).filter(Boolean);
}

async function resolveSearchUserIds(supabase, query) {
  const term = escapeIlike(query.trim());
  if (!term) return null;

  const ids = new Set();
  const like = `%${term}%`;

  const { data: serviceMatches } = await supabase
    .from("advisor_services")
    .select("advisor_id")
    .or(`service_type.ilike.${like},company.ilike.${like}`);

  for (const row of serviceMatches || []) {
    if (row.advisor_id) ids.add(row.advisor_id);
  }

  const orParts = [`name.ilike.${like}`, `city.ilike.${like}`, `profession.ilike.${like}`];

  if (/^[0-9a-f-]{8,36}$/i.test(term)) {
    if (term.length === 36) {
      orParts.push(`id.eq.${term}`);
    } else {
      const { data: idMatches } = await supabase
        .from("users")
        .select("id")
        .filter("id", "ilike", `%${term}%`);

      for (const row of idMatches || []) {
        if (row.id) ids.add(row.id);
      }
    }
  }

  const { data: userMatches } = await supabase.from("users").select("id").or(orParts.join(","));

  for (const row of userMatches || []) {
    if (row.id) ids.add(row.id);
  }

  return Array.from(ids);
}

async function attachServices(supabase, rows = []) {
  const userIds = rows.map((row) => row.id).filter(Boolean);
  if (!userIds.length) return rows;

  const { data: services } = await supabase
    .from("advisor_services")
    .select("advisor_id, service_type, company")
    .in("advisor_id", userIds);

  const servicesByUser = new Map();

  for (const service of services || []) {
    const existing = servicesByUser.get(service.advisor_id) || [];
    existing.push(service);
    servicesByUser.set(service.advisor_id, existing);
  }

  return rows.map((row) => ({
    ...row,
    services: servicesByUser.get(row.id) || [],
  }));
}

async function fetchOverview(supabase) {
  const todayIso = startOfTodayIso();
  const professionalIds = await getProfessionalUserIds(supabase);
  const totalProfessionals = professionalIds.length;

  const [
    totalUsersRes,
    activeUsersRes,
    suspendedUsersRes,
    usersTodayRes,
    advisorsTodayRes,
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("account_status", "active"),
    supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("account_status", "deactivated"),
    supabase.from("users").select("*", { count: "exact", head: true }).gte("created_at", todayIso),
    supabase
      .from("advisor_profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayIso),
  ]);

  const totalUsers = totalUsersRes.count || 0;

  return {
    totalUsers,
    totalProfessionals,
    totalCustomers: Math.max(0, totalUsers - totalProfessionals),
    activeUsers: activeUsersRes.count || 0,
    suspendedUsers: suspendedUsersRes.count || 0,
    registrationsToday: (usersTodayRes.count || 0) + (advisorsTodayRes.count || 0),
  };
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
    const userType = searchParams.get("userType") || "all";
    const status = searchParams.get("status") || "all";
    const plan = searchParams.get("plan") || "all";
    const registeredFrom = searchParams.get("registeredFrom") || "";
    const registeredTo = searchParams.get("registeredTo") || "";

    if (useLocalUsers()) {
      return NextResponse.json(
        listLocalUsers({
          page,
          limit,
          q,
          userType,
          status,
          plan,
          registeredFrom,
          registeredTo,
        }),
      );
    }

    const supabase = createAdminClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const overview = await fetchOverview(supabase);
    const searchIds = q ? await resolveSearchUserIds(supabase, q) : null;

    if (searchIds && searchIds.length === 0) {
      return NextResponse.json({
        success: true,
        overview,
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      });
    }

    const useInnerAdvisor = userType === "professional" || (plan !== "all" && userType !== "customer");
    const advisorJoin = useInnerAdvisor ? "advisor_profiles!inner" : "advisor_profiles";

    let query = supabase
      .from("users")
      .select(
        `
        *,
        advisor:${advisorJoin}(
          id,
          advisor_id,
          subscription_plan,
          subscription_activated_at,
          subscription_expires_at,
          account_status
        )
      `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false });

    if (searchIds) {
      query = query.in("id", searchIds);
    }

    if (userType === "customer") {
      const professionalIds = await getProfessionalUserIds(supabase);
      if (professionalIds.length > 0) {
        query = query.not("id", "in", professionalIds);
      }
    }

    if (plan !== "all" && userType !== "customer") {
      const planUserIds = await getPlanUserIds(supabase, plan);
      if (!planUserIds.length) {
        return NextResponse.json({
          success: true,
          overview,
          data: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
        });
      }
      query = query.in("id", planUserIds);
    }

    if (status === "active") {
      query = query.eq("account_status", "active");
    } else if (status === "suspended") {
      query = query.eq("account_status", "deactivated");
    } else if (status === "deleted") {
      query = query.eq("account_status", "deleted");
    } else {
      query = query.in("account_status", ["active", "deactivated", "deleted"]);
    }

    if (registeredFrom) {
      query = query.gte("created_at", registeredFrom);
    }

    if (registeredTo) {
      query = query.lte("created_at", `${registeredTo}T23:59:59.999Z`);
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
      console.error("GET /api/admin/users failed:", error);
      return NextResponse.json(
        { error: "Unable to load users", details: error.message },
        { status: 500 },
      );
    }

    let rows = data || [];

    if (userType === "customer") {
      rows = rows.filter((row) => {
        const advisor = Array.isArray(row.advisor) ? row.advisor[0] : row.advisor;
        return !advisor?.id;
      });
    }

    const rowsWithServices = await attachServices(supabase, rows);

    return NextResponse.json({
      success: true,
      overview,
      data: rowsWithServices.map(mapUserRow),
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/users failed:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
