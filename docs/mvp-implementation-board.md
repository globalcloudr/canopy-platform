# Canopy MVP Implementation Board

## Where We Are

| Phase | Name | Status |
|-------|------|--------|
| 0 | Platform Strategy and Shape | Complete |
| 1 | Platform Core Model | Complete (concept level) |
| 2 | Portal Structure and Workflow | Complete (mock level) |
| 3 | MVP Product Definition | Complete |
| 4 | Design System and Visual Design | **Complete** |
| **5** | **MVP Build** | **Next phase** |
| 6 | MVP Validation and Launch Readiness | Planned |

---

## Right Now — Phase 5 Entry Checklist

Before writing Phase 5 code, complete these steps:

| Step | Status |
|------|--------|
| Audit existing PhotoVault Supabase tables | Planned |
| Add `product_entitlements` table | Planned |
| Review and tighten RLS policies | Planned |
| Replace `platform.ts` mock with real Supabase queries | Planned |
| Keep PhotoVault domain tables logically separate | Planned |

Full detail: `docs/schema-implementation-path.md`

---

## MVP Product Sequence

| # | Product | Status | Notes |
|---|---------|--------|-------|
| 1 | PhotoVault by Canopy | Beta live at `photovault.school` | First connected product. Brand aligned. |
| 2 | Canopy Community | Planned | Newsletters. SendGrid-powered. |
| 3 | Canopy Reach | Planned | Social posting. Postiz engine. |
| 4 | Canopy Stories | Planned | AI success story production. Prototype exists. |
| 5 | Canopy Publish | Planned | Digital publications. Issuu-powered. |
| 6 | Canopy Create | Planned | Design request and file delivery workflow. |

---

## What the MVP Is

- A public Canopy homepage
- A working sign-in flow
- A school-facing dashboard
- Clear separation between products and services
- One real connected product launch (PhotoVault)
- Placeholder pages for all other products
- A believable path to the second and third products

---

## Phase Detail

### Phase 1: Platform Core Model

Purpose: Define the platform objects that power access and dashboard visibility.

| Task | Status | Doc |
|------|--------|-----|
| CP-001 — Canonical Workspace Model | Complete | `docs/workspace-identity-model.md` |
| CP-002 — User, Membership, and Platform Access Model | Complete | `docs/workspace-identity-model.md` |
| CP-003 — Product Entitlements v1 | Complete | `docs/product-entitlements.md` |
| CP-009 — Core Object Model | Complete | `docs/core-object-model.md` |

**Locked decisions:**
1. `Workspace` is the canonical implementation term. `Organization` is the plain-language equivalent.
2. Canopy owns invitation and membership long term.
3. School access starts with an invited admin/owner who can invite additional staff.
4. Products own product-specific roles. Canopy owns product enablement for the workspace.
5. In MVP, product enablement is managed manually by Canopy.
6. Dashboard visibility is driven by workspace product entitlements.

---

### Phase 2: Portal Structure and Workflow

Purpose: Define how the portal works before final design.

| Task | Status | Notes |
|------|--------|-------|
| CP-004 — Portal Shell and Navigation | Complete | Sidebar layout, contextual nav, product switcher chip |
| CP-005 — Authentication Entry Flow | Complete | Sign-in page, split-panel layout, mock session layer |
| CP-006 — Workspace Resolution and Switcher | Complete | Single-workspace lands on dashboard; multi-workspace via URL param |
| CP-007 — Entitlement-Aware Product Launcher | Complete | Full product catalog; all states; placeholder pages for non-live products |
| CP-008 — PhotoVault as First Connected Product | Complete | Brand aligned; links to `photovault.school`; switcher chip in both apps |
| CP-010 — Shared Event and Analytics Model | Planned | Feeds future Insights Canopy |
| CP-011 — Shared Brand and School Profile Metadata | Planned | Cross-product school identity layer |

---

### Phase 3: MVP Product Definition

Purpose: Define each MVP product clearly as a Canopy offering.

| Task | Status | Doc |
|------|--------|-----|
| CP-012 — Community Canopy MVP Definition | Complete | `docs/community-canopy-mvp.md` |
| CP-013 — Reach Canopy MVP Definition | Complete | `docs/reach-canopy-mvp.md` |
| CP-014 — MVP Product Catalog and Packaging | Complete | `docs/mvp-product-catalog.md` |
| CP-022 — Stories Canopy MVP Definition | Complete | `docs/stories-canopy-mvp.md` |
| CP-023 — Publish Canopy MVP Definition | Complete | `docs/publish-canopy-mvp.md` |
| CP-024 — Create Canopy MVP Definition | Complete | `docs/create-canopy-mvp.md` |

---

### Phase 4: Design System and Visual Design

Purpose: Turn the portal structure and product definitions into a real visual design.

| Task | Status | Notes |
|------|--------|-------|
| CP-015 — Design System Foundations | Complete | `@canopy/ui` package at `packages/ui/`; Button, Badge, Input, cn() |
| CP-016 — Portal Visual Design v1 | Complete | Sidebar layout, product switcher, avatar dropdown, placeholder pages |
| CP-017 — Homepage and Sign-In Visual Design v1 | Complete | Marketing hero, product grid, split-panel sign-in |

**What was built:**
- **Stack:** Tailwind v4 + shadcn/ui pattern. `@canopy/ui` shared package with Button, Badge, Input. Matches PhotoVault exactly.
- **Design tokens:** navy (`#0f1f3d`), blue (`#2563eb`), background (`#eef2ff`), white surfaces
- **Font:** Plus Jakarta Sans
- **Shell layout:** h-14 top bar + 260px sidebar + scrollable content area. Mirrors PhotoVault's `MediaWorkspaceShell`.
- **Product switcher:** Org chip in header opens dropdown of enabled products. PhotoVault links to `photovault.school`. Others link to internal placeholder pages.
- **Avatar dropdown:** User info, account settings, help & support, send feedback, sign out.
- **Placeholder pages:** Every product and service gets a branded placeholder page at `/app/products/[slug]` and `/app/services/[slug]`.
- **PhotoVault brand alignment:** PhotoVault's top bar updated to show Canopy brand mark. PhotoVault chip links back to `canopy.school`. Shared visual chrome creates continuity across both apps.
- **Navigation architecture decision:** Portal is the **persistent shell**. Products load inside it. Sidebar will switch to product-specific nav when a product is active (Phase B of integration, planned for Phase 5+).

**Exit criteria met:** Visual direction approved. Component and layout rules established. Portal and PhotoVault share recognizable visual chrome.

---

### Phase 5: MVP Build

Purpose: Replace the mock layer with real auth, real data, and real connected products.

| Task | Status | Notes |
|------|--------|-------|
| CP-018 — Real Auth and Supabase Connection | Planned | Replace `platform.ts` mock layer |
| CP-019 — Community Canopy Launch | Planned | Second product through the portal |
| CP-020 — Reach Canopy Launch | Planned | Third product through the portal |
| CP-021 — Operator and Account Surfaces | Planned | Workspace settings, service visibility, staff views |

**Phase 5 entry — before writing any code:**
1. Audit existing PhotoVault Supabase tables (platform-safe vs. product-specific)
2. Add `product_entitlements` table
3. Review and tighten RLS policies for platform-level workspace/role concepts
4. Replace `platform.ts` mock layer with real Supabase queries
5. Keep PhotoVault domain tables separate (same project, logically distinct)

Full detail: `docs/schema-implementation-path.md`

**Exit criteria:** Real sign-in works. Dashboard reflects real account state. PhotoVault launches through the portal with real workspace context. Community Canopy is available as the second product.

---

### Phase 6: MVP Validation and Launch Readiness

Purpose: Make the MVP usable, presentable, and ready for real school clients.

| Task | Status |
|------|--------|
| CP-025 — MVP Validation and Launch Checklist | Planned |

**Exit criteria:** MVP is understandable and presentable. Core school workflow can be demonstrated cleanly. Launch risks are documented.
