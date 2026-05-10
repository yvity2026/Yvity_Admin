import { validateAdmin } from "@/lib/auth/validateAdmin";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await validateAdmin();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", session.admin_id)
      .maybeSingle();

    if (error) {
      console.error(error);

      return NextResponse.json(
        { success: false, message: "Database error" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}