# Canopy Platform — Agent Guide

This repo is the **platform core** for Canopy. It contains the portal app and shared UI components. It is NOT a product implementation repo.

Read `README.md` for current implementation status. Read `docs/PRD.md` for the full product catalog and platform vision.
For provisioning ownership and PhotoVault retirement criteria, read `docs/workspace-provisioning-transition-plan.md`.

## Repos

| Repo | Purpose | Live URL |
|---|---|---|
| `canopy-platform` | Portal, identity, entitlements, provisioning, launch | `https://canopy-platform-portal.vercel.app` |
| `photovault` | PhotoVault by Canopy product | `https://photovault.school` |
| `canopy-stories` | Canopy Stories product | `https://canopy-stories.vercel.app` |
| `canopy-reach` | Canopy Reach product | `https://canopy-reach.vercel.app` |

All four repos share one Supabase project.

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript, Node 20
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss"` + `@theme inline` — no `tailwind.config.js`)
- **Auth/DB**: Supabase (shared project with photovault and canopy-stories)
- **Monorepo**: npm workspaces — `apps/portal/` and `packages/ui/`
- **Font**: Plus Jakarta Sans (via `next/font/google`)
- **Deployment**: Vercel

## Monorepo Structure

```
canopy-platform/
  apps/portal/          — portal app
  packages/ui/          — @canopy/ui shared component library
  tests/e2e/            — Playwright smoke coverage for portal and cross-app flows
  docs/                 — platform docs
```

## Key Source Files

| File | Purpose |
|---|---|
| `apps/portal/src/lib/platform.ts` | Session layer — resolves user, workspace, memberships, entitlements, operator state |
| `apps/portal/src/lib/products.ts` | Product catalog — definitions, state derivation, action targets |
| `apps/portal/src/lib/provisioning.ts` | Provisioning logic — workspace creation, invite send/resend, entitlement upsert, service-state reads, provisioning summary helpers |
| `apps/portal/src/app/(portal)/app/layout.tsx` | Authenticated shell — top bar + sidebar + content area |
| `apps/portal/src/app/(portal)/app/page.tsx` | Dashboard / product launcher |
| `apps/portal/src/app/(portal)/app/provisioning/page.tsx` | Operator provisioning UI |
| `apps/portal/src/app/(portal)/app/school-ops/page.tsx` | Super Admin school operations surface and owner transfer entry point |
| `apps/portal/src/app/(portal)/app/platform-users/page.tsx` | Super Admin internal platform-user management page |
| `docs/workspace-provisioning-transition-plan.md` | Active cutover plan for making Portal the single Super Admin provisioning workflow |
| `apps/portal/src/components/portal-header.tsx` | Top bar with brand mark, workspace chip, avatar dropdown |
| `apps/portal/src/components/portal-sidebar.tsx` | Left nav — contextual per section |
| `apps/portal/src/components/product-launcher-card.tsx` | Product tile on dashboard |
| `packages/ui/src/index.ts` | @canopy/ui exports |

## Routes

### Public
- `/` — marketing homepage
- `/sign-in` — sign-in page

### Auth / Launch
- `/auth/sign-in` — Supabase sign-in handler
- `/auth/sign-out` — clears portal cookies
- `/auth/accept-invite` — invite token acceptance, creates membership
- `/auth/launch/photovault` — one-time handoff exchange launch to PhotoVault
- `/auth/launch/stories` — one-time handoff exchange launch to Canopy Stories
- `/auth/launch/reach` — one-time handoff exchange launch to Canopy Reach
- `POST /auth/product-launch` — internal portal handoff for in-app product switching from Reach/Stories
- `POST /auth/portal-return` — internal portal cookie-restore path for returning from products to Portal

### Authenticated (`/app/*`)
- `/app` — dashboard
- `/app/account` — workspace + user details
- `/app/provisioning` — operator only: create workspaces, enable products, send invites
- `/app/school-ops` — Super Admin only: workspace ownership/status overview plus active-workspace launch shortcuts
- `/app/platform-users` — Super Admin only: internal Canopy team access management
- `/app/products/[slug]` — placeholder pages for not-yet-active products
- `/app/services/[slug]` — placeholder pages for services

### API
- `GET /api/portal-session` — returns resolved `PortalSession` for client components
- `POST /api/update-entitlement` — operator only: pause/resume/remove entitlements
- `POST /api/provision-workspace` — operator only: provisioning backend
- `POST /api/resend-workspace-invitation` — operator only: resend invite
- `POST /api/transfer-workspace-owner` — Super Admin only: invite a new owner and handle prior owner memberships
- `/api/platform-users` — Super Admin only: invite, update, and remove internal Portal team access
- `GET /api/get-workspace-services` — operator only: current service visibility/setup state for a workspace

## Data Model (Shared Supabase Project)

### Compatibility tables (originated in PhotoVault, still in use)
- `auth.users` — canonical auth identity
- `organizations` — current workspace bridge (maps to `Workspace` concept)
- `memberships` — workspace access (roles: `owner`, `admin`, `staff`, `uploader`, `viewer`)
- `profiles` — source for `platform_role` and `is_super_admin`

### Platform-owned tables
- `product_entitlements` — which products are enabled per workspace (`organization_id`, `product_key`, `status`, `setup_state`, `plan_key`, `source`)
- `workspace_service_states` — which managed services are visible per workspace
- `workspace_admin_invitations` — invitation lifecycle (`pending`, `sent`, `accepted`)

## Provisioning Ownership

- Portal is the intended long-term single Super Admin provisioning surface
- PhotoVault provisioning should be treated as a temporary compatibility path, not a permanent co-equal workflow
- The active cutover criteria, production smoke checklist, and operator-process shift rules live in `docs/workspace-provisioning-transition-plan.md`

## Product Keys

```typescript
type ProductKey =
  // Products
  | "photovault"
  | "stories_canopy"
  | "canopy_web"
  | "create_canopy"
  | "publish_canopy"
  | "community_canopy"
  | "reach_canopy"
  | "assist_canopy"
  | "insights_canopy"
  // Services
  | "website_setup"
  | "design_support"
  | "communications_support"
```

## Session and Auth Model

**Cookie names**: `canopy_portal_access_token`, `canopy_portal_refresh_token`

**PortalSession shape**:
```typescript
{
  user: { id, email, displayName }
  activeWorkspace: PortalWorkspace | null
  memberships: PortalMembership[]
  entitlements: PortalEntitlement[]
  platformRole: string | null
  isPlatformOperator: boolean
}
```

**Workspace resolution**: operators with `?workspace=<slug>` get that workspace as active context; without it they see a platform overview. Regular users get their workspace automatically.

## Product Launch Handoff Protocol

PhotoVault, Canopy Stories, and Canopy Reach launch through a one-time handoff exchange:

1. Portal verifies the workspace entitlement for the target product
2. Portal creates a short-lived single-use row in `product_launch_handoffs`
3. Portal redirects to the product's launch entry with the handoff code plus `?workspace=<slug>` and optional `?path=...`
4. The product calls its `/api/auth/exchange-handoff` route server-side to exchange the code for Supabase session tokens
5. The product sets the session locally and loads workspace context from its server-backed session endpoint

**In-app switchers**:
- Reach and Stories submit `POST /auth/product-launch` back to Portal so Portal can mint a fresh product handoff before redirecting to the target app
- Reach, Stories, and PhotoVault return to Portal through `POST /auth/portal-return` so Portal can restore its own cookies before redirecting to `/app`
- These POST redirects should use `303` semantics so the browser follows up with a normal `GET` to the destination app or portal page

Products do not receive raw auth tokens in the URL hash anymore.

Environment variables controlling product URLs:
- `PHOTOVAULT_APP_URL` (default: `https://photovault.school`)
- `STORIES_APP_URL` (default: `https://canopy-stories.vercel.app`)
- `REACH_APP_URL` (default: `https://canopy-reach.vercel.app`)

## @canopy/ui Design System

Located at `packages/ui/`. Installed as `"@canopy/ui": "*"`.

**Exports**: `Button`, `Badge`, `Input`, `Avatar`, `Card`, `Dialog`, `DropdownMenu`, `IconButton`, `Label`, `MenuSurface`, `SegmentedToggle`, `Select`, `Separator`, `Textarea`, `Typography`, `CanopyHeader`, `cn()`

**Design tokens** (defined in `globals.css` via `@theme inline`):
```
--navy:          #0f1f3d    bg-navy, text-navy
--navy-mid:      #1a3260
--blue:          #2563eb
--bg:            #eef2ff    (page background)
--surface:       #ffffff
--surface-muted: #f1f5f9
--ink:           #0f1f3d
--ink-2:         #374151
--muted:         #6b7280
--success:       #059669
--warning:       #d97706
--planned:       #7c3aed
```

**Shell layout**: `h-14` top bar + `260px` sidebar + `flex-1` content area. Same structure as PhotoVault's `MediaWorkspaceShell`.

## Architecture Rules

**This repo owns:**
- Sign-in entry and auth session
- Workspace resolution and active workspace context
- Product entitlements (what each workspace can access)
- Product launch decisions and handoff
- Operator provisioning and invitations
- `@canopy/ui` shared design system

**This repo does NOT own:**
- PhotoVault media workflows, albums, assets, share links
- Canopy Stories story projects, submissions, content generation
- Product-specific roles and permissions (those live in the product)
- Any future product's domain data

**Rules for working here:**
- Do not add product-specific workflow code to `canopy-platform`
- Do not add new frameworks without a strong reason
- Keep the portal focused on: identity, workspace context, entitlements, product launch
- Products receive workspace context via the handoff protocol — they do not reimplement identity
- Use `@canopy/ui` components; do not introduce new component libraries
- Prefer extending the Playwright smoke suite when fixing auth, launcher, or cross-app handoff regressions

## E2E Runtime Testing

- Playwright config lives at `playwright.config.ts`
- E2E specs live in `tests/e2e/`
- Default managed E2E base URL is `http://127.0.0.1:3100`
- The managed E2E server runs `npm run dev:e2e --workspace @canopy/portal`
- `apps/portal` uses `NEXT_DIST_DIR=.next-e2e` for E2E so the test server does not collide with a normal local `next dev`
- Required env vars to run authenticated smoke tests:
  - `E2E_PORTAL_EMAIL`
  - `E2E_PORTAL_PASSWORD`
- Required env vars for operator-only smoke coverage:
  - `E2E_SUPER_ADMIN_EMAIL`
  - `E2E_SUPER_ADMIN_PASSWORD`
- Optional env vars:
  - `E2E_EXPECTED_PORTAL_RETURN_URL`
  - `E2E_WORKSPACE_SLUG`
  - `E2E_STORIES_URL`
  - `E2E_REACH_URL`
  - `E2E_PHOTOVAULT_URL`
  - `PLAYWRIGHT_BASE_URL`
  - `PLAYWRIGHT_SKIP_WEBSERVER=1`
- Current smoke coverage includes:
  - portal auth and dashboard
  - Portal -> Stories -> switch -> Portal
  - Stories -> PhotoVault -> Portal
  - Reach -> PhotoVault -> Portal
  - Portal -> PhotoVault -> Portal
  - Portal -> Reach -> Portal
  - portal provisioning permissions
  - super-admin provisioning access
  - PhotoVault album creation + image upload
- `tests/e2e/photovault-media-smoke.spec.ts` creates real data in the target workspace, so expect a new album and uploaded image after each live run
- `tests/e2e/reach-media-smoke.spec.ts` is a conditional smoke and should only be expected to run when the selected workspace has Reach enabled plus connected social accounts for the composer

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PHOTOVAULT_APP_URL=           # defaults to https://photovault.school
STORIES_APP_URL=              # defaults to https://canopy-stories.vercel.app
REACH_APP_URL=                # defaults to https://canopy-reach.vercel.app
```
