# Supabase — single source of truth (YVITY platform)

**YVITY-Dashboard owns the complete database** for both apps:

| App | Repo | Uses DB via |
|-----|------|-------------|
| User product | **YVITY** (Gold) | Env vars → same Supabase project (no `supabase/` CLI here) |
| Admin | **YVITY-Dashboard** | This folder + env vars |

One Supabase project, two Vercel deploys, **all schema files live only in this repo**.

---

## Folder layout

```
supabase/
├── config.toml              # Local CLI (ports, project_id)
├── migrations/              # Active migrations (apply with CLI)
│   └── 20260530120000_live_public_schema.sql
├── migrations_legacy/       # Older incremental migrations (reference / history)
├── schema/                  # Full SQL dumps (SQL Editor, greenfield, docs)
│   └── yvity_gold_e2e_schema.sql
├── snippets/                # Optional one-off SQL (add as needed)
└── README.md                # This file
```

| Path | When to use |
|------|-------------|
| `migrations/` | Day-to-day: `npm run supabase:reset`, `db push` to linked project |
| `schema/yvity_gold_e2e_schema.sql` | New project bootstrap in Dashboard SQL Editor, or diff vs live |
| `migrations_legacy/` | Do not re-apply; historical context only |

---

## Local development

From **YVITY-Dashboard** repo root:

```bash
npm run supabase:start
npm run supabase:status    # copy API URL + keys into .env.local
npm run supabase:reset     # replay migrations/ on local Docker DB
```

Default ports: API `54321`, DB `54322`, Studio `54323`.

**YVITY (user app):** point `.env.local` at the same local URL and keys. Do **not** run `supabase start` from the YVITY repo.

```bash
# Optional: pull production public schema/data into local (read-only script)
npm run supabase:sync-from-remote
```

---

## Production (hosted Supabase)

- Schema changes: add a new file under `migrations/` or refresh baseline (team process).
- **Never** run destructive `db push` / `db reset` against production unless intentional.
- `supabase:sync-from-remote` only **reads** remote and updates **local** Docker.

### Storage buckets (Dashboard → Storage)

| Bucket | Used for |
|--------|----------|
| `verification-docs` | IRDAI / setup documents |
| `selfies` | Profile photos |
| `intro-video` | Introduction videos |

---

## Environment variables (both Vercel projects)

Same values in **YVITY** and **YVITY-Dashboard**:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

**Dashboard-only (local dev bridge to user app):**

```env
YVITY_GOLD_BASE_URL=http://localhost:3002
YVITY_USE_LOCAL_APPROVALS=false
```

---

## YVITY user repo

- **No** `supabase/migrations/` in YVITY — only a short pointer in `supabase/README.md`.
- Application code: `src/lib/supabase/` (client helpers) + server routes that read/write tables defined here.

---

## Related scripts

| Script | Location |
|--------|----------|
| `supabase:sync-from-remote` | `YVITY-Dashboard/scripts/sync-remote-to-local.ps1` |
