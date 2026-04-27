import { NextResponse } from "next/server";
import { ValidateUser } from "@/lib/auth/ValidateUser";
import { createAdminClient } from "@/lib/supabase/server";

const getAdvisorTags = (services = []) => {
  const tags = [];

  const serviceNames = services
    .map((item) => item?.service || item?.service_type || item?.name)
    .filter(Boolean);

  if (serviceNames.includes("Life Insurance")) tags.push("Life Insurance");
  if (serviceNames.includes("Health Insurance")) tags.push("Health Insurance");

  return tags;
};

const mapAdvisorCard = (user, profile) => {
  const services = Array.isArray(profile?.services)
    ? profile.services
    : [];

  const tags = getAdvisorTags(services);

  return {
    id: user.id,
    name: user.name || "",
    title: user.profession || "Insurance Advisor",
    location: user.city || "",
    score: 80,
    scoreLabel: "Verified Advisor",
    exp: services?.[0]?.experience || "0+",
    reviews: 0,
    recs: 0,
    clients: "0",
    tags,
    selfie_url: user.selfie_url || "",
    short_bio: profile?.short_bio || "",
    intro_url: profile?.intro_url || "",
    services,
    is_verified: profile?.profile_status || false,
  };
};

export async function GET() {
  try {
    const user = await ValidateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("users")
      .select(
        `
        id,
        name,
        city,
        selfie_url,
        advisor_profiles (
          id,
          advisor_role_id,
          advisor_roles (
        title
        ),
          advisor_id,
          services,
          short_bio,
          intro_url,
          profile_status,
          ispublic_profile,
          ispublic_professional,
          ispublic_services,
          ispublic_achievements,
          ispublic_gallery,
          ispublic_testimonials
        )
      `,
      )
      .filter("roles", "cs", JSON.stringify(["advisor"]))
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const advisors = (data || [])
      .map((item) => {
        const profile = Array.isArray(item.advisor_profiles)
          ? item.advisor_profiles[0]
          : item.advisor_profiles;

        // if (!profile?.ispublic_profile) return null;

        return mapAdvisorCard(item, profile);
      })
      .filter(Boolean);

    return NextResponse.json({ success: true, data: advisors });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
