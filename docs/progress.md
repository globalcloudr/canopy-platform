# Canopy Platform — Progress and Current Work

Append new sessions at the top. Do not overwrite history.

---

## 2026-04-01 — Switcher stabilization and portal handoff cleanup

- Added internal Portal POST handlers for in-app switching and return flows:
  - `POST /auth/product-launch`
  - `POST /auth/portal-return`
- Updated Reach and Stories to route product switching and Portal return through those handlers instead of relying on brittle cross-site fetch redirects
- Updated PhotoVault's top app control to return through Portal's cookie-restore flow instead of a plain link
- Corrected PhotoVault's default product launch target to `/albums`
- Updated production fallback app URLs so missing env vars no longer silently redirect switchers to `localhost`
- Forced the POST-based handoff redirects to use `303` so browsers follow up with `GET` requests to the destination app, avoiding product-side `405` errors
- Extended `@canopy/ui` `CanopyHeader` so product shells can wire Portal-return callbacks instead of only plain `href` links

### Verification
- `npm run build` passed in:
  - `canopy-platform/packages/ui`
  - `canopy-reach`
  - `canopy-stories`

---

## 2026-03-31 — Launch hardening and server-backed workspace sessions

- Replaced raw cross-product token handoff with a one-time launch exchange:
  - Portal now creates short-lived single-use handoff records in `product_launch_handoffs`
  - Reach, Stories, and PhotoVault exchange launch codes server-side before calling `supabase.auth.setSession`
- Added SQL migration `cp-005` for the new launch-handoff table
- Moved active workspace resolution to product-side server session endpoints:
  - Reach: `/api/app-session`
  - Stories: `/api/app-session`
  - PhotoVault: `/api/org-session`
- Products no longer rediscover workspace context from mixed client-side fallbacks on first load
- Hardened Portal session resolution so it only trusts the real cookie-backed Supabase session and not caller-supplied email params

### Verification
- `npm run build` passed in:
  - `canopy-platform/apps/portal`
  - `canopy-reach`
  - `canopy-stories`
  - `photovault`

---

## 2026-03-31 — Shared navigation and Portal visual alignment

- Added shared shell primitives to `@canopy/ui`:
  - `AppSurface`
  - `AppPill`
- Updated Portal, Reach, and Stories to consume the newer shared shell/surface language instead of drifting page by page
- Refined the platform navigation model:
  - platform operators still have a true workspace switcher in the header
  - school users now see a fixed school context instead of a misleading school switcher
  - the sidebar school lockup now acts as the school-level product launcher
  - Reach and Stories now expose a direct `Back to portal home` path for the current school
- Aligned Portal’s shell, dashboard, account page, provisioning page, launcher cards, and sidebar with the newer Reach/Stories visual system
- Added launcher-product APIs in Reach and Stories so the product switcher only shows products the current workspace is actually entitled to

### Verification
- `npm run build` passed in:
  - `canopy-platform/apps/portal`
  - `canopy-reach`
  - `canopy-stories`

---

## 2026-03-30 — Canopy Reach provisioning and product page

- Added Canopy Reach (`reach_canopy`) to the Provisioning page — operators can now enable it for workspaces alongside PhotoVault and Stories
- Added full `/app/products/reach-canopy` detail page (how it works, highlights, request access CTA) matching the Stories and PhotoVault pattern
- "Open Reach" link added to the operator sidebar under Launch

---

## 2026-03-30 — Canopy Reach portal integration

- Added `/auth/launch/reach` launch route (later hardened into the one-time handoff exchange pattern now used by all products)
- Added `getReachLaunchPath()` to `products.ts`; `reach_canopy` catalog entry now has `externalUrl` and live launch paths
- Primary action (enabled/pilot): launches to `/posts/new`
- Secondary action: launches to `/calendar`
- `REACH_APP_URL` added to `.env.local` (localhost:3002 for dev; update to Vercel URL on deploy)

---

## 2026-03-30 — Infrastructure and email resolved

- `usecanopy.school` domain attached to Vercel deployment
- `STORIES_APP_URL` env var set in Vercel; Stories now launches to the live URL in production
- Invite email branding implemented; no longer riding Supabase default templates

---

## 2026-03-28 — Documentation overhaul

Replaced ~35 docs across `docs/` with a consistent 4-file framework (CLAUDE.md, README.md, docs/PRD.md, docs/progress.md). All old docs moved to `docs/archive/`. Replit reference implementations archived to `docs/archive/references/`. Unbuilt product specs kept as `docs/community-prd.md`, `docs/reach-prd.md`, `docs/create-prd.md`, `docs/publish-prd.md`.

Key accuracy fixes applied during the audit:
- Cross-domain SSO between Canopy and PhotoVault marked as done (was incorrectly shown as pending in old docs)
- Canopy Stories marked as live/beta (old docs still described it as a planned migration)
- `STORIES_APP_URL` Vercel env gap identified and logged as a high-priority open item

---

## Current Status (as of 2026-03-31)

The portal is live and functional. Three connected products are wired into the platform surface: PhotoVault, Canopy Stories, and Canopy Reach. The platform now handles cookie-backed auth, one-time cross-product launch exchange, server-backed workspace context, entitlements, provisioning, invitations, and shared navigation for all three.

## What Was Recently Completed

- One-time launch exchange implemented across Portal, Reach, Stories, and PhotoVault
- Server-backed workspace session endpoints added to products to eliminate first-load workspace drift
- Portal session resolution hardened to rely only on cookie-backed auth
- Header and sidebar navigation cleanup for platform users and school users
- Operator provisioning: workspace creation, product/service enablement, invite send/resend, invite acceptance

## Open Items

### Medium priority
- **`workspaces` table migration** — portal currently uses `organizations` as the workspace bridge; a dedicated `workspaces` table is a future migration (no urgency while shared Supabase works)

### Low priority / future
- SQL migration files in `docs/sql/` should eventually move to `supabase/migrations/` in each respective repo
- `references/replit/` folder archived — contains Replit prototypes of future products (Community, Reach, Create, Publish, etc.) that will be rebuilt as Canopy products

## Active Products

- **PhotoVault** — Live at https://photovault.school
- **Canopy Stories** — Live (beta) at https://canopy-stories.vercel.app
- **Canopy Reach** — Active development at https://canopy-reach.vercel.app (portal-connected, school account flow and media foundation in place)

## Future Products

Candidates and their specs:

- `docs/community-prd.md` — Canopy Community (newsletter)
- `docs/create-prd.md` — Canopy Create (design requests)
- `docs/publish-prd.md` — Canopy Publish (digital publications)

## Architecture Decisions (Locked)

- One shared Supabase project across all products (canopy-platform, photovault, canopy-stories, canopy-reach)
- Products run on separate domains and launch via a one-time handoff exchange, not a shared session cookie or raw token hash
- Each product resolves active workspace from a server-backed session endpoint rather than rediscovering context client-side
- School users should not see a fake cross-school switcher; school context is fixed and product switching belongs in the workspace launcher
- `organizations` table remains the workspace bridge for MVP; no forced migration to a `workspaces` table yet
- Platform operators use `profiles.platform_role` as the compatibility source for operator access
- Each product repo stays separate; no product workflow code in `canopy-platform`
