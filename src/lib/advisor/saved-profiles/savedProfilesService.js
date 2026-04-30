/**
 * Saved Profiles Service
 * Handles all business logic for saved advisor profiles
 */

const PAGINATION_LIMIT = 10;

/**
 * Save an advisor profile for a user
 * @param {Object} supabase - Supabase client instance
 * @param {string} userId - User ID
 * @param {string} advisorProfileId - Advisor Profile ID
 * @returns {Object} - { data, error }
 */
export async function saveAdvisorProfile(supabase, userId, advisorProfileId) {
  try {
    // Validate inputs
    if (!userId || !advisorProfileId) {
      throw new Error("User ID and Advisor Profile ID are required");
    }

    // Check if profile is already saved
    const { data: existing, error: checkError } = await supabase
      .from("saved_profiles")
      .select("id")
      .eq("user_id", userId)
      .eq("advisor_profile_id", advisorProfileId)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existing) {
      return {
        data: existing,
        error: null,
        message: "Profile already saved",
        isNew: false,
      };
    }

    // Insert new saved profile
    const { data, error } = await supabase
      .from("saved_profiles")
      .insert({
        user_id: userId,
        advisor_profile_id: advisorProfileId,
      })
      .select("*")
      .single();

    if (error) throw error;

    return {
      data,
      error: null,
      message: "Profile saved successfully",
      isNew: true,
    };
  } catch (error) {
    return {
      data: null,
      error: error.message || "Failed to save profile",
    };
  }
}

/**
 * Remove a saved advisor profile
 * @param {Object} supabase - Supabase client instance
 * @param {string} userId - User ID
 * @param {string} advisorProfileId - Advisor Profile ID
 * @returns {Object} - { data, error }
 */
export async function removeSavedProfile(supabase, userId, advisorProfileId) {
  try {
    if (!userId || !advisorProfileId) {
      throw new Error("User ID and Advisor Profile ID are required");
    }

    const { data, error } = await supabase
      .from("saved_profiles")
      .delete()
      .eq("user_id", userId)
      .eq("advisor_profile_id", advisorProfileId)
      .select("*")
      .single();

    if (error) throw error;

    return {
      data,
      error: null,
      message: "Profile removed successfully",
    };
  } catch (error) {
    return {
      data: null,
      error: error.message || "Failed to remove profile",
    };
  }
}

/**
 * Get saved profiles for a user with pagination
 * @param {Object} supabase - Supabase client instance
 * @param {string} userId - User ID
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Number of items per page
 * @returns {Object} - { data, pagination, error }
 */
export async function getSavedProfiles(
  supabase,
  userId,
  page = 1,
  limit = PAGINATION_LIMIT
) {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Validate pagination parameters
    const validPage = Math.max(1, parseInt(page) || 1);
    const validLimit = Math.min(50, Math.max(1, parseInt(limit) || PAGINATION_LIMIT));
    const offset = (validPage - 1) * validLimit;

    // Get total count
    const { count, error: countError } = await supabase
      .from("saved_profiles")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) throw countError;

    // Get paginated data with advisor details
    const { data, error } = await supabase
      .from("saved_profiles")
      .select(
        `
        id,
        created_at,
        advisor_profile_id,
        advisor_profiles!inner (
          id,
          user_id,
          short_bio,
          is_verified,
          subscription_plan,
          profile_slug,
          ispublic_services,
          ispublic_achievements,
          ispublic_gallery,
          ispublic_testimonials,
          ispublic_professional,
          users!inner (
            id,
            name,
            email,
            mobile,
            mobile_number,
            city,
            profession,
            selfie_url,
            bio,
            created_at
          )
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + validLimit - 1);

    if (error) throw error;

    // Flatten the nested structure for easier frontend consumption
    const flattened = (data || []).map((item) => ({
      savedProfileId: item.id,
      savedAt: item.created_at,
      advisorProfile: {
        id: item.advisor_profiles.id,
        userId: item.advisor_profiles.user_id,
        shortBio: item.advisor_profiles.short_bio,
        isVerified: item.advisor_profiles.is_verified,
        subscriptionPlan: item.advisor_profiles.subscription_plan,
        profileSlug: item.advisor_profiles.profile_slug,
        publicSettings: {
          services: item.advisor_profiles.ispublic_services,
          achievements: item.advisor_profiles.ispublic_achievements,
          gallery: item.advisor_profiles.ispublic_gallery,
          testimonials: item.advisor_profiles.ispublic_testimonials,
          professional: item.advisor_profiles.ispublic_professional,
        },
        user: {
          id: item.advisor_profiles.users.id,
          name: item.advisor_profiles.users.name,
          email: item.advisor_profiles.users.email,
          phone: item.advisor_profiles.users.mobile || item.advisor_profiles.users.mobile_number,
          city: item.advisor_profiles.users.city,
          profession: item.advisor_profiles.users.profession,
          avatar: item.advisor_profiles.users.selfie_url,
          bio: item.advisor_profiles.users.bio,
          memberSince: item.advisor_profiles.users.created_at,
        },
      },
    }));

    const totalPages = Math.ceil((count || 0) / validLimit);

    return {
      data: flattened,
      pagination: {
        currentPage: validPage,
        pageSize: validLimit,
        totalCount: count || 0,
        totalPages,
        hasNextPage: validPage < totalPages,
        hasPreviousPage: validPage > 1,
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      pagination: null,
      error: error.message || "Failed to fetch saved profiles",
    };
  }
}

/**
 * Check if an advisor profile is saved by a user
 * @param {Object} supabase - Supabase client instance
 * @param {string} userId - User ID
 * @param {string} advisorProfileId - Advisor Profile ID
 * @returns {Object} - { isSaved, savedProfileId, error }
 */
export async function checkIfProfileSaved(supabase, userId, advisorProfileId) {
  try {
    if (!userId || !advisorProfileId) {
      throw new Error("User ID and Advisor Profile ID are required");
    }

    const { data, error } = await supabase
      .from("saved_profiles")
      .select("id")
      .eq("user_id", userId)
      .eq("advisor_profile_id", advisorProfileId)
      .maybeSingle();

    if (error) throw error;

    return {
      isSaved: !!data,
      savedProfileId: data?.id || null,
      error: null,
    };
  } catch (error) {
    return {
      isSaved: false,
      savedProfileId: null,
      error: error.message || "Failed to check save status",
    };
  }
}

/**
 * Get multiple advisor profiles' save status for a user
 * @param {Object} supabase - Supabase client instance
 * @param {string} userId - User ID
 * @param {string[]} advisorProfileIds - Array of Advisor Profile IDs
 * @returns {Object} - { savedProfiles, error }
 */
export async function checkMultipleProfilesSaved(
  supabase,
  userId,
  advisorProfileIds
) {
  try {
    if (!userId || !Array.isArray(advisorProfileIds) || advisorProfileIds.length === 0) {
      throw new Error("User ID and array of Advisor Profile IDs are required");
    }

    const { data, error } = await supabase
      .from("saved_profiles")
      .select("advisor_profile_id, id")
      .eq("user_id", userId)
      .in("advisor_profile_id", advisorProfileIds);

    if (error) throw error;

    const savedMap = (data || []).reduce((acc, item) => {
      acc[item.advisor_profile_id] = item.id;
      return acc;
    }, {});

    return {
      savedProfiles: savedMap,
      error: null,
    };
  } catch (error) {
    return {
      savedProfiles: {},
      error: error.message || "Failed to check save status",
    };
  }
}
