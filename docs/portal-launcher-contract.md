# Canopy Portal Launcher Contract

Date: 2026-03-24 (updated)

## Purpose

Define the implementation contract for the Canopy product launcher — how products are represented, what state they can be in, and how the portal routes users to the right place.

The launcher is one of the most important platform objects because it is where Canopy becomes visibly connected.

## Core Principle

The launcher answers four questions for the active workspace:

1. What products exist?
2. Which products are available here?
3. What state is each product in?
4. What can the user do next?

## Where the Launcher Appears

- **Dashboard (`/app`)** — primary launcher surface; product grid + services list
- **Product switcher chip** — global header; quick cross-product navigation
- **Product placeholder pages** — landing pages for not-yet-live products

## Launcher Inputs

### 1. Static Product Metadata

Platform-owned configuration per product. Defined in `apps/portal/src/lib/products.ts`.

Fields:

| Field | Type | Purpose |
|-------|------|---------|
| `productKey` | `ProductKey` | Canonical identifier (`community_canopy`, etc.) |
| `displayName` | `string` | Human-readable name shown in UI |
| `shortDescription` | `string` | One-line descriptor for cards and placeholders |
| `category` | `string` | Grouping label (e.g., "Community Communication") |
| `kind` | `"product" \| "service"` | Determines rendering and routing logic |
| `iconColor` | `string` | Hex color for icon mark and card accent |
| `defaultLaunchPath` | `string` | Fallback path if no state-specific target |
| `externalUrl` | `string?` | Live external deployment URL (if product is launched externally) |
| `showWhenNotEnabled` | `boolean` | Whether to show in "More from Canopy" when not entitled |
| `sortOrder` | `number` | Display order in launcher grid |

The `externalUrl` field is the key to the portal-to-product routing decision:
- If set and product is `enabled` or `pilot` → link goes to `externalUrl` (external app)
- If not set → link goes to an internal portal route (`/app/products/[slug]`)

Current `externalUrl` values:
- `photovault` → `https://photovault.school`
- All others → not set (internal placeholder pages)

### 2. Workspace-Specific Product State

Derived from the active workspace's entitlements. Computed in `getActionState()`.

Fields:

| Field | Type | Purpose |
|-------|------|---------|
| `state` | `ProductState` | Derived launcher state |
| `stateLabel` | `string` | Human-readable state label for badge |
| `canLaunch` | `boolean` | Whether the primary action is a real launch |
| `primaryActionLabel` | `string` | Button/link label |
| `primaryActionTarget` | `string` | Where the primary action routes to |
| `secondaryActionLabel` | `string?` | Optional secondary link label |
| `secondaryActionTarget` | `string?` | Optional secondary link target |
| `planKey` | `string?` | Plan identifier when relevant |

## Product States

| State | Conditions | Card Behavior |
|-------|-----------|---------------|
| `enabled` | Active entitlement, setup complete | Show launch action; link to `externalUrl` or internal app |
| `in_setup` | Entitlement exists, setup not complete | Show setup action; link to placeholder page |
| `pilot` | Entitlement status is `pilot` | Show pilot label; link to `externalUrl` or internal app |
| `paused` | Entitlement status is `paused` | No launch; link to placeholder page |
| `not_enabled` | No entitlement | Show in "More from Canopy"; link to placeholder page |
| `service` | Kind is `service` | Separate services section; link to service placeholder page |

## Action Target Resolution

`getPrimaryActionTarget()` resolves destinations automatically:

```
if externalUrl exists AND state is enabled/pilot → externalUrl
if state is service                              → /app/services/[slug]
otherwise                                        → /app/products/[slug]
```

Slugs are the hyphenated form of the product key: `community_canopy` → `community-canopy`.

## Product Placeholder Pages

Every product and service that doesn't have a live deployment gets a placeholder page inside the portal shell.

- Products: `/app/products/[slug]`
- Services: `/app/services/[slug]`

These pages show:
- Product icon (large, colored)
- Product category (eyebrow label)
- Product name and description (from catalog metadata)
- A "Coming soon" or "Managed by Canopy" notice
- A contact CTA (email link to `info@akkedisdigital.com`)
- "Back to dashboard" link

Because these pages live inside the portal's `(portal)/app/` layout, they render with the full sidebar and header chrome — users stay inside the platform experience.

## Card Contract

Each launcher card renders from a `LauncherProduct` shape (= `ProductDefinition & WorkspaceProductState`):

| Field | Used For |
|-------|---------|
| `displayName` | Card title |
| `shortDescription` | Card body text |
| `iconColor` | Icon background, top border accent, gradient tint |
| `state` | Badge variant |
| `stateLabel` | Badge text |
| `primaryActionLabel` | Primary link label |
| `primaryActionTarget` | Primary link href |
| `secondaryActionLabel` | Optional secondary link |
| `secondaryActionTarget` | Optional secondary link href |

## Dashboard Rendering Order

```
1. Enabled and pilot products    → "Your Apps" grid
2. Active services               → "Services" list
3. Not-enabled products          → "More from Canopy" upsell panel (dimmed)
```

Products not entitled and `showWhenNotEnabled: false` are hidden entirely.

## Product Switcher Contract

The header chip lists `kind: "product"` items that are not `not_enabled`:

- `externalUrl` set → real link, opens in new tab, shows external link icon
- `externalUrl` not set → links to `/app/products/[slug]` within portal
- "Back to portal home" always shown at bottom

## Recommended MVP Implementation Status

| Step | Status |
|------|--------|
| Product metadata registry in `products.ts` | Complete |
| Derived launcher-card object shape | Complete |
| Launcher state from entitlement and setup data | Complete (mock) |
| PhotoVault as first real launchable product | Complete — links to `photovault.school` |
| Product placeholder pages for all other products | Complete |
| Real entitlement data from Supabase | Planned (Phase 5) |

## Summary

The launcher contract combines:

- A stable product metadata registry with `externalUrl` for live products
- Workspace-specific entitlement state
- Automatic routing: external URL → live product, no URL → portal placeholder page
- Product placeholder pages that keep users inside the portal shell

That makes the portal feel like a real connected platform even when only one product is live.
