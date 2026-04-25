import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/Getuser";
import { apiResponse } from "@/lib/apiResponse";

export async function PATCH(req) {
  try {
    const user = await getUser();

    if (!user?.token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    // Get user by device token - optimized query
    const { data: loggedUser, error: userError } = await supabase
      .from("users")
      .select("id")
      .filter("device_tokens", "cs", JSON.stringify([{ token: user.token }]))
      .maybeSingle();

    if (userError || !loggedUser) {
      console.error("User fetch error:", userError);
      return apiResponse("Failed to fetch user", false, 1, "", userError?.message || "User not found");
    }

    const body = await req.json();
    // Define allowed fields - moved outside for better performance
    const USER_PROFILE_FIELDS = new Set([
      "name", "dob", "gender", "city", "email", "mobile"
    ]);
    
    const ADVISOR_PROFILE_FIELDS = new Set([
      "ispublic_professional", "ispublic_services", "ispublic_achievements",
      "ispublic_gallery", "ispublic_testimonials", "ispublic_profile","services"
    ]);

    // Extract updates using object destructuring and filtering
    const userProfileUpdates = Object.fromEntries(
      Object.entries(body)
        .filter(([key]) => USER_PROFILE_FIELDS.has(key))
    );

    const advisorProfileUpdates = Object.fromEntries(
      Object.entries(body)
        .filter(([key]) => ADVISOR_PROFILE_FIELDS.has(key))
    );

    if (Object.keys(userProfileUpdates).length === 0 && 
        Object.keys(advisorProfileUpdates).length === 0) {
      return apiResponse("No valid fields to update", false, 4);
    }

    const now = new Date().toISOString();
    
    // Run updates in parallel for better performance
    const [advisorResult, userResult] = await Promise.allSettled([
      // Update advisor profile if there are fields to update
      Object.keys(advisorProfileUpdates).length > 0 
        ? supabase
            .from("advisor_profiles")
            .update({ ...advisorProfileUpdates, updated_at: now })
            .eq("advisor_id", loggedUser.id)
            .select()
            .single()
        : Promise.resolve({ data: null, error: null }),
      
      // Update user profile if there are fields to update
      Object.keys(userProfileUpdates).length > 0
        ? supabase
            .from("users")
            .update({ ...userProfileUpdates, updated_at: now })
            .filter("device_tokens", "cs", JSON.stringify([{ token: user.token }]))
            .select("*")
            .single()
        : Promise.resolve({ data: null, error: null })
    ]);

    // Handle errors
    const errors = [];
    
    if (advisorResult.status === 'rejected') {
      errors.push({ type: 'advisor', error: advisorResult.reason });
    } else if (advisorResult.value.error) {
      errors.push({ type: 'advisor', error: advisorResult.value.error });
    }

    if (userResult.status === 'rejected') {
      errors.push({ type: 'user', error: userResult.reason });
    } else if (userResult.value.error) {
      errors.push({ type: 'user', error: userResult.value.error });
    }

    if (errors.length > 0) {
      console.error("Update errors:", errors);
      return apiResponse("Failed to update profile", false, 5, "", errors[0].error.message);
    }

    // Extract data from successful updates
    const advisor = advisorResult.status === 'fulfilled' ? advisorResult.value.data : null;
    const update = userResult.status === 'fulfilled' ? userResult.value.data : null;

    // Return appropriate response based on what was updated
    const updatedFields = {
      ...(Object.keys(userProfileUpdates).length > 0 && { user: update }),
      ...(Object.keys(advisorProfileUpdates).length > 0 && { advisor })
    };

    return apiResponse("Profile updated successfully", true, 0, updatedFields);

  } catch (error) {
    console.error("PATCH_ERROR:", error);
    return apiResponse("Internal Server Error", false, 6, "", error.message || error);
  }
}