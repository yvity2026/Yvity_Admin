-- Complaints, campaigns, PII encryption columns, testimonial moderation, audit log.
-- Apply from Yvity_Admin. App decrypts via service role only (never expose key to client).

-- =============================================================================
-- ENUMS
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE public.complaint_entity_type AS ENUM (
    'advisor_testimonial',
    'platform_testimonial',
    'advisor_profile',
    'user_account',
    'lead',
    'payment',
    'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.complaint_status AS ENUM (
    'open',
    'in_review',
    'resolved',
    'dismissed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.complaint_priority AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.complaint_reason AS ENUM (
    'fake_review',
    'not_a_client',
    'harassment',
    'spam',
    'wrong_target',
    'privacy',
    'fraud',
    'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.marketing_channel AS ENUM (
    'whatsapp',
    'email',
    'sms',
    'push'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.campaign_status AS ENUM (
    'draft',
    'scheduled',
    'sending',
    'sent',
    'cancelled',
    'failed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.campaign_audience AS ENUM (
    'all_users',
    'customers',
    'advisors',
    'plan_gold',
    'plan_silver',
    'plan_free',
    'custom_segment'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.pii_access_action AS ENUM (
    'view_complaint_contact',
    'view_user_contact',
    'view_lead_contact',
    'decrypt_for_campaign_send',
    'export_masked'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =============================================================================
-- USERS — encryption + marketing consent (migrate plain mobile/email gradually)
-- =============================================================================

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS phone_enc text,
  ADD COLUMN IF NOT EXISTS phone_hash text,
  ADD COLUMN IF NOT EXISTS phone_last4 character varying(4),
  ADD COLUMN IF NOT EXISTS email_enc text,
  ADD COLUMN IF NOT EXISTS email_hash text,
  ADD COLUMN IF NOT EXISTS email_domain text,
  ADD COLUMN IF NOT EXISTS marketing_consent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS marketing_consent_at timestamptz,
  ADD COLUMN IF NOT EXISTS marketing_consent_version text,
  ADD COLUMN IF NOT EXISTS marketing_whatsapp boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS marketing_email boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS marketing_sms boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS transactional_whatsapp boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS transactional_email boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.users.phone_enc IS 'AES-GCM ciphertext (base64). Plain mobile deprecated after backfill.';
COMMENT ON COLUMN public.users.phone_hash IS 'SHA-256 of normalized E.164/10-digit phone for lookup without decrypt.';
COMMENT ON COLUMN public.users.phone_last4 IS 'Display only in admin UI (••••3132).';
COMMENT ON COLUMN public.users.email_enc IS 'AES-GCM ciphertext (base64).';
COMMENT ON COLUMN public.users.email_hash IS 'SHA-256 of normalized lowercase email for lookup.';
COMMENT ON COLUMN public.users.marketing_consent IS 'Opt-in for promotional product/pricing/offer messages.';

CREATE INDEX IF NOT EXISTS idx_users_phone_hash ON public.users (phone_hash);
CREATE INDEX IF NOT EXISTS idx_users_email_hash ON public.users (email_hash);
CREATE INDEX IF NOT EXISTS idx_users_marketing_consent ON public.users (marketing_consent)
  WHERE marketing_consent = true;

-- =============================================================================
-- ADVISOR TESTIMONIALS — moderation + risk (customer → advisor)
-- =============================================================================

ALTER TABLE public.advisor_testimonials
  ADD COLUMN IF NOT EXISTS risk_score integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS risk_flags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS reported_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS admin_visibility text NOT NULL DEFAULT 'public',
  ADD COLUMN IF NOT EXISTS admin_reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS admin_reviewed_by uuid REFERENCES public.admin_users(id),
  ADD COLUMN IF NOT EXISTS admin_note text;

ALTER TABLE public.advisor_testimonials
  DROP CONSTRAINT IF EXISTS advisor_testimonials_admin_visibility_check;

ALTER TABLE public.advisor_testimonials
  ADD CONSTRAINT advisor_testimonials_admin_visibility_check
  CHECK (admin_visibility IN ('public', 'hidden', 'removed'));

COMMENT ON COLUMN public.advisor_testimonials.risk_score IS '0-100 auto score at submit; flagged when >= threshold.';
COMMENT ON COLUMN public.advisor_testimonials.admin_visibility IS 'public=normal; hidden=off profile; removed=soft delete.';

CREATE INDEX IF NOT EXISTS idx_advisor_testimonials_risk
  ON public.advisor_testimonials (risk_score DESC, created_at DESC)
  WHERE admin_visibility = 'public';

CREATE INDEX IF NOT EXISTS idx_advisor_testimonials_reported
  ON public.advisor_testimonials (reported_count DESC)
  WHERE reported_count > 0;

-- =============================================================================
-- PLATFORM COMPLAINTS (Reports & Complaints nav)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.platform_complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number text NOT NULL UNIQUE,
  entity_type public.complaint_entity_type NOT NULL,
  entity_id uuid,
  reason public.complaint_reason NOT NULL DEFAULT 'other',
  description text NOT NULL,
  status public.complaint_status NOT NULL DEFAULT 'open',
  priority public.complaint_priority NOT NULL DEFAULT 'medium',
  reporter_user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  reporter_name text,
  reporter_phone_enc text,
  reporter_phone_hash text,
  reporter_email_enc text,
  reporter_email_hash text,
  reporter_phone_last4 character varying(4),
  target_user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  target_advisor_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  assigned_admin_id uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
  resolution_note text,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.platform_complaints IS
  'User/advisor reports. Reporter PII encrypted; decrypt only with view_complaint_pii permission.';

CREATE INDEX IF NOT EXISTS idx_platform_complaints_status
  ON public.platform_complaints (status, priority, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_platform_complaints_entity
  ON public.platform_complaints (entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_platform_complaints_reporter_hash
  ON public.platform_complaints (reporter_phone_hash);

-- Link complaints to testimonials (optional FK when entity is testimonial)
-- entity_id points to advisor_testimonials.id or yvity_testimonials.id per entity_type

-- =============================================================================
-- COMPLAINT COMMENTS (internal admin notes)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.platform_complaint_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid NOT NULL REFERENCES public.platform_complaints(id) ON DELETE CASCADE,
  admin_id uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  message text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT platform_complaint_events_type_check
    CHECK (event_type IN ('created', 'assigned', 'status_change', 'note', 'pii_viewed', 'resolved'))
);

CREATE INDEX IF NOT EXISTS idx_platform_complaint_events_complaint
  ON public.platform_complaint_events (complaint_id, created_at DESC);

-- =============================================================================
-- MARKETING CAMPAIGNS (product / pricing / offers — server-side send only)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status public.campaign_status NOT NULL DEFAULT 'draft',
  audience public.campaign_audience NOT NULL DEFAULT 'all_users',
  segment_filters jsonb NOT NULL DEFAULT '{}'::jsonb,
  channels public.marketing_channel[] NOT NULL DEFAULT '{whatsapp}',
  whatsapp_template_key text,
  email_subject text,
  email_template_key text,
  scheduled_at timestamptz,
  sent_at timestamptz,
  recipient_count integer NOT NULL DEFAULT 0,
  sent_count integer NOT NULL DEFAULT 0,
  failed_count integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.marketing_campaigns IS
  'Promotional broadcasts. Recipients resolved server-side; no plaintext export in admin UI.';

COMMENT ON COLUMN public.marketing_campaigns.segment_filters IS
  'e.g. {"cities":["Hyderabad"],"plans":["gold"],"roles":["advisor"]} — non-PII only.';

CREATE TABLE IF NOT EXISTS public.marketing_campaign_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  channel public.marketing_channel NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  provider_message_id text,
  error_message text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT marketing_campaign_sends_status_check
    CHECK (status IN ('pending', 'sent', 'failed', 'skipped')),
  CONSTRAINT marketing_campaign_sends_unique UNIQUE (campaign_id, user_id, channel)
);

CREATE INDEX IF NOT EXISTS idx_marketing_campaign_sends_campaign
  ON public.marketing_campaign_sends (campaign_id, status);

-- Consent change audit (DPDP / opt-in proof)
CREATE TABLE IF NOT EXISTS public.marketing_consent_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  marketing_consent boolean NOT NULL,
  marketing_whatsapp boolean NOT NULL DEFAULT false,
  marketing_email boolean NOT NULL DEFAULT false,
  marketing_sms boolean NOT NULL DEFAULT false,
  consent_version text,
  source text NOT NULL DEFAULT 'user_settings',
  ip_address inet,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketing_consent_log_user
  ON public.marketing_consent_log (user_id, created_at DESC);

-- =============================================================================
-- ADVISOR LEADS — encrypted contact (advisor_prospects)
-- =============================================================================

ALTER TABLE public.advisor_prospects
  ADD COLUMN IF NOT EXISTS phone_number_enc text,
  ADD COLUMN IF NOT EXISTS phone_number_hash text,
  ADD COLUMN IF NOT EXISTS phone_last4 character varying(4),
  ADD COLUMN IF NOT EXISTS email_enc text,
  ADD COLUMN IF NOT EXISTS email_hash text;

COMMENT ON COLUMN public.advisor_prospects.phone_number_enc IS
  'Encrypted lead phone. Plain phone_number deprecated after backfill. Advisor API decrypts own rows only.';

-- =============================================================================
-- PII ACCESS AUDIT (who decrypted what)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.pii_access_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
  action public.pii_access_action NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  complaint_id uuid REFERENCES public.platform_complaints(id) ON DELETE SET NULL,
  campaign_id uuid REFERENCES public.marketing_campaigns(id) ON DELETE SET NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pii_access_audit_admin
  ON public.pii_access_audit_log (admin_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pii_access_audit_complaint
  ON public.pii_access_audit_log (complaint_id)
  WHERE complaint_id IS NOT NULL;

-- =============================================================================
-- CASE NUMBER HELPER
-- =============================================================================

CREATE OR REPLACE FUNCTION public.generate_complaint_case_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  seq bigint;
BEGIN
  SELECT count(*) + 1 INTO seq FROM public.platform_complaints;
  RETURN 'YV-CMP-' || to_char(now(), 'YYYYMM') || '-' || lpad(seq::text, 5, '0');
END;
$$;

-- =============================================================================
-- RLS — service role / admin API only for sensitive tables
-- =============================================================================

ALTER TABLE public.platform_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_complaint_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_campaign_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_consent_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pii_access_audit_log ENABLE ROW LEVEL SECURITY;

-- No anon/authenticated policies: Yvity_Admin uses service_role server routes only.

GRANT ALL ON TABLE public.platform_complaints TO service_role;
GRANT ALL ON TABLE public.platform_complaint_events TO service_role;
GRANT ALL ON TABLE public.marketing_campaigns TO service_role;
GRANT ALL ON TABLE public.marketing_campaign_sends TO service_role;
GRANT ALL ON TABLE public.marketing_consent_log TO service_role;
GRANT ALL ON TABLE public.pii_access_audit_log TO service_role;

GRANT ALL ON FUNCTION public.generate_complaint_case_number() TO service_role;
