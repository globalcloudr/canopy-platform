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
- Operator provisioning page (`/app/provisioning`) — create/select workspaces, enable products and services, invite workspace admins, resend invitations, and review current provisioning status for the selected workspace
- Super Admin `School Ops` page (`/app/school-ops`) — review owner status across schools, launch directly into Brand Portal/workspace/audit, and transfer ownership from Portal
- Super Admin `Platform Users` page (`/app/platform-users`) — invite and manage internal Portal team access from Portal instead of PhotoVault
- Active provisioning transition plan at `docs/workspace-provisioning-transition-plan.md` — defines Portal as the long-term Super Admin provisioning home and PhotoVault as a temporary compatibility path
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
- **Provisioning cutover completion** — Portal is the intended long-term provisioning owner, but PhotoVault remains a compatibility fallback until the cutover checklist in `docs/workspace-provisioning-transition-plan.md` is fully satisfied in production

## How to Run

```bash
npm install          # installs all workspace packages
npm run dev          # runs portal at localhost:3000
```

Portal only: `cd apps/portal && npm run dev`

## Playwright E2E

The repo now includes a live Playwright smoke suite for portal runtime testing.

Current coverage:
- portal sign-in smoke
- portal dashboard render smoke
- cross-app smoke: Portal -> Stories -> switch -> Portal
- cross-product smoke: Stories -> PhotoVault -> Portal
- cross-product smoke: Reach -> PhotoVault -> Portal
- product return smoke: Portal -> PhotoVault -> Portal
- product return smoke: Portal -> Reach -> Portal
- portal permissions smoke: regular workspace users are redirected away from `/app/provisioning`
- super-admin smoke: operator can load `/app/provisioning`
- PhotoVault media smoke: create an album and upload one image

Current conditional coverage:
- Reach media smoke exists, but it only runs when the chosen workspace actually has Canopy Reach enabled and connected social accounts ready for composer/upload testing

Run it with:

```bash
npm run test:e2e
```

Optional headed mode:

```bash
npm run test:e2e:headed
```

Interactive Playwright UI:

```bash
npm run test:e2e:ui
```

Open the HTML report after a run:

```bash
npm run test:e2e:report
```

Required E2E env vars:

```bash
E2E_PORTAL_EMAIL=
E2E_PORTAL_PASSWORD=
```

Optional E2E env vars:

```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100
E2E_EXPECTED_PORTAL_RETURN_URL=
E2E_WORKSPACE_SLUG=
E2E_STORIES_URL=https://canopy-stories.vercel.app
E2E_REACH_URL=https://canopy-reach.vercel.app
E2E_PHOTOVAULT_URL=https://photovault.school
E2E_SUPER_ADMIN_EMAIL=
E2E_SUPER_ADMIN_PASSWORD=
PLAYWRIGHT_SKIP_WEBSERVER=1
```

Notes:
- the Playwright web server uses `apps/portal` on port `3100`
- the E2E dev server uses a separate Next dist directory (`.next-e2e`) so it can run alongside normal local dev
- if the E2E credential env vars are missing, the smoke tests skip cleanly instead of failing
- live smoke runs usually set `PLAYWRIGHT_SKIP_WEBSERVER=1` and target deployed apps directly
- the PhotoVault media smoke creates a real album and uploads a real image on each run
- the Reach media smoke depends on a workspace that actually has Reach enabled and connected accounts; otherwise it should be treated as an environment precondition, not a product failure

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
