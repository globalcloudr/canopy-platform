# Canopy Platform Navigation Model

Date: 2026-03-24 (updated)

## Purpose

Define the navigation model for Canopy so the platform feels unified as products are added.

Navigation should make three things obvious:

- where the user is
- which workspace is active
- which products and services are available

## Core Principle

The portal is the **persistent shell** for the entire Canopy platform.

Users never leave the portal chrome. Products load inside it. The top bar and sidebar remain visible at all times, giving users a continuous sense of place across every product.

## Shell Layout

The authenticated shell uses a two-panel layout:

```
┌────────────────────────────────────────────────────────────────┐
│  [C] Canopy          [Org: School Name ▾]           [Avatar]  │  h-14 top bar
├───────────────┬────────────────────────────────────────────────┤
│               │                                                │
│  Sidebar nav  │  Main content area                             │
│  (contextual) │  (product or portal page loads here)          │
│               │                                                │
└───────────────┴────────────────────────────────────────────────┘
     260px                    flex-1
```

### Top Bar (persistent)

Always visible. Contains:

- Canopy brand mark (navy `C` square) + "Canopy" wordmark — links to portal home
- **Product/workspace chip** — shows active org name, opens product switcher on click
- **Avatar** — opens account dropdown (user info, account settings, help, feedback, sign out)

The product switcher chip is where users move between products. It shows:
- The user's enabled products with links
- Live products (currently PhotoVault) link to their deployed URL
- Not-yet-live products link to their placeholder page within the portal
- A "Back to portal home" link at the bottom

### Sidebar (contextual)

The sidebar changes based on which product context is active.

**Portal context** (Home, Account pages):
- Portal section label
- Home
- Account

**Product context** (when a product loads inside the shell):
- Product section label
- Product-specific nav items (e.g., Albums, Photo Library, Brand Portal for PhotoVault)

This gives each product its own navigation without polluting the portal's nav with every product's structure.

### Main Content Area

All portal pages and product views render here. Scrollable, full height.

## Public vs Authenticated Navigation

### Public Site

Purpose: explain Canopy, present products, route users to sign-in.

Recommended public navigation:
- `Products`
- `Services`
- `About`
- `Sign in`

### Authenticated Portal

Purpose: orient the signed-in user, show their products, provide account entry.

The authenticated portal should feel operational, not promotional.

Default landing destination: dashboard (not a chooser or intermediary screen).

## Portal Page Structure

### Home (Dashboard)

- Page header card (workspace name, role, active product count)
- Your Apps — enabled product cards
- Services — active managed services
- More from Canopy — upsell panel for not-yet-enabled products

### Account

- Page header card (workspace name, user info, role)
- Organization details stat cards
- Products and services list

### Product Pages (placeholder)

Each product the workspace doesn't yet have active gets a placeholder page inside the portal at `/app/products/[slug]`. These show:

- Product icon, name, category, description
- "Coming soon" notice
- Contact CTA

Services get a similar page at `/app/services/[slug]`.

## Product Naming Model

Visible naming stays consistent everywhere:

- `PhotoVault by Canopy`
- `Canopy Website`
- `Canopy Create`
- `Canopy Publish`
- `Canopy Stories`
- `Canopy Community`
- `Canopy Reach`
- `Canopy Assistant`
- `Canopy Insights`

Pattern: **"Canopy [Function]"** — brand first, function second. Immediately readable without needing a description. PhotoVault keeps its established name with "by Canopy" appended to connect it to the platform.

## Product Switcher Model

The org chip in the top bar acts as the global product switcher.

Behavior:
- Shows the active workspace name with a down chevron
- Click opens a dropdown listing the user's enabled products
- Products with a live deployed URL (e.g., PhotoVault → `photovault.school`) open externally with an external link indicator
- Products without a live URL open their placeholder page inside the portal
- "Back to portal home" link at the bottom for when users are deep inside a product

This pattern is mirrored in each product app: PhotoVault shows "App · PhotoVault ▾" which links back to the Canopy portal.

## Portal-to-Product Relationship

**Phase A (current):** Portal and products are separate deployments. The portal links out to live products. Visual continuity is maintained through shared chrome (same brand mark, same chip pattern, same avatar style).

**Phase B (planned):** Products load inside the portal shell as routes. The sidebar switches to product-specific nav. Users never navigate to a different domain.

The shell layout was built with Phase B in mind — the sidebar and content area are already structured to support contextual product nav.

## What Should Not Be In The Portal Nav

- Full product-workflow navigation in the portal sidebar by default
- Large admin control panels as a default visible pattern
- Deep settings architecture in the main shell
- Notification systems (until real workflows justify them)

## Future Navigation Expansion

Later, the platform may support:

- Notifications center
- Support area
- Billing area
- Operator/admin tools
- Shared insights surfaces

Add these only when real workflows justify them.

## Summary

The Canopy navigation model is:

- **Persistent shell** — top bar and sidebar always visible
- **Contextual sidebar** — changes per product, always relevant
- **Product switcher chip** — the universal cross-product navigation control
- **Avatar dropdown** — account, help, support, sign out
- **Portal as home** — always the default destination, always accessible

That gives users a sense of one connected platform without forcing every product into the same technical shape.
