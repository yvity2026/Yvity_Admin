# Full schema dumps

| File | Purpose |
|------|---------|
| `yvity_gold_e2e_schema.sql` | End-to-end `public` schema for YVITY + Dashboard (tables, RPCs, RLS, views). Use in Supabase **SQL Editor** for a greenfield project or to compare against live. |

**Canonical apply path for local CLI:** `../migrations/20260530120000_live_public_schema.sql` (via `npm run supabase:reset`).

Keep this dump in sync when production schema changes materially (export or regenerate from live `public`).
