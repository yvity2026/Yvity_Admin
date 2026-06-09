import { createAdminClient } from "@/lib/supabase/server";

const TABLE = "platform_documents";

export async function readPlatformDocument(documentKey, fallback = null) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("document, updated_at")
    .eq("document_key", documentKey)
    .maybeSingle();

  if (error) {
    if (error.code === "42P01") {
      throw new Error(
        "platform_documents table missing — run Supabase migration 20260609120000_platform_documents.sql",
      );
    }
    throw error;
  }

  if (!data) return fallback;
  return data.document ?? fallback;
}

export async function writePlatformDocument(documentKey, document) {
  const supabase = createAdminClient();
  const { error } = await supabase.from(TABLE).upsert(
    {
      document_key: documentKey,
      document,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "document_key" },
  );

  if (error) {
    if (error.code === "42P01") {
      throw new Error(
        "platform_documents table missing — run Supabase migration 20260609120000_platform_documents.sql",
      );
    }
    throw error;
  }
}

export async function listPlatformDocuments() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from(TABLE).select("document_key, document");

  if (error) {
    if (error.code === "42P01") return [];
    throw error;
  }

  return data || [];
}
