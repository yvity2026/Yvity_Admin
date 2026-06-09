import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { HERO_SLOT_LIMIT, LANDING_SLOT_LIMIT } from "@/lib/admin/visibility/limits";
import {
  listLocalVisibilityControls,
  updateLocalVisibility,
  useLocalVisibilityControls,
} from "@/lib/local-data/visibility-controls";

async function parseAdminSession() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("admin_session")?.value;
  if (!sessionValue) return null;

  try {
    return JSON.parse(sessionValue);
  } catch {
    return null;
  }
}

async function requireAdmin() {
  const session = await parseAdminSession();
  if (!session?.admin_id || !session?.role) return null;
  return session;
}

function parseListParams(searchParams) {
  return {
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 20,
    q: searchParams.get("q") || "",
    slot: searchParams.get("slot") || "all",
  };
}

async function listSupabaseVisibility(params) {
  const supabase = createAdminClient();

  const { data: profiles, error } = await supabase
    .from("advisor_profiles")
    .select(
      "id, advisor_id, designation, profile_slug, subscription_plan, account_status, profile_status, ispublic_profile, is_hero, is_landing, user:users(id, name, city, selfie_url)",
    )
    .eq("account_status", "active")
    .eq("profile_status", true)
    .not("profile_slug", "is", null);

  if (error) {
    throw new Error(error.message || "Unable to load profiles");
  }

  const published = (profiles || []).filter((row) => row.ispublic_profile !== false);
  const heroMembers = published
    .filter((row) => row.is_hero)
    .map((row) => ({
      id: row.id,
      name: row.designation || row.user?.name || "Advisor",
      city: row.user?.city || "—",
    }));
  const landingMembers = published
    .filter((row) => row.is_landing)
    .map((row) => ({
      id: row.id,
      name: row.designation || row.user?.name || "Advisor",
      city: row.user?.city || "—",
    }));

  let rows = published.map((row) => ({
    id: row.id,
    profileId: row.id,
    userId: row.advisor_id,
    profileName: row.designation || row.user?.name || "Advisor",
    userName: row.user?.name || "—",
    city: row.user?.city || "—",
    industry: row.designation || "Insurance",
    plan: String(row.subscription_plan || "free"),
    publicUrl: row.profile_slug ? `/profile/${row.profile_slug}` : null,
    profilePic: row.user?.selfie_url || null,
    isHero: Boolean(row.is_hero),
    isLanding: Boolean(row.is_landing),
    profileStatus: "published",
  }));

  const q = (params.q || "").trim().toLowerCase();
  if (q) {
    rows = rows.filter(
      (row) =>
        row.profileName.toLowerCase().includes(q) ||
        row.userName.toLowerCase().includes(q) ||
        row.city.toLowerCase().includes(q),
    );
  }

  if (params.slot === "hero") rows = rows.filter((row) => row.isHero);
  if (params.slot === "landing") rows = rows.filter((row) => row.isLanding);

  const page = Math.max(Number(params.page) || 1, 1);
  const limit = Math.min(Math.max(Number(params.limit) || 20, 1), 50);
  const from = (page - 1) * limit;

  return {
    success: true,
    overview: {
      publishedProfiles: published.length,
      heroUsed: heroMembers.length,
      heroLimit: HERO_SLOT_LIMIT,
      landingUsed: landingMembers.length,
      landingLimit: LANDING_SLOT_LIMIT,
    },
    heroMembers,
    landingMembers,
    data: rows.slice(from, from + limit),
    pagination: {
      page,
      limit,
      total: rows.length,
      totalPages: Math.ceil(rows.length / limit) || 0,
    },
  };
}

async function updateSupabaseVisibility(payload) {
  const { profileId, isHero, isLanding, replaceProfileId, slotType } = payload;
  const supabase = createAdminClient();

  if (replaceProfileId && slotType) {
    const demotionField = slotType === "hero" ? "is_hero" : "is_landing";
    const { error: demotionError } = await supabase
      .from("advisor_profiles")
      .update({ [demotionField]: false, updated_at: new Date().toISOString() })
      .eq("id", replaceProfileId);

    if (demotionError) {
      return { error: "Failed to replace existing featured profile", status: 500 };
    }
  }

  if (isHero === true) {
    const { data: heroMembers, error: heroError } = await supabase
      .from("advisor_profiles")
      .select("id, user:users(name, city)")
      .eq("is_hero", true)
      .neq("id", profileId);

    if (heroError) {
      return { error: "Failed to validate hero slots", status: 500 };
    }

    if (
      (heroMembers || []).length >= HERO_SLOT_LIMIT &&
      !(replaceProfileId && slotType === "hero")
    ) {
      return {
        error: "Hero limit reached",
        status: 409,
        members: (heroMembers || []).map((member) => ({
          id: member.id,
          name: member.user?.name || "Advisor",
          city: member.user?.city || "—",
        })),
      };
    }
  }

  if (isLanding === true) {
    const { data: landingMembers, error: landingError } = await supabase
      .from("advisor_profiles")
      .select("id, user:users(name, city)")
      .eq("is_landing", true)
      .neq("id", profileId);

    if (landingError) {
      return { error: "Failed to validate landing slots", status: 500 };
    }

    if (
      (landingMembers || []).length >= LANDING_SLOT_LIMIT &&
      !(replaceProfileId && slotType === "landing")
    ) {
      return {
        error: "Landing limit reached",
        status: 409,
        members: (landingMembers || []).map((member) => ({
          id: member.id,
          name: member.user?.name || "Advisor",
          city: member.user?.city || "—",
        })),
      };
    }
  }

  const updates = { updated_at: new Date().toISOString() };
  if (isHero !== undefined) updates.is_hero = isHero;
  if (isLanding !== undefined) updates.is_landing = isLanding;

  const { data, error } = await supabase
    .from("advisor_profiles")
    .update(updates)
    .eq("id", profileId)
    .select("id, is_hero, is_landing")
    .single();

  if (error) {
    return { error: "Failed to update visibility", status: 500 };
  }

  return { success: true, profile: data };
}

export async function GET(request) {
  const adminSession = await requireAdmin();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const params = parseListParams(new URL(request.url).searchParams);

    if (useLocalVisibilityControls()) {
      return NextResponse.json(listLocalVisibilityControls(params));
    }

    return NextResponse.json(await listSupabaseVisibility(params));
  } catch (error) {
    console.error("Visibility controls GET failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  const adminSession = await requireAdmin();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { profileId, isHero, isLanding, replaceProfileId, slotType } = payload;

  if (!profileId) {
    return NextResponse.json({ error: "profileId is required" }, { status: 400 });
  }

  if (isHero !== undefined && typeof isHero !== "boolean") {
    return NextResponse.json({ error: "isHero must be boolean" }, { status: 400 });
  }

  if (isLanding !== undefined && typeof isLanding !== "boolean") {
    return NextResponse.json({ error: "isLanding must be boolean" }, { status: 400 });
  }

  if (slotType !== undefined && !["hero", "landing"].includes(slotType)) {
    return NextResponse.json({ error: "slotType must be hero or landing" }, { status: 400 });
  }

  try {
    const result = useLocalVisibilityControls()
      ? updateLocalVisibility(profileId, {
          isHero,
          isLanding,
          replaceProfileId,
          slotType,
        })
      : await updateSupabaseVisibility({
          profileId,
          isHero,
          isLanding,
          replaceProfileId,
          slotType,
        });

    if (result.error) {
      return NextResponse.json(
        {
          error: result.error,
          members: result.members || [],
        },
        { status: result.status || 400 },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Visibility controls POST failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
