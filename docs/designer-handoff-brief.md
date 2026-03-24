# Canopy Designer Handoff Brief

Date: 2026-03-23
Repository: `/Users/zylstra/Code/canopy-platform`
Purpose: Give a designer a clear, practical starting point for Canopy visual design work

## Why This Brief Exists

The Canopy platform structure, product definitions, and portal architecture are now stable enough for production-quality design work to begin.

The current portal is a working concept mock — the dashboard structure, navigation model, and component patterns are implemented and functional, but the visual design is a baseline, not a final direction. The goal of this phase is to take everything that is structurally right about the current portal and make it look and feel like a product that can compete in the market.

This brief gives a designer:
- a clear picture of what Canopy is and who uses it
- the full product and service structure
- the approved visual direction and what is already implemented
- the specific screens that need production-quality design

## What Canopy Is

Canopy is a connected school growth platform for adult education schools.

It brings together the tools schools need to run their communications, manage their brand, publish content, and track their visibility — in one platform, with one login.

Canopy is the parent platform. Everything else is a product or service inside it.

## The Full Product and Service Catalog

### Products (software tools)

| Product | What it does |
|---|---|
| **PhotoVault** | School photo and brand asset library |
| **Canopy Web** | School website CMS |
| **Create Canopy** | Design request intake, version tracking, and file delivery |
| **Publish Canopy** | Digital publication library — class catalogs, brochures, program guides |
| **Stories Canopy** | AI-powered success story production — form intake → blog, social, video |
| **Community Canopy** | Email newsletters and school-to-community communications |
| **Reach Canopy** | Social media posting and scheduling |
| **Assist Canopy** | Staff knowledge and communications assistant |
| **Insights Canopy** | Cross-channel analytics and visibility reporting |

### Services (managed engagements)

| Service | What it means |
|---|---|
| **School Website Setup** | Canopy implements and launches the school's website |
| **Creative Retainer** | Canopy handles ongoing design work on the school's behalf |
| **Communications Support** | Canopy manages newsletters, social, and content for the school |

Products and services are distinct. Products are tools the school operates. Services are work Canopy does for the school. The dashboard treats them differently.

## Audience

Primary users of the portal:

- adult school administrators
- school communications and marketing staff
- front office and program staff

Secondary users (later):

- Canopy internal staff (operator view)
- multi-site school operators

Schools range from small community programs to large adult education centers. Users are not technically sophisticated. The portal must be immediately clear without training.

## Market Context

Canopy competes directionally in the same space as:

- **Finalsite** — polished, institutional, strong public presence
- **Edlio** — practical, role-aware, district-focused
- **Apptegy** — modern mobile-forward school communication
- **ParentSquare** — strong engagement and communication tools
- **CatapultCMS** — content and publication management

Design takeaway:
- The **public homepage** should feel as confident and polished as Finalsite
- The **portal dashboard** should feel as practical and clear as a modern SaaS product — not institutional-heavy, not consumer-light

Reference aesthetic: Stripe, Vercel, Linear — clean, fast, confident, purposeful. Not enterprise bloat. Not startup flashy.

## Approved Visual Direction

A visual direction has been approved and is already implemented in the portal concept mock. The designer should build on this direction, not replace it.

### Color System

```
Background:   #f0f4f8  (cool light gray-blue)
Surface:      #ffffff  (white panels)
Navy:         #0f1f3d  (primary — text, headers, brand)
Blue:         #2563eb  (accent — actions, links, CTAs)
Muted text:   #6b7280
Border:       rgba(15, 31, 61, 0.10)
```

### Product Icon Colors (per product)

Each product has a distinct icon color used in dashboard cards:

```
PhotoVault:        #0f1f3d  (navy)
Canopy Web:        #0d9488  (teal)
Create Canopy:     #ea580c  (orange)
Publish Canopy:    #0369a1  (sky blue)
Stories Canopy:    #d97706  (amber)
Community Canopy:  #7c3aed  (violet)
Reach Canopy:      #db2777  (rose)
Assist Canopy:     #4f46e5  (indigo)
Insights Canopy:   #16a34a  (green)
Services:          #374151  (gray)
```

### Typography

- **Font:** Inter (Google Fonts)
- Headings: weight 700–800, tight tracking
- Body: 0.9375rem, weight 400, line-height 1.65
- Eyebrow labels: 0.72rem, weight 700, uppercase, tracked, blue color

### What Not to Do

- No glassmorphism or backdrop-filter effects
- No warm cream or green tones — these were tried and rejected
- No Georgia or serif fonts
- No soft pastels

## Portal Design: What Already Exists

The portal concept mock at `apps/portal` includes:

- **Marketing homepage** — nav, hero, 6-product showcase grid
- **Sign-in page** — split layout (40% navy panel, 60% form)
- **Dashboard** — page header, "Your Apps" product grid, services list, "More from Canopy" dimmed grid
- **Account page** — workspace stats, active products/services list
- **Portal header** — sticky flat header with brand mark, nav links, workspace chip, account avatar

These screens are structurally correct and implement the approved color system. They are a working baseline, not a final design. The goal is to elevate them to production quality — stronger hierarchy, better spacing, more confident typography, polish across all states.

## What Needs Production Design

Priority screens, in order:

### 1. Dashboard (highest priority)

The center of the authenticated experience. Needs:
- Clear product card system — icon, name, description, status badge, action button
- Strong visual separation between "Your Apps", "Services", and "More from Canopy"
- Consistent card states: enabled, in setup, pilot, paused, not enabled
- Clean page header with workspace name, user context, and active product count
- Responsive behavior: 3-col → 2-col → 1-col

### 2. Portal Header

The persistent shell element visible on every authenticated page. Needs:
- Brand mark + Canopy wordmark
- Nav links (Home, Products, Account)
- Workspace indicator
- Account/avatar entry point
- Clean, flat, not distracting — the dashboard is the focus

### 3. Product Card Component

Used in both "Your Apps" and "More from Canopy". Needs:
- Icon mark (40px rounded square, product color, initial letter)
- Product name (bold)
- Short description (muted)
- Status badge (enabled / pilot / in setup / paused)
- Primary action button
- Optional secondary action link

### 4. Sign-In Page

Split layout is already approved. Needs polish:
- Left panel: navy background, white Canopy wordmark, headline, 3–4 feature bullets
- Right panel: light background, centered sign-in form
- Form: email, password, sign-in button (navy fill, full width), forgot password link

### 5. Marketing Homepage

Public-facing, more expressive than the portal. Needs:
- Nav with sign-in CTA
- Hero with headline, lede, and two CTAs
- Product showcase section (3-col grid)
- Stronger visual storytelling than the current mock

### 6. Account Page

Lower priority. Similar structure to the dashboard with:
- Workspace and membership details
- Active products/services list

## Card and Action System

Every product card should be task-oriented. Primary actions by product:

| Product | Primary Action |
|---|---|
| PhotoVault | View Photos |
| Canopy Web | Edit Website |
| Create Canopy | New Design Request |
| Publish Canopy | View Publications |
| Stories Canopy | New Story |
| Community Canopy | Create Newsletter |
| Reach Canopy | New Post |
| Assist Canopy | Open Assistant |
| Insights Canopy | View Reports |

Avoid generic labels like "Launch Product" or "Open App".

## Functional Constraints the Design Must Support

- **Dashboard-first**: authenticated users land on the dashboard, not a workspace chooser
- **Entitlement-aware**: the dashboard shows only what the workspace has access to — the design must support empty states and partial catalog views naturally
- **Product states**: every product card can be in one of: enabled, pilot, trial, in setup, paused, not enabled — all states need to look intentional
- **Products vs. services**: products = cards with action buttons; services = compact rows with status and contact actions — never mix these patterns
- **Multi-workspace ready**: the design should accommodate a workspace switcher in the header without requiring it to be prominent for single-workspace users

## MVP Product Sequence

The products being prioritized for the MVP build are:

1. PhotoVault — already in beta
2. Community Canopy — newsletters
3. Reach Canopy — social posting
4. Stories Canopy — AI story production
5. Publish Canopy — digital publications
6. Create Canopy — design requests

Each has a full MVP definition in `/docs/` — see the reference docs section below.

## Reference Docs

All planning docs are in `/Users/zylstra/Code/canopy-platform/docs/`:

| Doc | What it covers |
|---|---|
| `mvp-product-catalog.md` | Full product/service catalog and dashboard grouping model |
| `mvp-implementation-board.md` | Phase overview and current implementation status |
| `platform-navigation-model.md` | Portal navigation and header structure |
| `portal-mvp-scope.md` | Portal feature scope and constraints |
| `community-canopy-mvp.md` | Community Canopy product definition |
| `reach-canopy-mvp.md` | Reach Canopy product definition |
| `stories-canopy-mvp.md` | Stories Canopy product definition |
| `publish-canopy-mvp.md` | Publish Canopy product definition |
| `create-canopy-mvp.md` | Create Canopy product definition |
| `workspace-identity-model.md` | Workspace, user, and membership model |
| `product-entitlements.md` | Product entitlement states |

## Recommended Designer Deliverables

### First deliverable (alignment)

Before full design work, produce a single dashboard concept showing:
- one workspace with 3 enabled products
- one service row
- two "More from Canopy" products (dimmed)

This validates the card system, layout structure, and visual direction before building out all screens.

### Full deliverable set

1. Dashboard (all card states covered)
2. Portal header
3. Sign-in page
4. Marketing homepage
5. Account page
6. Component reference sheet: buttons, badges, cards, form elements, pills

## Success Criteria

Design work is successful if:

- the dashboard reads clearly at a glance — users know what they have and what to do
- product cards feel distinct from service rows without explanation
- the portal looks credible alongside Finalsite, Edlio, and similar platforms
- the design system is implementable by a developer without asking design questions
- the homepage and portal feel like the same platform family, not two separate sites
