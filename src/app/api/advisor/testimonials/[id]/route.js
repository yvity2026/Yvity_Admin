import { ValidateAdvisor } from "@/lib/auth/ValidateAdvisor";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(req, context) {
  try {
    const supabase = createAdminClient();

    const user = await ValidateAdvisor();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const status = body?.status === "rejected" ? "rejected" : "approved";

    const updates = {
      status,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("advisor_testimonials")
      .update(updates)
      .eq("id", id)
      .eq("advisor_id", user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
