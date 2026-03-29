# Canopy Platform — Agent Guide

This repo is the **platform core** for Canopy. It contains the portal app and shared UI components. It is NOT a product implementation repo.

Read `README.md` for current implementation status. Read `docs/PRD.md` for the full product catalog and platform vision.

## Repos

| Repo | Purpose | Live URL |
|---|---|---|
| `canopy-platform` | Portal, identity, entitlements, provisioning, launch | `https://canopy-platform-portal.vercel.app` |
| `photovault` | PhotoVault by Canopy product | `https://photovault.school` |
| `canopy-stories` | Canopy Stories product | `https://canopy-stories.vercel.app` |

All three repos share one Supabase project.

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
  docs/                 — platform docs
```

## Key Source Files

| File | Purpose |
|---|---|
| `apps/portal/src/lib/platform.ts` | Session layer — resolves user, workspace, memberships, entitlements, operator state |
| `apps/portal/src/lib/products.ts` | Product catalog — definitions, state derivation, action targets |
| `apps/portal/src/lib/provisioning.ts` | Provisioning logic — workspace creation, invite send/resend, entitlement upsert |
| `apps/portal/src/app/(portal)/app/layout.tsx` | Authenticated shell — top bar + sidebar + content area |
| `apps/portal/src/app/(portal)/app/page.tsx` | Dashboard / product launcher |
| `apps/portal/src/app/(portal)/app/provisioning/page.tsx` | Operator provisioning UI |
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
- `/auth/launch/photovault` — token handoff to PhotoVault
- `/auth/launch/stories` — token handoff to Canopy Stories

### Authenticated (`/app/*`)
- `/app` — dashboard
- `/app/account` — workspace + user details
- `/app/provisioning` — operator only: create workspaces, enable products, send invites
- `/app/products/[slug]` — placeholder pages for not-yet-active products
- `/app/services/[slug]` — placeholder pages for services

### API
- `GET /api/portal-session` — returns resolved `PortalSession` for client components
- `POST /api/update-entitlement` — operator only: pause/resume/remove entitlements
- `POST /api/provision-workspace` — operator only: provisioning backend
- `POST /api/resend-workspace-invitation` — operator only: resend invite

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

Both PhotoVault and Canopy Stories receive auth tokens via URL hash:

```
{product-url}/auth/callback#access_token=...&refresh_token=...&type=canopy_handoff
```

Optional query params: `?workspace=<slug>&path=<destination>`

Environment variables controlling product URLs:
- `PHOTOVAULT_APP_URL` (default: `https://photovault.school`)
- `STORIES_APP_URL` (default: `http://localhost:3001` in dev)

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

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PHOTOVAULT_APP_URL=           # defaults to https://photovault.school
STORIES_APP_URL=              # defaults to http://localhost:3001
```
