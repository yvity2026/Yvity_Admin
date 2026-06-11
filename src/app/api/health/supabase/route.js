import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/persistence-mode";

export const dynamic = "force-dynamic";

/** Lightweight Supabase connectivity check (no secrets exposed). */
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      ok: false,
      hint: "Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY on Vercel.",
    });
  }

  const supabase = createAdminClient();
  const checks = await Promise.all([
    supabase.from("admin_users").select("id", { count: "exact", head: true }),
    supabase.from("advisor_profiles").select("id", { count: "exact", head: true }),
    supabase.from("platform_documents").select("document_key", { head: true }).limit(1),
  ]);

  const [admins, profiles, documents] = checks;

  return NextResponse.json({
    ok: !admins.error && !profiles.error,
    adminUsers: admins.error ? { error: admins.error.message } : { count: admins.count ?? 0 },
    advisorProfiles: profiles.error
      ? { error: profiles.error.message }
      : { count: profiles.count ?? 0 },
    platformDocuments: documents.error
      ? { error: documents.error.message }
      : { ok: true },
    projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
  });
}
