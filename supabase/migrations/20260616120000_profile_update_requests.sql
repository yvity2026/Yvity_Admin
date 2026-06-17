-- Profile update requests submitted by advisors for admin review.
-- Applied from Yvity_Admin.

-- =============================================================================
-- ENUMS
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE public.profile_update_change_type AS ENUM (
    'service_changes',
    'profile_changes',
    'verification_updates'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.profile_update_status AS ENUM (
    'pending',
    'approved',
    'rejected'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =============================================================================
-- TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.profile_update_requests (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  profile_id         UUID REFERENCES public.advisor_profiles(id) ON DELETE SET NULL,

  change_type        public.profile_update_change_type NOT NULL DEFAULT 'profile_changes',
  industry           TEXT,
  category           TEXT,
  service            TEXT,
  summary            TEXT,
  document_urls      TEXT[]   DEFAULT '{}',
  verification_notes TEXT,
  rejection_reason   TEXT,

  status             public.profile_update_status NOT NULL DEFAULT 'pending',

  submitted_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at        TIMESTAMPTZ,
  rejected_at        TIMESTAMPTZ,
  reviewed_by        UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,

  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_profile_update_requests_user_id
  ON public.profile_update_requests(user_id);

CREATE INDEX IF NOT EXISTS idx_profile_update_requests_status
  ON public.profile_update_requests(status);

CREATE INDEX IF NOT EXISTS idx_profile_update_requests_submitted_at
  ON public.profile_update_requests(submitted_at DESC);

-- =============================================================================
-- UPDATED_AT TRIGGER
-- =============================================================================

CREATE OR REPLACE FUNCTION public.set_profile_update_requests_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profile_update_requests_updated_at
  ON public.profile_update_requests;

CREATE TRIGGER trg_profile_update_requests_updated_at
  BEFORE UPDATE ON public.profile_update_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_profile_update_requests_updated_at();

-- =============================================================================
-- RLS
-- =============================================================================

ALTER TABLE public.profile_update_requests ENABLE ROW LEVEL SECURITY;

-- Service role (admin backend) has full access — no RLS restriction needed.
-- Advisors insert their own requests via Yvity_Users using the anon/user role.

CREATE POLICY "advisors_insert_own_requests"
  ON public.profile_update_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "advisors_read_own_requests"
  ON public.profile_update_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
