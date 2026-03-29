# Canopy Platform — Progress and Current Work

Append new sessions at the top. Do not overwrite history.

---

## 2026-03-28 — Documentation overhaul

Replaced ~35 docs across `docs/` with a consistent 4-file framework (CLAUDE.md, README.md, docs/PRD.md, docs/progress.md). All old docs moved to `docs/archive/`. Replit reference implementations archived to `docs/archive/references/`. Unbuilt product specs kept as `docs/community-prd.md`, `docs/reach-prd.md`, `docs/create-prd.md`, `docs/publish-prd.md`.

Key accuracy fixes applied during the audit:
- Cross-domain SSO between Canopy and PhotoVault marked as done (was incorrectly shown as pending in old docs)
- Canopy Stories marked as live/beta (old docs still described it as a planned migration)
- `STORIES_APP_URL` Vercel env gap identified and logged as a high-priority open item

---

## Current Status (as of 2026-03-28)

The portal is live and functional. Two products are connected: PhotoVault (live) and Canopy Stories (beta). The platform handles auth, workspace resolution, entitlements, provisioning, and product launch for both.

## What Was Recently Completed

- Seamless Canopy-to-PhotoVault login implemented (token handoff via URL hash)
- Canopy-to-Stories launch route added (`/auth/launch/stories`)
- Workspace param fix so users can log in directly from Canopy with correct workspace context
- Header area cleanup for Super Admin and Platform users
- Operator provisioning: workspace creation, product/service enablement, invite send/resend, invite acceptance

## Open Items

### High priority
- **Production domain** — `usecanopy.school` not yet attached to Vercel deployment
- **Stories production URL** — `STORIES_APP_URL` env var not set in Vercel; Stories launches to `localhost:3001` in production config; needs the live Vercel URL

### Medium priority
- **Invite email branding** — invite delivery still rides Supabase auth email infrastructure; a Canopy-branded email system is the target
- **`workspaces` table migration** — portal currently uses `organizations` as the workspace bridge; a dedicated `workspaces` table is a future migration (no urgency while shared Supabase works)

### Low priority / future
- SQL migration files in `docs/sql/` should eventually move to `supabase/migrations/` in each respective repo
- `references/replit/` folder archived — contains Replit prototypes of future products (Community, Reach, Create, Publish, etc.) that will be rebuilt as Canopy products

## Next Product

Canopy Stories is the current active product. Once it stabilizes out of beta, the next product to build will be determined. Candidates and their specs:

- `docs/community-prd.md` — Canopy Community (newsletter)
- `docs/reach-prd.md` — Canopy Reach (social media)
- `docs/create-prd.md` — Canopy Create (design requests)
- `docs/publish-prd.md` — Canopy Publish (digital publications)

## Architecture Decisions (Locked)

- One shared Supabase project across all products (canopy-platform, photovault, canopy-stories)
- Products run on separate domains and receive auth via token handoff, not a shared session cookie
- `organizations` table remains the workspace bridge for MVP; no forced migration to a `workspaces` table yet
- Platform operators use `profiles.platform_role` as the compatibility source for operator access
- Each product repo stays separate; no product workflow code in `canopy-platform`
