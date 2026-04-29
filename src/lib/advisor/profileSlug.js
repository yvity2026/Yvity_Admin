export function slugifyAdvisorName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getAdvisorProfileSlug(name) {
  return slugifyAdvisorName(name);
}

export function normalizeAdvisorProfileSlug(slug) {
  return String(slug || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function resolveAdvisorProfileSlug(profileSlug, name) {
  return normalizeAdvisorProfileSlug(profileSlug) || getAdvisorProfileSlug(name);
}

export async function buildUniqueAdvisorProfileSlug(
  supabase,
  name,
  excludeAdvisorId,
) {
  const baseSlug = getAdvisorProfileSlug(name) || "advisor";
  let candidateSlug = baseSlug;
  let suffix = 2;

  while (true) {
    let query = supabase
      .from("advisor_profiles")
      .select("advisor_id")
      .eq("profile_slug", candidateSlug);

    if (excludeAdvisorId) {
      query = query.neq("advisor_id", excludeAdvisorId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return candidateSlug;
    }

    candidateSlug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}
