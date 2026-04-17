# Canopy Platform — Progress and Current Work

Append new sessions at the top. Do not overwrite history.

---

## 2026-04-16 — Domain migration: portal moves to app.usecanopy.school

- Separated the marketing site from the portal at the domain level:
  - `usecanopy.school` → Astro marketing site (`canopy-marketing` Vercel project)
  - `app.usecanopy.school` → Canopy Portal (`canopy-platform-portal` Vercel project)
- Renamed route group `(portal)/app/` → `(portal)/(app)/` so portal routes serve from `/` instead of `/app`
- Updated all 54 internal `/app` path references across auth routes, sidebar, header, admin workflow, products, and page redirects
- Added backward-compat redirects in `next.config.ts`: `/app` → `/` and `/app/:path*` → `/:path*`
- Added `public/robots.txt` with `Disallow: /` to prevent search engines indexing the portal subdomain
- Deleted the old marketing homepage (`src/app/page.tsx`) — portal `/` now serves the authenticated dashboard directly
- Updated hardcoded `usecanopy.school` fallback in `products.ts` → `app.usecanopy.school`
- Updated all 5 product apps (community, stories, reach, photovault, create): `NEXT_PUBLIC_PORTAL_URL` fallback → `https://app.usecanopy.school`, removed `/app` from `portalHomeHref`
- Updated Supabase auth config: Site URL → `https://app.usecanopy.school`
- DNS: CNAME `app` → `ff5b5e4bb0bc80ba.vercel-dns-017.com` added at registrar

### Verification
- `npx tsc --noEmit` passed in all 5 product apps and portal
- Portal live at `https://app.usecanopy.school` ✅
- Marketing site live at `https://usecanopy.school` ✅
- Sign-in, workspace switching, product launch all verified working ✅

---

## 2026-04-14 — Portal public landing page replaced by Canopy Marketing

- Replaced Portal's hard-coded public marketing homepage with a redirect from `/` to the standalone `canopy-marketing` deployment
- Added `MARKETING_SITE_URL` env support so the public marketing destination can be changed without editing Portal code
- Kept Portal auth and application routes intact under `/sign-in` and `/app`

### Verification
- Pending build verification after the redirect patch

---

## 2026-04-14 — Canopy Create portal integration

- Added `create_canopy` to Portal's cross-product launch handoff type and routing
- Added `/auth/launch/create` so Portal can issue one-time Create handoffs like Stories, Reach, and PhotoVault
- Added `CREATE_APP_URL` support in both launch handlers and the product-launch API
- Updated the launcher catalog so enabled Create workspaces now:
  - primary action: open `Canopy Create` at `/requests/new`
  - secondary action: open `Canopy Create` requests
- Updated the Create product description to reflect the real product:
  - creative and web request intake
  - production tracking
  - revisions and final delivery
- Updated the `Creative Retainer` service description to reference Canopy Create directly
- Added Canopy Create to the Portal provisioning UI so Super Admin can enable it for a workspace
- Added a dedicated Portal product detail page for Canopy Create instead of falling through to the generic coming-soon page
- Added SQL migration `cp-007` so `product_launch_handoffs` accepts `create_canopy`

### Verification
- Pending build verification after the Portal patch set

---

## 2026-04-08 — Community launch handoff DB fix

- Added SQL migration `cp-006` to allow `community_canopy` in `product_launch_handoffs`
- This fixes local and production Community launch failures where the portal tried to create a handoff row but the table check constraint still only allowed PhotoVault, Stories, and Reach

### Verification
- Portal code already supports `community_canopy`; the remaining unblocker is applying the SQL migration

---

## 2026-04-02 — Beta security hardening

Pre-beta security review and hardening pass. Portal changes:

### Auth guard on `/api/portal-session`
- Added null session check — unauthenticated requests now return `401` instead of `200 { session: null }`
- Previously a logged-in user's full session (user ID, email, workspace IDs, roles, entitlements) was returned to any caller with valid cookies and no additional guard

### Error message sanitization
- Removed raw internal error messages from all API route catch blocks
- All routes now log full errors server-side and return generic messages to the client
- Files touched: `update-entitlement`, `invite-template`, `workspace-invitations`, `get-workspace-entitlements`, `platform-users`, `provision-workspace`, `update-service-state`, `get-workspace-services`, `resend-workspace-invitation`, `product-launch`, `save-workspace-provisioning`, `transfer-workspace-owner`

### Verification
- `npx tsc --noEmit` passed

---

## 2026-04-02 — Super Admin UX pass across Portal admin surfaces

- Added a shared Super Admin workflow rail to:
  - `/app/provisioning`
  - `/app/school-ops`
  - `/app/platform-users`
- The workflow rail now makes three things explicit on each page:
  - current page scope
  - selected workspace context
  - recommended next action
- Reworked the Portal sidebar information architecture so admin navigation is grouped into:
  - workspace pages
  - Super Admin pages
- Split admin invitation from products/services save on the provisioning page so the operator flow is easier to understand and less error-prone
- Added Portal invite-template editing so subject, body, signature, and preview now live in Portal instead of only in the legacy PhotoVault admin surface
- Improved School Ops scanning by surfacing schools that need owner attention first and summarizing owner state counts
- Tightened the Portal shell layout so the lavender shell background no longer peeks through on desktop overscroll at the bottom of long admin pages

### Verification
- `npm run build` passed in `canopy-platform`

---

## 2026-04-02 — Moved remaining Super Admin admin surfaces into Portal

- Added `School Ops` to Portal at `/app/school-ops`
  - workspace ownership status across schools
  - direct launch shortcuts for active Brand Portal and audit
  - ownership transfer flow from Portal
- Added `Platform Users` to Portal at `/app/platform-users`
  - invite internal platform users
  - update platform role
  - remove platform access
- Added Portal APIs to support those surfaces:
  - `POST /api/transfer-workspace-owner`
  - `/api/platform-users`
- Updated the Portal sidebar so Super Admin can reach `Provisioning`, `School Ops`, and `Platform Users` without dropping back into PhotoVault
- This replaces the last major PhotoVault-hosted platform-admin screens that were still missing from Portal and moves Portal closer to being the single Super Admin home

### Verification
- `npm run build` passed in `canopy-platform`

---

## 2026-04-02 — Portal provisioning visibility tightened for PhotoVault cutover

- Hardened Portal workspace creation with a preflight duplicate-slug check so operators get a clear error before creating a duplicate workspace
- Added current service-state visibility to `/app/provisioning` alongside the existing current-product entitlement view
- Added a derived provisioning-status summary for the selected workspace so operators can quickly see whether it is:
  - not started
  - invited
  - accepted
  - active
  - incomplete
- Added `GET /api/get-workspace-services` to support the operator-facing service visibility panel
- This closes a key cutover gap from the active `docs/workspace-provisioning-transition-plan.md`: operators can now understand current product, service, and invitation state in Portal without dropping back into PhotoVault for basic provisioning context

### Verification
- `npm run build` passed in `canopy-platform`

---

## 2026-04-02 — Provisioning transition plan promoted into active Portal docs

- Moved the old archived provisioning transition work back into an active document at `docs/workspace-provisioning-transition-plan.md`
- Tightened the plan around the current product decision:
  - Portal is the long-term single Super Admin provisioning workflow
  - PhotoVault remains a temporary compatibility path only until Portal fully replaces the operational flow
- Added explicit production cutover requirements:
  - required Portal capabilities before retirement
  - production smoke checks before operator workflow shifts
  - cutover stages for docs, operator process, and final cleanup
- Documented what remains product-local in PhotoVault after the transition so platform and product responsibilities stay separated

### Verification
- Active transition plan now exists in current docs instead of archive-only form

---

## 2026-04-02 — Playwright smoke expansion across product switching, permissions, and media

- Expanded the original two-test Playwright scaffold into a broader live runtime smoke suite:
  - `tests/e2e/cross-product-smoke.spec.ts`
  - `tests/e2e/product-return-smoke.spec.ts`
  - `tests/e2e/portal-permissions-smoke.spec.ts`
  - `tests/e2e/super-admin-smoke.spec.ts`
  - `tests/e2e/photovault-media-smoke.spec.ts`
  - `tests/e2e/reach-media-smoke.spec.ts`
- Added shared helper coverage in `tests/e2e/support/portal.ts` for:
  - portal dashboard assertions
  - super-admin sign-in
  - Reach / Stories / PhotoVault readiness checks
  - PhotoVault return-control handling
- Used live Playwright runs to find and fix real runtime bugs:
  - Stories first-load crash caused by array assumptions after a `401`
  - Stories and Reach switcher race conditions that fell back to the public portal homepage
  - PhotoVault launch handoff only working on `/` and not on direct routes like `/albums`
  - PhotoVault portal-return race condition that could fall back to the public homepage
- Added one real media smoke through PhotoVault:
  - create a new album
  - upload one unique image fixture
  - assert the upload queue and photo count update
- Reach media smoke remains conditional by environment:
  - it should only run when the selected workspace both has Reach enabled and has connected social accounts ready for composer/upload testing
  - current live `Global Cloudr` workspace switches successfully, but Portal does not presently expose Reach as an enabled launcher there

### Verification
- `npm run test:e2e` passed live with:
  - `9 passed`
  - `1 skipped` (`reach-media-smoke.spec.ts`, skipped because the current live workspace setup does not satisfy its Reach entitlement/account prerequisites)

---

## 2026-04-02 — Playwright runtime smoke scaffold

- Added a first Playwright runtime testing scaffold at the repo root:
  - `playwright.config.ts`
  - `tests/e2e/portal-auth.spec.ts`
  - `tests/e2e/cross-app-smoke.spec.ts`
  - `tests/e2e/support/*`
- Added root scripts:
  - `npm run test:e2e`
  - `npm run test:e2e:headed`
- Added `apps/portal` E2E dev script on port `3100`
- Added `NEXT_DIST_DIR=.next-e2e` support so the Playwright-managed portal server can run without colliding with a normal local `next dev`
- Current smoke coverage is intentionally small:
  - sign in to Portal
  - verify dashboard loads
  - launch Stories from Portal
  - switch from Stories to Reach
  - return from Reach to Portal
- Verified the scaffold boots and skips cleanly when `E2E_PORTAL_EMAIL` / `E2E_PORTAL_PASSWORD` are not configured

### Verification
- `npm run test:e2e` passed with both tests skipped when E2E credential env vars were absent

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

## Current Status (as of 2026-04-16)

The portal is live at `https://app.usecanopy.school`. The public marketing site is live at `https://usecanopy.school`. Five connected products are wired into the platform. The platform handles cookie-backed auth, one-time cross-product launch exchange, server-backed workspace context, entitlements, provisioning, invitations, and shared navigation across all products.

## What Was Recently Completed

- Domain migration: portal moved from `usecanopy.school/app` to `app.usecanopy.school`
- Marketing site (`canopy-marketing`) launched at `usecanopy.school` with Astro, Campaign Monitor newsletter/contact form, Calendly CTAs
- Route group restructure: portal routes now at `/` instead of `/app`
- Canopy Community (`community_canopy`) added as a live product
- Canopy Create (`create_canopy`) added to platform with launch handoff
- All product apps updated to point back to `app.usecanopy.school`

## Open Items

### Medium priority
- **Workspace switching in PhotoVault** — super admins must return to portal to switch workspaces; PhotoVault header does not expose workspace switcher
- **`workspaces` table migration** — portal currently uses `organizations` as the workspace bridge; a dedicated `workspaces` table is a future migration

### Low priority / future
- SQL migration files in `docs/sql/` should eventually move to `supabase/migrations/` in each respective repo

## Active Products

- **PhotoVault** — Live at https://photovault.school
- **Canopy Stories** — Live at https://canopy-stories.vercel.app
- **Canopy Reach** — Live at https://canopy-reach.vercel.app
- **Canopy Community** — Live at https://canopy-community.vercel.app
- **Canopy Create** — Live (URL via `CREATE_APP_URL` env)

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
