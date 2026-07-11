# Mu SiChen — Estates & Co.

A bilingual (English / 中文) luxury real-estate website and CMS for **Mu SiChen Estates & Co.**, Kuala Lumpur.

Built with **Next.js (App Router)**, server-rendered, hosted on **Vercel**, and fully runnable on **localhost**. Content is managed through a built-in admin CMS backed by **Supabase**.

## Tech stack

- **Next.js 14** (App Router, server components + `generateMetadata` for SEO)
- **TypeScript**, **React 18**
- **Tailwind CSS** + **shadcn/ui** (Radix)
- **Supabase** (Postgres, Auth, Storage) — CMS data, media, admin auth
- **PostHog** — privacy-friendly product analytics
- **Tiptap** — rich-text editing in the admin
- **framer-motion**, **recharts**

## Getting started (localhost)

Requires Node.js 18+ and npm ([install via nvm](https://github.com/nvm-sh/nvm)).

```sh
# 1. Install dependencies
npm install

# 2. Create your local env file
cp .env.example .env.local   # then fill in the values below

# 3. Run the dev server (http://localhost:8080)
npm run dev
```

### Environment variables

Set these in `.env.local` for local dev, and in your Vercel project settings for production:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project key (optional — analytics off if unset) |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host (default `https://us.i.posthog.com`) |
| `SITE_URL` | Canonical site URL, used for `sitemap.xml` / `robots.txt` / `llms.txt` |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server on port 8080 |
| `npm run build` | Generate SEO files, then build for production |
| `npm run start` | Run the production build locally |
| `npm run seed` | Seed Supabase with demo content (`PGURL=... npm run seed`) |
| `npm run seo:gen` | Regenerate `sitemap.xml`, `robots.txt`, `llms.txt` |

## Routing

File-based routing lives in `app/`. Reusable page/screen components are in `src/screens`, shared UI in `src/components`.

- Public: `/`, `/properties`, `/projects/[id]`, `/insights`, `/insights/[id]`, `/new-launch`, `/new-launch/[slug]`
- Admin CMS: `/admin` (login at `/admin/login`) — properties, new-launch developments, insights, pages, site content, media, messages, settings

## Deployment (Vercel)

Push to the connected branch; Vercel auto-detects Next.js and deploys. Set the environment variables above in **Project → Settings → Environment Variables**. No `vercel.json` rewrite is needed — Next.js handles routing natively.

## Database

Schema migrations are in `supabase/migrations/`. Apply them via the Supabase SQL Editor or the Supabase CLI (`supabase db push`).
