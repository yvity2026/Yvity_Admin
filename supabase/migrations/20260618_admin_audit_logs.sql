-- Admin audit log: track every PII reveal and sensitive action
CREATE TABLE IF NOT EXISTS "public"."admin_audit_logs" (
  "id"           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "admin_id"     UUID REFERENCES "public"."admin_users"("id") ON DELETE SET NULL,
  "admin_email"  TEXT,
  "action"       TEXT NOT NULL,           -- e.g. 'reveal_pii', 'extend_subscription'
  "entity_type"  TEXT,                    -- e.g. 'advisor', 'payment', 'coupon'
  "entity_id"    TEXT,                    -- record id
  "field"        TEXT,                    -- e.g. 'email', 'phone'
  "created_at"   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS admin_audit_logs_admin_id_idx  ON "public"."admin_audit_logs" ("admin_id");
CREATE INDEX IF NOT EXISTS admin_audit_logs_created_at_idx ON "public"."admin_audit_logs" ("created_at" DESC);
