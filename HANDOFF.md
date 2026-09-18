# Project Handoff — Mu SiChen Estates & Co. Website + CMS

> Purpose: give a fresh Claude conversation (any account / any machine) enough context to
> continue this project without re-discovering everything. Read this file first, then skim
> `README.md` and the folders noted below.

---

## 1. What this is

A bilingual (English / 中文) luxury real-estate website + admin CMS for **Mu SiChen Estates & Co.**
(Kuala Lumpur). Public site markets luxury property listings, new-launch developments, market
insights, and sponsors; an admin area manages all of it. Content is CMS-driven and bilingual.

## 2. Tech stack

- **Next.js 14 (App Router)** — migrated from an original Vite SPA. SSR + client islands.
- **React 18 + TypeScript + TailwindCSS + shadcn/ui (Radix)**
- **Supabase** — Postgres (RLS), Auth, Storage. Project ref: `fbvyowsmmthjhtnzdopu`.
- **PostHog** analytics, **Tiptap** rich text, **framer-motion**.
- Deployed on **Vercel** (`vercel.json` = `{"framework":"nextjs"}`), also runs on localhost:8080.

## 3. Repo, branches, hosting

- GitHub: `github.com/izzuddin-noormy/elite-advisor-showcase`
- **Active branch: `feature/real-property`** — all recent work is here (real listings + UI/finance
  features). Merge/PR into main when ready.
- Local path on the current machine: `.../TheMuSichen/website/claude/elite-advisor-showcase`.
- `.next/`, `out/`, `next-env.d.ts`, `.vercel` are gitignored (do not commit build output).

## 4. Environment / credentials (NOT stored in repo)

`.env` (gitignored) holds:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (anon key)
- `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `SITE_URL`

Two secrets are **needed but never committed** — the next session must ask the user for them:
- **Supabase API secret key** (`sb_secret_…`) — bypasses RLS; required to insert/upsert rows,
  upload to Storage, or update `site_content`. Used only in local one-off scripts, never committed.
- **Postgres connection string (PGURL, pooler port 6543)** — required ONLY for DDL / migrations
  (`CREATE TABLE`, etc.), because the API secret key cannot run DDL. The user has this; ask when a
  schema change is needed. `scripts/run-migration.mjs <file.sql>` runs a migration with `PGURL` set.

Admin login (dev): email shown in admin as `admin@admin.com`.

## 5. Supabase data model (key tables)

- `properties` — listings. Notable columns: `slug`, `title_en/zh`, `property_type`, `price` (MYR),
  `location`, `address`, `beds`, `baths`, `sqft`, `status`, `featured`, `published`, `image_url`,
  `gallery` (text[]), `description_en/zh`, `overview_en/zh`, `features` (jsonb), `other_details`
  (jsonb), `seo` (jsonb), `faqs` (jsonb), `location_lat/lng`, `video_url`.
- `developments` — new-launch projects (Aurelia cinematic template).
- `insights` — market articles.
- `sponsors` — homepage spotlight carousel entries.
- `site_content` — bilingual CMS key/value store (`key`, `group`, `value_en`, `value_zh`).
  Overrides the JSON in `src/locales/{en,zh}.json` at runtime (DB wins). Also now stores the
  **district benchmark overrides** under keys `benchmark.<district>` (value_en = median PSF override,
  value_zh = rent PSF override; blank = auto/fallback).
- `settings` — global site settings (contact, socials, default SEO, PostHog).
- Storage bucket: **`cms-images`** (public). Property photos live under `properties/<id>/NN.jpg`.

RLS: anon can read published rows; writes require the authenticated admin session or the secret key.

## 6. Routing map (public + admin)

- Public: `/` (home), `/properties` (listing), `/projects/[slug]` (property DETAIL — note it's
  `/projects/…`, not `/properties/…`), `/new-launch` + `/new-launch/[slug]`, `/insights` +
  `/insights/[id]`, plus privacy/terms.
- Admin (under `app/admin/(protected)/`): dashboard, properties, developments (New Launch),
  insights, sponsors, **benchmarks**, pages, content (Site Content), media, messages, settings.
- Screens live in `src/screens/*`; thin route files under `app/**` render them.

## 7. Features implemented in this work stream (feature/real-property)

1. **Admin search + filters** on Properties, New Launch, Insights, Sponsors lists (client-side
   `useMemo`). Properties also has a **Featured filter + inline star toggle** (add/remove featured
   from the list without opening the editor).
2. **10 real listings imported** from luxuryestate.com (crawled via tavily). Images downloaded and
   re-hosted in `cms-images` (not hotlinked). Bilingual titles/descriptions/overviews/features.
   Prices in MYR (explicit RM where the source stated it; EUR→MYR ≈ 4.95 rounded otherwise —
   flagged as adjustable). All `published`. Import was a one-off local script (deleted after use).
3. **Sorting**: `/properties` and homepage featured section sort by `created_at` DESC (newest first).
4. **Gallery** (`/projects/[slug]`): photo-count badge, 1 hero + 6 thumbnails with "+N View all",
   and a **scrollable collage modal** (preview on top, all images in a masonry below — no prev/next
   arrows; close via X / Esc).
5. **UI**: "Schedule Consultation" renamed to **"Contact"** (nav + hero, EN/ZH, updated in
   `site_content` too); hero + nav CTAs restyled as **semi-transparent glass buttons** (rounded).
6. **Financial panel** (right sidebar of every property detail) — see section 8.
7. **Mortgage calculator**: collapsible (hidden by default, toggle button); down payment 0–100%;
   loan term is a free-text years input (dropdown removed); interest rate 0–15%; down-payment % and
   interest rate are editable inputs synced with their sliders.
8. **Sticky sidebar**: Financial + Mortgage panels stick below the navbar on scroll.
9. Earlier (pre-this-stream, already on the project): full Next.js migration, PostHog, bilingual
   PDPA Privacy/Terms, HTML/CSS logo, favicon, standalone Insights + Sponsors sections.

## 8. Financial panel + district benchmarks (important design)

Component: `src/components/property/PropertyFinancials.tsx`. Shows, per listing:
- **Sales Price** = `price`.
- **Price / sq ft** = `price / sqft`.
- **Gross Rental Yield** = `(rentPSF × 12 × sqft) / price`, with estimated monthly rent.
- **Value vs Area Benchmark** = `(listing PSF − district median PSF) / district median PSF`,
  shown neutrally (no colour/arrow) with a plain-language description.

**District median PSF resolves fresh on every page load** (freshest first):
1. Admin override (`site_content` key `benchmark.<district>`, `value_en`).
2. **Live median** of published listings in the same district (needs ≥ 3; recomputed each load).
3. Code fallback constant.
Rent PSF: admin override (`value_zh`) → code fallback.

Shared district logic: `src/lib/districts.ts` (`DISTRICTS`, `districtOf()`, `median()`).
Admin editor: `src/screens/AdminBenchmarks.tsx` at `/admin/benchmarks` (shows live median + count,
lets you pin overrides). Note: rent has no live source (listings are sale-only) — it stays
assumption/override based. All figures are labelled "indicative — not financial advice."

## 9. How to run / verify (this machine's setup)

- Node via nvm: `/Users/dimsumdin/.nvm/versions/node/v25.7.0/bin` on PATH.
- Dev server: `npm run dev` (serves **localhost:8080**). Keep ONE dev server running.
- Build: **stop dev first**, then `npm run build`. Do NOT `rm -rf .next` while dev is running
  (it deletes served chunks → CSS returns as text/html → "styling looks broken").
- Migrations: `PGURL="postgres://…:6543/postgres" node scripts/run-migration.mjs <path.sql>`.
- SEO artifacts: `scripts/generate-seo.mjs` (sitemap/robots/llms.txt).
- On this Mac the shell sandbox has **no network to Supabase**; DB/storage scripts were run on the
  Mac itself (via the desktop control tool) where network works. A different machine with normal
  network can run them directly.

## 10. Known gotchas

- Property detail route is `/projects/[slug]` (historical name), not `/properties/[slug]`.
- `site_content` DB values override `src/locales/*.json`; change BOTH (or just DB) for live text.
- API secret key ≠ Postgres password. DDL needs PGURL; data/storage/`site_content` need the secret key.
- Vercel must use the Next.js preset (not Vite) — `vercel.json` enforces it.
- Image import: source CDN sometimes served fewer photos than its stated count; that's expected.

## 11. Suggested next steps / open items

- Insert/curate remaining real listings; adjust the converted (indicative) prices to exact asking.
- Optionally make rent-PSF live if rental listings are ever added.
- Review the imported listings' copy and featured selection; then PR `feature/real-property` → main.

---

### How to use this handoff in a new conversation
1. On the other machine, clone the repo and checkout `feature/real-property`
   (`git clone … && git checkout feature/real-property`). This file comes with it.
2. Point the fresh Claude at this repo folder and say: "Read HANDOFF.md and README.md, then …".
3. Provide the two secrets (Supabase API secret key, and PGURL if a migration is needed) when asked
   — never paste them into files or commits.
