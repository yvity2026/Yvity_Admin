import { ValidateAdvisor } from "@/lib/auth/ValidateAdvisor";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const user = await ValidateAdvisor();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = supabase
      .from("advisor_testimonials")
      .select("*")
      .eq("advisor_id", user.id)
      .order("created_at", { ascending: false });

    if (type && type !== "All") {
      query = query.eq("testimonial_type", type.toLowerCase());
    }

    const { data, error } = await query;

    if (error) throw error;

    const userIds = [...new Set((data ?? []).map((item) => item.user_id).filter(Boolean))];

    let usersById = {};

    if (userIds.length) {
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id,name,selfie_url")
        .in("id", userIds);

      if (usersError) throw usersError;

      usersById = (users ?? []).reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});
    }

    const enrichedData = (data ?? []).map((item) => ({
      ...item,
      user: usersById[item.user_id] ?? null,
    }));

    return NextResponse.json({ data: enrichedData });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
