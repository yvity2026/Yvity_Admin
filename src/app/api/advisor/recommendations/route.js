import { getUser } from "@/lib/auth/Getuser";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(req) {
  try {
    const supabase = createAdminClient();
   const user = await getUser();

    const advisor_id = searchParams.get("advisor_id");

    let query = supabase
      .from("advisor_recommendations")
      .select("*")
      .order("created_at", { ascending: false });

    if (advisor_id) {
      query = query.eq("advisor_id", advisor_id);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}