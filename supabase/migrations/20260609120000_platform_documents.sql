-- Admin platform JSON documents (settings, ambassadors, plans, etc.)
-- Mirrors Yvity_Users/.data files for Vercel / production when no sibling .data exists.

CREATE TABLE IF NOT EXISTS public.platform_documents (
  document_key TEXT PRIMARY KEY,
  document JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS platform_documents_updated_at_idx
  ON public.platform_documents (updated_at DESC);

ALTER TABLE public.platform_documents ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.platform_documents IS
  'Key-value JSON store for admin modules (settings, ambassadors, coupons, etc.). Service role only.';
