# Canopy Platform

Platform portal and shared infrastructure for the Canopy product suite.

**Live URL**: https://canopy-platform-portal.vercel.app
**Production domain (pending)**: https://usecanopy.school

## What Is Built and Live

### Portal App

- Supabase-backed sign-in with cookie-based sessions
- Workspace resolution — single-workspace users land directly on dashboard; multi-workspace users get a switcher
- Entitlement-aware product launcher — shows enabled products, pilot products, and service cards per workspace
- Account page — workspace details, user info, active products and services
- Operator provisioning page (`/app/provisioning`) — create/select workspaces, enable products and services, invite workspace admins, resend invitations
- Invite acceptance flow — Supabase invite email → Canopy sign-in → membership creation → workspace redirect
- Neutral platform overview for operators without an explicit `?workspace=` selection
- Public homepage with product grid and marketing content

### Product Integrations

| Product | Status | Launch Route | Live URL |
|---|---|---|---|
| PhotoVault by Canopy | Live | `/auth/launch/photovault` | https://photovault.school |
| Canopy Stories | Live (beta) | `/auth/launch/stories` | https://canopy-stories.vercel.app |

Both products receive auth tokens via URL hash handoff (`type=canopy_handoff`) and honor `?workspace=` context.

### Shared UI (`@canopy/ui`)

Shared component library at `packages/ui/`. Used by the portal. Available for future products.

Components: Button, Badge, Input, Avatar, Card, Dialog, DropdownMenu, IconButton, Label, MenuSurface, SegmentedToggle, Select, Separator, Textarea, Typography, CanopyHeader, cn()

## What Is Not Done Yet

- **Production domain** — `usecanopy.school` not yet attached; portal runs on Vercel URL
- **Canopy Stories production URL** — `STORIES_APP_URL` defaults to `localhost:3001`; needs production value set in Vercel env
- **Dedicated Canopy invite email templates** — invite delivery still uses shared Supabase auth email infrastructure
- **Billing** — no billing management in the portal yet
- **`workspaces` table** — platform still uses `organizations` as the workspace bridge; a dedicated `workspaces` table is a planned future migration

## How to Run

```bash
npm install          # installs all workspace packages
npm run dev          # runs portal at localhost:3000
```

Portal only: `cd apps/portal && npm run dev`

## Environment Variables

Create `apps/portal/.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PHOTOVAULT_APP_URL=https://photovault.school
STORIES_APP_URL=https://canopy-stories.vercel.app
```

## Database

Shared Supabase project with PhotoVault and Canopy Stories.

Platform-owned tables: `product_entitlements`, `workspace_service_states`, `workspace_admin_invitations`

Migration SQL files are in `docs/sql/`.
