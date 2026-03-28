# Canopy Portal Technical Stack

Date: 2026-03-24 (updated)

## Current Stack

The portal is a Next.js application in the `canopy-platform` monorepo at `apps/portal/`.

### Application

- `Next.js 15` (App Router)
- `React 19`
- `TypeScript`
- `Node 20`

### Styling

- `Tailwind CSS v4` — `@import "tailwindcss"` + `@theme inline` block (no `tailwind.config.js`)
- `@canopy/ui` — shared component package (see below)
- `Plus Jakarta Sans` — portal font (via `next/font/google`)

### Shared Design System — `@canopy/ui`

Located at `packages/ui/` in the monorepo. Installed in the portal as `"@canopy/ui": "*"`.

Exports:
- `Button` — CVA variants: primary (navy), blue, secondary, ghost, destructive, link
- `Badge` — CVA variants matching `ProductState`: enabled, in_setup, pilot, paused, not_enabled, service
- `Input` — forwarded-ref input with Canopy token focus styles
- `cn()` — clsx + tailwind-merge utility

Dependencies inside `packages/ui`:
- `@radix-ui/react-slot` — for `asChild` pattern in Button
- `class-variance-authority` — component variants
- `clsx` + `tailwind-merge` — class merging

The portal's `next.config.ts` includes `transpilePackages: ["@canopy/ui"]` so the TypeScript source compiles correctly.

### Design Tokens (globals.css)

```
--navy:          #0f1f3d    bg-navy, text-navy
--navy-mid:      #1a3260    bg-navy-mid
--blue:          #2563eb    text-blue, bg-blue
--bg:            #eef2ff    bg-bg (page background)
--surface:       #ffffff    bg-surface
--surface-muted: #f1f5f9
--ink:           #0f1f3d    text-ink
--ink-2:         #374151    text-ink-2
--muted:         #6b7280    text-muted
--muted-light:   #9ca3af    text-muted-light
--success:       #059669
--warning:       #d97706
--planned:       #7c3aed
```

## Shell Layout

The authenticated portal (`apps/portal/src/app/(portal)/app/layout.tsx`) uses a two-panel layout:

- `h-14` top bar — white, `border-b`, sticky
- `260px` sidebar — `bg-[#f8faff]`, `border-r`, contextual nav
- Flex-1 content area — `p-8`, scrollable

This matches PhotoVault's `MediaWorkspaceShell` layout so both feel like the same product family.

## Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `PortalHeader` | `components/portal-header.tsx` | Top bar with brand, product switcher, avatar dropdown |
| `PortalSidebar` | `components/portal-sidebar.tsx` | Left nav with contextual links and icons |
| `ProductLauncherCard` | `components/product-launcher-card.tsx` | Product tile for dashboard grid |
| `SignInForm` | `components/sign-in-form.tsx` | Real Supabase sign-in form using `Input` and `Button` |

## Key Data Files

| File | Purpose |
|------|---------|
| `lib/platform.ts` | Portal session layer — resolves signed-in user, workspace context, memberships, entitlements, and operator state |
| `lib/products.ts` | Product catalog — definitions, state derivation, action targets |

`products.ts` is the source of truth for:
- Product metadata (name, description, category, iconColor, externalUrl)
- State derivation from entitlements
- Action label and target resolution (external URL vs. internal portal route)

## Routing

All authenticated portal routes live under `app/(portal)/app/`:

| Route | Description |
|-------|-------------|
| `/app` | Dashboard / product launcher |
| `/app/account` | Account and workspace details |
| `/app/products/[slug]` | Product placeholder page (coming soon) |
| `/app/services/[slug]` | Service placeholder page |

Product slugs are hyphenated versions of product keys (`community_canopy` → `community-canopy`).

## PhotoVault Alignment

The portal and PhotoVault share:
- Same brand mark in the top bar (navy `C` square + "Canopy" wordmark)
- Same product/workspace chip pattern (left of avatar)
- Same avatar style and position
- Same `h-14` top bar height and white background

PhotoVault's `media-workspace-shell.tsx` was updated to reflect Canopy branding. The portal links to PhotoVault at `https://photovault.school`. PhotoVault links back to the Canopy portal at `https://usecanopy.school`.

## Monorepo Structure

```
canopy-platform/
  apps/
    portal/           — Canopy portal app
  packages/
    ui/               — @canopy/ui shared design system
  docs/               — Platform documentation
```

Root `package.json` uses npm workspaces: `["apps/*", "packages/*"]`.

## What Is In The Stack Now

- Real Supabase authentication with cookie-backed portal sessions
- Real workspace and membership resolution from the shared Supabase project
- Real `product_entitlements` reads for launcher visibility
- Workspace-aware launch handoff into PhotoVault
- Operator-only workspace provisioning, service enablement, invitation send/resend, and invitation acceptance
- Live deployment at `https://canopy-platform-portal.vercel.app`

## What Is Not Yet In The Stack

- Final production domain (`usecanopy.school`) is not attached yet
- Seamless cross-domain session sharing between Canopy and PhotoVault is not finished yet
- Dedicated Canopy-owned email templates and admin tooling may still evolve
- Future products remain placeholder surfaces until they are actually built

## Near-Term Stack Decisions

The next backend and platform steps are:

1. Finish invite acceptance polish and operator follow-up tools
2. Improve cross-domain auth/session handoff between Canopy and PhotoVault
3. Continue moving platform-owned workflows from PhotoVault into Canopy
4. Keep product-specific PhotoVault workflows out of platform core

See `docs/schema-implementation-path.md` for full detail.
