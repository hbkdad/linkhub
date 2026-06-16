# CLAUDE.md — LinkHub

Context for Claude Code working in this repo.

## What this is
**LinkHub** — an AI-ready bio website / link-in-bio platform. A Linktree competitor that
treats the user's bio page as a full mini-website: links, CTAs, products, lead capture,
QR code, analytics. The differentiator is being a *mini-website builder*, not just a
link list.

## Stack
- **Next.js 15 App Router** + TypeScript strict
- **Tailwind CSS** + shadcn/ui
- **Supabase** — Auth (email+password), Postgres, Row Level Security
- **Vercel** — deployment target
- Packages: `@supabase/ssr`, `@supabase/supabase-js`, `qrcode.react`

## Project structure
```
src/
  app/
    page.tsx              — landing page
    (auth)/login          — sign in
    (auth)/signup         — create account
    dashboard/            — profile editor + links + analytics
    u/[slug]/             — public profile page
  components/
    dashboard/            — ProfileForm, LinkManager
    public/               — PublicProfile (themed)
  lib/
    supabase/client.ts    — browser client
    supabase/server.ts    — server component client
    actions/              — server actions: auth, profile, links, analytics
  types/database.ts       — generated types matching the schema
db/
  supabase_schema.sql     — run this in your Supabase SQL editor
docs/
  MVP_SPEC.md, ROADMAP.md, LAUNCH_PLAN.md, AGENTS.md
```

## Domain rules
- Themes: `clean-dark` (default), `clean-light`, `neon`, `minimal`
- Link kinds: `link | cta | social | product | email`
- CTAs render as full-width primary buttons; other kinds as card rows
- Analytics: `page_views` on each public page load; `link_clicks` on each link click
- RLS: profiles + links are public-readable; inserts to views/clicks are public;
  mutations to own rows require `auth.uid() = id/profile_id`

## Setup (first time)
1. `cp .env.example .env.local` and fill in Supabase keys
2. Run `db/supabase_schema.sql` in Supabase SQL editor
3. `npm install && npm run dev`
4. Sign up at `localhost:3000/signup`, set your slug, add links

## Build order (remaining work)
1. Already built: landing, auth, dashboard, public profile, analytics, QR code
2. Custom domain support (per-profile DNS via Vercel API)
3. AI page generator (Claude API — describe yourself, auto-fill profile + links)
4. Stripe subscriptions (Pro plan: remove branding, custom domain, advanced analytics)
5. Lead capture forms (email collection block)
6. Product cards (image + price + buy link)
7. TestFlight / production deploy

## Conventions
- Server actions live in `src/lib/actions/`
- All Supabase queries go through `createClient()` — never use raw fetch
- Keep components small; prefer server components; client only when needed
  (forms, drag-and-drop, QR toggle)
- No comments for obvious things; comment only non-obvious constraints

## Slash commands
- `/spec-feature [feature]` — lean buildable spec for a LinkHub feature
- `/validate-idea [idea]` — go/pivot/kill score a new idea
- `/ship-step [status]` — the single next highest-leverage move
