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

Users should feel like they are moving through one workspace surface, not jumping between unrelated tools. The shell should be strong enough that product changes feel contextual rather than disorienting.

## Shell Layout

The authenticated shell uses a two-panel layout:

```
┌────────────────────────────────────────────────────────────────┐
│  [C] Canopy     [Workspace ▾]                     [Avatar]     │  top bar
├────────────────────────────────────────────────────────────────┤
│  Portal | PhotoVault | Stories | ...                           │  app strip
├───────────────┬────────────────────────────────────────────────┤
│               │                                                │
│  Context rail │  Main content area                             │
│  (local nav)  │  (portal or product surface)                   │
│               │                                                │
└───────────────┴────────────────────────────────────────────────┘
     280px                    flex-1
```

### Top Bar (persistent)

Always visible. Contains:

- Canopy brand mark (navy `C` square) + "Canopy" wordmark — links to portal home
- **Workspace chip** — shows active org name, opens workspace switcher on click
- **Avatar** — opens account dropdown (user info, account settings, help, feedback, sign out)

The top bar should feel calm and infrastructural, not like a page header repeated on every screen.

### App Strip (persistent)

The app strip sits directly below the top bar and is the primary cross-product navigation layer.

It should show:

- `Portal`
- enabled products for the active workspace
- clear active-state treatment for the current area
- subtle product identity without turning into a marketing carousel

This is where users move between products.

It should show:
- The user's enabled products with links
- Live products (currently PhotoVault) link to their deployed URL
- Not-yet-live products link to their placeholder page within the portal
- Portal remains the first anchor point in the strip

### Context Rail (local)

The left rail changes based on which product context is active.

**Portal context** (Home, Account pages):
- local section label
- Home
- Account

**Product context** (when a product loads inside the shell):
- product section label
- Product-specific nav items (e.g., Albums, Photo Library, Brand Portal for PhotoVault)

This keeps product switching out of the local rail and avoids overloading one navigation surface with every decision at once.

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

## Product Switching Model

The shell separates workspace switching from product switching.

Behavior:
- the workspace chip in the top bar changes workspace context
- the app strip changes products
- the left rail changes local views within the current area

This separation is the key to making the platform feel seamless instead of crowded.

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

- **Persistent shell** — top bar, app strip, and context rail
- **Workspace switcher chip** — changes active workspace context
- **App strip** — universal cross-product navigation
- **Context rail** — local navigation only
- **Avatar dropdown** — account, help, support, sign out
- **Portal as home** — always the default destination, always accessible

That gives users a sense of one connected platform without forcing every product into the same technical shape.
