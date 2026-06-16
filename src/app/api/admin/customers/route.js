import { createAdminClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import { escapeIlike } from "@/lib/search/escapeIlike";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const q = (searchParams.get("q") || "").trim();

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("users")
      .select(
        `
        *,
        advisor_testimonials(*)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (q) {
      const safe = escapeIlike(q);
      query = query.or(`name.ilike.%${safe}%,email.ilike.%${safe}%,city.ilike.%${safe}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Admin customers query failed:", error);

      return NextResponse.json(
        { error: "Unable to load customers" },
        { status: 500 }
      );
    }

    // Safe mapping
    const output = (data || []).map((item) => {
      const reviews = item.advisor_testimonials || [];

      return {
        id: item.id,
        name: item.name || "Advisor",
        email: item.email || null,
        phone: item.mobile || null,
        profession: item.profession || null,
        profile_pic: item.selfie_url || null,
        joinedAt: item.created_at || null,
        location: item.city || "Unknown, IN",
        status: item.account_status || "pending",
        reviewCount: reviews.length || 0,
        lastLogin: item.last_login_at || null,
      };
    });

    return NextResponse.json({
      success: true,
      data: output,

      // pagination meta
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Admin approvals GET failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
