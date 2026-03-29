# MVP Product Catalog and Packaging

Date: 2026-03-23

## Purpose

Define how Canopy's products and services appear in the portal, how schools understand what they have, and how the dashboard catalog is structured.

## Two Types of Offerings

Canopy has two distinct types of offerings that must be clearly separated in the portal:

### Products

Software tools that school staff use directly through the Canopy portal. Products are self-serve by default, may have a managed service pathway, and are enabled per workspace through entitlements.

### Services

Managed engagements where Canopy does the work on a school's behalf — design retainers, communications management, website setup. Services are not software the school operates; they are work Canopy performs for the school. Services are visible in the portal so schools can track their status and contact Canopy, but they do not have a "launch" button.

This distinction matters in the portal: products have action buttons ("New Post", "View Publications"); services have status rows with contact or request actions.

## Full Product Catalog

### Products

| Product Key | Display Name | Primary Action (enabled) | Purpose |
|---|---|---|---|
| `photovault` | PhotoVault by Canopy | View Photos | School photo and brand asset management |
| `canopy_web` | Canopy Website | Edit Website | School website CMS |
| `create_canopy` | Canopy Create | New Design Request | Design request intake and delivery |
| `publish_canopy` | Canopy Publish | View Publications | Digital publication library (Issuu-powered) |
| `stories_canopy` | Canopy Stories | New Story | AI-powered success story production |
| `community_canopy` | Canopy Community | Create Newsletter | Email newsletters (SendGrid-powered) |
| `reach_canopy` | Canopy Reach | New Post | Social media posting and scheduling |
| `assist_canopy` | Canopy Assistant | Open Assistant | Staff knowledge and communications assistant |
| `insights_canopy` | Canopy Insights | View Reports | Cross-channel analytics and visibility |

### Services

| Product Key | Display Name | Purpose |
|---|---|---|
| `website_setup` | School Website Setup | Website implementation and launch support |
| `design_support` | Creative Retainer | Ongoing monthly design work handled by Canopy |
| `communications_support` | Communications Support | Managed newsletter, social, and content delivery |

## Dashboard Grouping Model

The portal dashboard presents offerings in three sections:

### 1. Your Apps

Products that the workspace has an active entitlement for — including `active`, `pilot`, `trial`, and `in_setup` states.

- Displayed as cards with an icon, product name, description, status badge, and action button
- Products in `in_setup` show a setup-specific action ("View Setup", "Start Website Setup")
- Products in `pilot` show the primary product action — pilot users are real users
- Ordered by `sortOrder` defined in the product catalog

### 2. Active Services

Services the workspace has an active engagement for.

- Displayed as compact rows (not cards) to visually distinguish them from products
- Each row shows: service icon, name, description, status badge, and a contact/request action
- Services in `in_setup` show "In Progress"

### 3. More from Canopy

Products the workspace does not yet have access to, shown in a dimmed style to signal they are available but not active.

- Visible when `showWhenNotEnabled` is true in the product definition
- Cards are visually de-emphasized (opacity reduced)
- Action is "View Product" — links to a product overview page
- Secondary action is "Request Access" — links to account/services
- This section serves as the discovery and upsell surface without being intrusive

## Entitlement States and Dashboard Behavior

| State | Dashboard behavior |
|---|---|
| `enabled` (active, ready) | Full product card with primary action |
| `pilot` | Full product card — treated same as enabled |
| `trial` | Full product card with trial label |
| `in_setup` | Product card with setup-specific action |
| `paused` | Product card with paused badge, no launch action |
| `not_enabled` | Appears in "More from Canopy" (dimmed) |

## Product Sort Order

Products appear in the following order across the dashboard:

1. PhotoVault by Canopy — media and brand assets
2. Canopy Website — website (high visibility, always-on)
3. Canopy Create — design production (feeds other products)
4. Canopy Publish — digital publications
5. Canopy Stories — content production pipeline
6. Canopy Community — newsletters
7. Canopy Reach — social posting
8. Canopy Assistant — staff assistant
9. Canopy Insights — analytics (reads from all other products)

Services follow products in the order: Website Setup, Creative Retainer, Communications Support.

## Request Access Pattern

When a school staff member sees a product in "More from Canopy" and wants it:

1. They click "View Product" — lands on a product overview page explaining what it does
2. From the product overview, they can click "Request Access" — sends a request to Canopy
3. Canopy reviews and manually enables the product for the workspace
4. The product appears in "Your Apps" on their next dashboard visit

At MVP, self-serve product activation does not exist. All product enablement is manual by Canopy. The request-access flow creates a clear touchpoint without requiring automated billing or provisioning.

## Products vs. Services: Edge Cases

### Canopy Create vs. Creative Retainer

`Canopy Create` is the product — the portal tool for submitting design requests, tracking status, and downloading delivered files. Any school can have it enabled and use it for one-off requests.

`Creative Retainer` is the service — an ongoing monthly engagement where Canopy handles a set amount of design work on the school's behalf. Schools on a creative retainer use Canopy Create as the delivery mechanism but have a broader service relationship with Canopy.

A school can have Canopy Create without a Creative Retainer. A school on a Creative Retainer will always have Canopy Create enabled.

### Canopy Community vs. Communications Support

`Canopy Community` is the product — school staff create and send their own newsletters.

`Communications Support` is the service — Canopy handles newsletter creation, social posting, and content management on the school's behalf. Schools using Communications Support access it through the same products (Canopy Community, Canopy Reach) but have Canopy staff operating those products for them.

## Implementation Notes

- Product definitions live in `apps/portal/src/lib/products.ts`
- Product keys are typed in `apps/portal/src/lib/platform.ts`
- The dashboard page (`apps/portal/src/app/(portal)/app/page.tsx`) renders the three sections using `getEnabledLauncherProducts`, `getLauncherServices`, and `getAdditionalLauncherProducts`
- Mock entitlements in `platform.ts` represent different workspace configurations for development and demo purposes
