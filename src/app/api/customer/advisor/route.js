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
    profile_slug: profile?.profile_slug || "",
    short_bio: profile?.short_bio || "",
    intro_url: profile?.intro_url || "",
    services,
    is_verified: profile?.profile_status || false,
  };
};

export async function GET(request) {
  try {
    // Add request logging
    console.log("Dashboard API: Starting request");
    
    const user = await ValidateUser();
    console.log("Dashboard API: User validation result:", user ? "User found" : "No user");

    if (!user) {
      console.log("Dashboard API: Unauthorized - no user");
      return NextResponse.json(
        { error: "Unauthorized", success: false }, 
        { status: 401 }
      );
    }

    const supabase = createAdminClient();
    
    console.log("Dashboard API: Fetching advisors from Supabase");

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
          profile_slug,
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
        `
      )
      .filter("roles", "cs", JSON.stringify(["advisor"]))
      .eq("advisor_profiles.ispublic_profile", true)
      .order("created_at", { ascending: false });

      console.log(data)

    if (error) {
      console.error("Dashboard API: Supabase error:", error);
      return NextResponse.json(
        { error: error.message, success: false }, 
        { status: 400 }
      );
    }

    console.log("Dashboard API: Found advisors:", data?.length || 0);

    const advisors = (data || [])
      .map((item) => {
        const profile = Array.isArray(item.advisor_profiles)
          ? item.advisor_profiles[0]
          : item.advisor_profiles;

        // Uncomment if you want to filter by public profile
        if (!profile?.ispublic_profile) return null;

        return mapAdvisorCard(item, profile);
      })
      .filter(Boolean);

    // Ensure we always return JSON with proper content-type
    return NextResponse.json(
      { success: true, data: advisors },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
  } catch (error) {
    // Log the full error for debugging
    console.error("Dashboard API: Unexpected error:", error);
    console.error("Error stack:", error.stack);
    
    // Return a proper JSON error response
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Internal Server Error",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
