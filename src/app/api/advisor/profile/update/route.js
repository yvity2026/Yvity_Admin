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

    const { count, userError } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .filter("device_tokens", "cs", JSON.stringify([{ token: user.token }]));

      if(count === 0){
        return apiResponse()
      }
      if(count > 1){
        return apiResponse()
      }
    const body = await req.json();

    const updates = {};

    const allowedFields = [
      "name",
      "dob",
      "gender",
      "city",
      "email",
      "mobile",
      "ispublic_professional",
      "ispublic_services",
      "ispublic_achievements",
      "ispublic_gallery",
      "ispublic_testimonials",
      "ispublic_profile"
      //   "irdai_"
    ];

    if (Object.keys(updates).length === 0) {
      return apiResponse();
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("users") // change if needed
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("SUPABASE_ERROR:", error);

      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("PATCH_ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
