-- YVITY Gold: notifications, profile views, search impressions, contact inquiries, score decay ledger

CREATE TABLE IF NOT EXISTS public.advisor_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  href text,
  read boolean NOT NULL DEFAULT false,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_advisor_notifications_user
  ON public.advisor_notifications (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.advisor_profile_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  viewer_key text NOT NULL,
  viewed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_advisor_profile_views_advisor
  ON public.advisor_profile_views (advisor_id, viewed_at DESC);

CREATE TABLE IF NOT EXISTS public.advisor_search_impressions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  searcher_key text NOT NULL,
  source text NOT NULL DEFAULT 'api_search',
  appeared_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_advisor_search_impressions_advisor
  ON public.advisor_search_impressions (advisor_id, appeared_at DESC);

CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  mobile text NOT NULL,
  interests text[] NOT NULL DEFAULT '{}'::text[],
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_advisor
  ON public.contact_inquiries (advisor_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.advisor_score_decay_ledger (
  advisor_id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  profile_views_decay integer NOT NULL DEFAULT 0,
  self_share_decay integer NOT NULL DEFAULT 0,
  client_share_decay integer NOT NULL DEFAULT 0,
  login_decay integer NOT NULL DEFAULT 0,
  last_evaluated_month text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.advisor_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_search_impressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_score_decay_ledger ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.advisor_notifications TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.advisor_profile_views TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.advisor_search_impressions TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.contact_inquiries TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.advisor_score_decay_ledger TO anon, authenticated, service_role;

COMMENT ON TABLE public.advisor_notifications IS 'YVITY-Gold in-app advisor notifications';
COMMENT ON TABLE public.advisor_profile_views IS 'YVITY-Gold unique profile view telemetry';
COMMENT ON TABLE public.advisor_search_impressions IS 'YVITY-Gold search result impression telemetry';
COMMENT ON TABLE public.contact_inquiries IS 'YVITY-Gold public profile contact form submissions';
COMMENT ON TABLE public.advisor_score_decay_ledger IS 'YVITY-Gold monthly score decay counters';
