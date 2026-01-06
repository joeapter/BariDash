# BariDash Israel

BariDash Israel storefront + admin panel built with Next.js (App Router), Supabase, Tailwind, and Meshulam integration scaffolding.

## Quick start

1) Install deps

```bash
npm install
```

2) Configure env

```bash
cp .env.example .env.local
```

Fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Meshulam vars (`MESHULAM_API_URL`, `MESHULAM_API_KEY`, `MESHULAM_TERMINAL_ID`, `MESHULAM_WEBHOOK_SECRET`)

3) Create Supabase schema

Run these files in the Supabase SQL editor (in order):

- `supabase/schema.sql`
- `supabase/rls.sql`
- `supabase/seed.sql`

4) Promote an admin user

After creating an account, run this SQL to grant admin access:

```sql
update public.profiles set role = 'admin' where email = 'you@domain.com';
```

5) Start the dev server

```bash
npm run dev
```

Open http://localhost:3000

## Meshulam integration

The checkout flow is wired to call `createMeshulamSession` in `src/lib/meshulam.ts`.

- Update the payload fields to match Meshulam's API contract for your account.
- Configure `MESHULAM_WEBHOOK_SECRET` and set Meshulam's webhook URL to:

```
https://your-domain.com/api/meshulam/webhook
```

The webhook currently updates order status to `paid` when it receives a success status.

## Notes

- Bilingual routing is handled via `next-intl` (`/he` and `/en`).
- Orders require an account; checkout will prompt sign-in.
- Admin pages live at `/admin` under each locale.
