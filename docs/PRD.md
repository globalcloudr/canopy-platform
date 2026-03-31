# Canopy Platform — Product Requirements

## What Canopy Is

Canopy is a multi-product platform that gives adult education schools the digital marketing and communications tools they need — built as one connected system rather than a collection of disconnected tools.

The platform has three layers:
1. **Portal** (`usecanopy.school`) — identity, workspace, entitlements, product launch
2. **Products** — distinct apps with their own workflows and domain data
3. **Shared services** — `@canopy/ui` design system; shared Supabase project for auth and platform tables

Schools sign in once through Canopy and access all products they are entitled to.

## Platform Portal Scope

The portal is intentionally narrow. It owns:

- Authentication (sign-in, sign-out, invite acceptance)
- Workspace resolution and active workspace context
- Product entitlement visibility and state
- Product launch (handoff to product apps)
- Operator provisioning (workspace creation, product enablement, invitations)
- Account and service visibility

The portal does **not** own any product workflow. Each product handles its own domain.

## Product Catalog

### Live Products

| Product | Key | URL | Status |
|---|---|---|---|
| PhotoVault by Canopy | `photovault` | https://photovault.school | Live |
| Canopy Stories | `stories_canopy` | https://canopy-stories.vercel.app | Beta |
| Canopy Reach | `reach_canopy` | https://canopy-reach.vercel.app | Active development |

### Planned Products

| Product | Key | Description |
|---|---|---|
| Canopy Community | `community_canopy` | Newsletter and recurring school communication |
| Canopy Create | `create_canopy` | Design request and collateral production |
| Canopy Publish | `publish_canopy` | Digital brochures and publication management |
| Canopy Website | `canopy_web` | School web publishing and CMS |
| Canopy Assistant | `assist_canopy` | AI knowledge and communication layer |
| Canopy Insights | `insights_canopy` | Cross-product reporting and analytics |

See `docs/community-prd.md`, `docs/reach-prd.md`, `docs/create-prd.md`, `docs/publish-prd.md` for specs when starting those products.

### Managed Services

| Service | Key | Description |
|---|---|---|
| Website Setup | `website_setup` | Canopy-managed website implementation |
| Design Support | `design_support` | Creative retainer service |
| Communications Support | `communications_support` | Managed communications delivery |

## Workspace and Identity Model

- Each school customer is a **Workspace** (currently bridged through the `organizations` table)
- Users join workspaces through **Memberships**
- Workspace roles: `owner`, `admin`, `staff`, `social_media`, `uploader`, `viewer`
- Platform operators have `platform_role = 'super_admin'` or `'platform_staff'` in `profiles`
- **ProductEntitlements** control which products a workspace can access

Entitlement statuses: `trial`, `active`, `pilot`, `paused`
Setup states: `not_started`, `in_setup`, `ready`, `blocked`

## Product Entitlement Model

Access is workspace-first: the school account is entitled to a product, and users inherit access through membership.

The portal determines:
- Whether the workspace can access a product
- What state the product is in (active, pilot, setup, paused)
- Whether the user should be allowed to launch it

The product determines:
- What the user can do inside the product
- Product-specific roles and permissions

## Launch Handoff Protocol

When a user launches a product, the portal:
1. Creates a fresh Supabase session
2. Writes a short-lived single-use launch record to `product_launch_handoffs`
3. Redirects to the product with `?launch=<code>&workspace=<slug>`
4. The product exchanges that code server-side for session tokens, sets the Supabase session locally, and then resolves the active workspace from its own server session endpoint

Products must verify the session and workspace membership on receipt — they do not trust the launch URL alone.

## Navigation Model

- Platform operators can switch workspaces from the header.
- School users should stay anchored to their current school context rather than seeing a misleading cross-school switcher.
- Product switching for school users belongs in the workspace launcher, not in the global header control.
- Products should provide an intuitive path back to the current school’s Portal home.

## Design System

`@canopy/ui` is the shared component library for all Canopy products. Products should use it for consistent UI.

Primary brand color: navy `#0f1f3d`. Accent: blue `#2563eb`. Background: `#eef2ff`.

Shell pattern: `h-14` top bar + left sidebar + flex content area. All products should follow this shell to feel like the same product family, with a lighter content canvas, transparent outer surfaces, and consistent sidebar treatment.
