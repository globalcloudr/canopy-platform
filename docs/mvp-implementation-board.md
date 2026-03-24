# Canopy MVP Implementation Board

## Where We Are

| Phase | Name | Status |
|-------|------|--------|
| 0 | Platform Strategy and Shape | Complete |
| 1 | Platform Core Model | Complete (concept level) |
| 2 | Portal Structure and Workflow | Complete (mock level) |
| 3 | MVP Product Definition | Complete |
| **4** | **Design System and Visual Design** | **In Progress — current phase** |
| 5 | MVP Build | Planned |
| 6 | MVP Validation and Launch Readiness | Planned |

---

## Right Now (Phase 4 remaining)

| Task | Status |
|------|--------|
| CP-015 — Document the design system as a standalone reference | Started |
| CP-016 — Final design polish: dashboard, header, cards, services | Started |
| CP-017 — Final design polish: homepage, sign-in, copy review | Started |

When all three are done, move to Phase 5.

---

## MVP Product Sequence

The order products will be built and connected through the portal:

| # | Product | Notes |
|---|---------|-------|
| 1 | PhotoVault | First connected product. Existing app, beta. |
| 2 | Community Canopy | Newsletters. SendGrid-powered. |
| 3 | Reach Canopy | Social posting. Postiz engine. |
| 4 | Stories Canopy | AI success story production. Working prototype exists. |
| 5 | Publish Canopy | Digital publications. Issuu-powered. |
| 6 | Create Canopy | Design request and file delivery workflow. |

---

## What the MVP Is

- A public Canopy homepage
- A working sign-in flow
- A school-facing dashboard
- Clear separation between products and services
- One real connected product launch (PhotoVault)
- A believable path to the second and third products

The MVP is not every future product fully implemented, deep cross-product integration, or final polished design across every screen.

---

## Phase Detail

### Phase 1: Platform Core Model

Purpose: Define the platform objects that power access and dashboard visibility.

| Task | Status | Doc |
|------|--------|-----|
| CP-001 — Canonical Workspace Model | Complete (concept) | `docs/workspace-identity-model.md` |
| CP-002 — User, Membership, and Platform Access Model | Complete (concept) | `docs/workspace-identity-model.md` |
| CP-003 — Product Entitlements v1 | Complete (concept) | `docs/product-entitlements.md` |
| CP-009 — Core Object Model | Complete (concept) | `docs/core-object-model.md` |

**Exit criteria met:** Workspace, membership, and entitlement models are stable. We can explain who the user is, what organization they belong to, and what products they can access.

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
| CP-004 — Portal Shell and Navigation | Complete (mock) | Header, nav, workspace chip, product launcher all built |
| CP-005 — Authentication Entry Flow | Complete (mock) | Sign-in page, split-panel layout, mock session layer |
| CP-006 — Workspace Resolution and Switcher | Complete (mock) | Single-workspace lands on dashboard; multi-workspace via URL param |
| CP-007 — Entitlement-Aware Product Launcher | Complete (mock) | Full product catalog in `products.ts`; all states and sections |
| CP-008 — PhotoVault as First Connected Product | Complete (concept) | Launch URL, workspace context, auth handoff documented |
| CP-010 — Shared Event and Analytics Model | Planned | Feeds future Insights Canopy |
| CP-011 — Shared Brand and School Profile Metadata | Planned | Cross-product school identity layer |

**Exit criteria met:** Homepage, sign-in, and dashboard structure are clear. Products and services are separated. First connected-product handoff direction is documented.

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

**Exit criteria met:** All six MVP products have clear definitions. The portal knows how to present products vs. services. No unnecessary cross-product dependencies assumed.

---

### Phase 4: Design System and Visual Design

Purpose: Turn the portal structure and product definitions into a real visual design.

| Task | Status | Notes |
|------|--------|-------|
| CP-015 — Design System Foundations | Started | Implemented in `globals.css`; needs standalone doc |
| CP-016 — Portal Visual Design v1 | Started | Dashboard, header, cards, services built; needs polish |
| CP-017 — Homepage Visual Design v1 | Started | Hero, product grid, sign-in built; needs copy and marketing sections |

**Implemented so far:**
- Font: Plus Jakarta Sans
- Palette: deep navy (#0f1f3d), white, electric blue (#2563eb), light gray-blue (#f0f4f8)
- Dot-grid background texture
- Color-coded product cards with gradient tints and top-accent borders
- Dark navy marketing hero with radial glow and floating animated product icons
- Decorative SVG in dashboard header
- Designer handoff brief: `docs/designer-handoff-brief.md`

**Exit criteria:** Homepage and portal visual direction are approved. Component and spacing rules are clear enough for Phase 5 production implementation.

---

### Phase 5: MVP Build

Purpose: Replace the mock layer with real auth, real data, and real connected products.

| Task | Status | Notes |
|------|--------|-------|
| CP-018 — Community Canopy Launch | Planned | Second product through the portal |
| CP-019 — Reach Canopy Launch | Planned | Third product through the portal |
| CP-020 — Operator and Account Surfaces | Planned | Workspace settings, service visibility, staff views |

**Phase 5 entry point — before writing any code:**
1. Audit existing PhotoVault Supabase tables (platform-safe vs. product-specific)
2. Add `product_entitlements` table
3. Review and tighten RLS policies for platform-level workspace/role concepts
4. Replace `platform.ts` mock layer with real Supabase queries
5. Keep PhotoVault domain tables separate (same project, logically distinct)

Full detail: `docs/schema-implementation-path.md`

**Exit criteria:** Real sign-in works. Dashboard reflects real account state. PhotoVault launches through the portal. Community Canopy is available as the second product. Reach Canopy has a defined launch path.

---

### Phase 6: MVP Validation and Launch Readiness

Purpose: Make the MVP usable, presentable, and ready for real school clients.

| Task | Status |
|------|--------|
| CP-021 — MVP Validation and Launch Checklist | Planned |

**Exit criteria:** MVP is understandable and presentable. Core school workflow can be demonstrated cleanly. Launch risks are documented.
