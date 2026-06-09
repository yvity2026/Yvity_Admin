import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import {
  fetchSupabaseAudienceOptions,
  parseAudienceParams,
  resolveSupabaseTestimonialAudience,
  toPreviewRecipient,
} from "@/lib/admin/platform-reviews/resolveTestimonialAudience";
import {
  previewLocalTestimonialAudience,
  useLocalTestimonialAudience,
} from "@/lib/local-data/testimonial-audience";

export async function GET(request) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const params = parseAudienceParams(Object.fromEntries(searchParams.entries()));

    if (useLocalTestimonialAudience()) {
      return NextResponse.json(previewLocalTestimonialAudience(params));
    }

    const supabase = createAdminClient();
    const [recipients, options] = await Promise.all([
      resolveSupabaseTestimonialAudience(supabase, params),
      fetchSupabaseAudienceOptions(supabase),
    ]);

    return NextResponse.json({
      count: recipients.length,
      sample: recipients.slice(0, 8).map(toPreviewRecipient),
      params,
      options,
      meta: { source: "supabase" },
    });
  } catch (error) {
    console.error("[testimonials/request/audience]", error);
    return NextResponse.json(
      { error: error.message || "Failed to preview audience" },
      { status: 500 },
    );
  }
}
