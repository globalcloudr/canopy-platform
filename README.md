# Canopy Platform

Platform portal and shared infrastructure for the Canopy product suite.

**Live URL**: https://canopy-platform-portal.vercel.app
**Production domain (pending)**: https://usecanopy.school

## What Is Built and Live

### Portal App

- Supabase-backed sign-in with cookie-based sessions
- Workspace resolution — platform operators can switch workspaces; school users stay in a fixed school context
- Entitlement-aware product launcher — shows enabled products, pilot products, and service cards per workspace
- Role-aware navigation — school users see school context, product switching, and a direct path back to portal home; platform users retain true workspace switching
- Account page — workspace details, user info, active products and services
- Operator provisioning page (`/app/provisioning`) — create/select workspaces, enable products and services, invite workspace admins, resend invitations
- Invite acceptance flow — Supabase invite email → Canopy sign-in → membership creation → workspace redirect
- Neutral platform overview for operators without an explicit `?workspace=` selection
- Public homepage with product grid and marketing content
- Portal shell refreshed to match Reach and Stories with a lighter sidebar/content treatment and shared UI primitives

### Product Integrations

| Product | Status | Launch Route | Live URL |
|---|---|---|---|
| PhotoVault by Canopy | Live | `/auth/launch/photovault` | https://photovault.school |
| Canopy Stories | Live (beta) | `/auth/launch/stories` | https://canopy-stories.vercel.app |
| Canopy Reach | Active development | `/auth/launch/reach` | https://canopy-reach.vercel.app |

All products launch through a one-time handoff exchange. The portal creates a short-lived, single-use launch code in `product_launch_handoffs`, each product exchanges it server-side for session tokens, and the active workspace is carried by `?workspace=` plus a product-side server session endpoint.

Reach and Stories also route in-app product switching back through the portal so the portal can restore its own cookies and issue fresh cross-product handoffs. Internal switcher handlers live at:

- `POST /auth/product-launch` — product-to-product switching
- `POST /auth/portal-return` — product-to-portal return

### Shared UI (`@canopy/ui`)

Shared component library at `packages/ui/`. Used by Portal, Reach, and Stories for shared shell and surface styling.

Components: Button, Badge, Input, Avatar, Card, Dialog, DropdownMenu, IconButton, Label, MenuSurface, SegmentedToggle, Select, Separator, Textarea, Typography, CanopyHeader, AppSurface, AppPill, cn()

## What Is Not Done Yet

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
REACH_APP_URL=https://canopy-reach.vercel.app
```

## Database

Shared Supabase project with PhotoVault, Canopy Stories, and Canopy Reach.

Platform-owned tables: `product_entitlements`, `workspace_service_states`, `workspace_admin_invitations`

Migration SQL files are in `docs/sql/`.
