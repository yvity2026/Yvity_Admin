-- =============================================================================
-- ADMIN ACTION LOG
-- Tracks admin-initiated mutations on user accounts (suspend/activate/delete).
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.admin_action_log (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    uuid        REFERENCES public.admin_users(id) ON DELETE SET NULL,
  action      text        NOT NULL,
  entity_type text        NOT NULL DEFAULT 'user',
  entity_id   uuid,
  reason      text,
  metadata    jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_action_log_admin
  ON public.admin_action_log (admin_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_action_log_entity
  ON public.admin_action_log (entity_type, entity_id, created_at DESC);

ALTER TABLE public.admin_action_log ENABLE ROW LEVEL SECURITY;

-- Service role only — admin app uses service_role server routes.
GRANT ALL ON TABLE public.admin_action_log TO service_role;
