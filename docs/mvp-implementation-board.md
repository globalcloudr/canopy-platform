# Canopy Platform MVP Implementation Board

Repository: `/Users/zylstra/Code/canopy-platform`  
Current focus: `usecanopy.school` portal MVP + shared platform core

## Working Rule

This board is the single implementation source of truth for the Canopy MVP.

We should use it to:

- decide what phase we are in
- decide what comes next
- decide what is not in scope yet

We should not create parallel planning tracks that drift away from this board.

## Current Phase

Current active phase:

- `Phase 4: Design System and Visual Design`

Completed phases:

- `Phase 1: Platform Core Model` — complete at concept level
- `Phase 2: Portal Structure and Workflow` — complete at concept/mock level
- `Phase 3: MVP Product Definition` — complete

Next phase after that:

- `Phase 5: MVP Build`

## Immediate Next Priorities

1. Complete `CP-015` — document the design system foundations now that the visual direction is implemented
2. Complete `CP-016` — finalize portal visual design (dashboard, header, cards, services)
3. Complete `CP-017` — finalize homepage visual design
4. Begin `Phase 5` planning — real auth, real database, first product launch

## MVP Definition

The Canopy MVP is:

- a public Canopy homepage
- a working sign-in flow
- a school-facing dashboard
- clear separation between products and services
- one real connected product launch
- a believable path to the second and third products

The MVP is not:

- every future product fully implemented
- deep cross-product integration from day one
- final high-fidelity design across every screen

## MVP Product Order

The MVP product sequence is:

1. `PhotoVault`
   - first connected product
2. `Community Canopy`
   - second MVP product
   - create and send newsletters
3. `Reach Canopy`
   - third MVP product
   - social posting and scheduling
4. `Stories Canopy`
   - fourth MVP product
   - AI-powered success story production
   - working prototype exists in `/references/replit/success-story-engine/`
5. `Publish Canopy`
   - fifth MVP product
   - digital publications management (class catalogs, brochures)
   - Issuu as the hosting and rendering engine
   - WordPress plugin exists in `/references/replit/issuu-publications-manager/`
6. `Create Canopy`
   - sixth MVP product
   - design request and creative services management
   - formal intake, quote approval, file delivery workflow

Important product rule:

- `PhotoVault` is not the platform foundation
- `PhotoVault` is one product inside Canopy
- all products should be treated as peer offerings inside the Canopy platform

## Phase Overview

### Phase 0: Platform Strategy and Shape

Purpose:

- define what Canopy is
- define product family and service family
- define the overall dashboard model

Outcome:

- Canopy is clearly the parent platform
- products and services are clearly separated
- post-sign-in behavior is dashboard-first

### Phase 1: Platform Core Model

Purpose:

- define the platform objects that power access and dashboard visibility

Outcome:

- stable workspace, user, membership, and entitlement models

### Phase 2: Portal Structure and Workflow

Purpose:

- define how the portal works before final design

Outcome:

- homepage, sign-in, dashboard, products, and services are structurally clear

### Phase 3: MVP Product Definition

Purpose:

- define each MVP product clearly as a Canopy offering

Outcome:

- `PhotoVault`, `Community Canopy`, and `Reach Canopy` each have a clear MVP definition
- no unnecessary cross-product dependency is assumed

### Phase 4: Design System and Visual Design

Purpose:

- turn the product structure and portal concept into final visual design

Outcome:

- final visual style
- final component styling
- brand polish
- spacing system
- production UI patterns

### Phase 5: MVP Build

Purpose:

- implement the real portal and first connected products

Outcome:

- real login
- real dashboard
- real product access

### Phase 6: MVP Validation and Launch Readiness

Purpose:

- make the MVP usable, presentable, and ready for real school clients

Outcome:

- launch-ready MVP

## Shipped: Platform foundation and portal scaffold (2026-03-23)

- Added platform architecture docs for:
  - shared workspace and identity model
  - product entitlements
  - integration strategy
  - portal MVP scope
  - platform navigation model
- Created initial `apps/portal` `Next.js` scaffold
- Added first portal UI mock with:
  - Canopy header
  - workspace switcher
  - account/dashboard snapshot
  - product launcher cards
- Reorganized imported Replit experiments under `references/replit/` so the repo root stays focused on active platform work

## Phase 1: Platform Core Model

### CP-001: Canonical Workspace Model

- Goal: Establish `Workspace` as the top-level Canopy account object.
- Scope:
  - define canonical workspace fields
  - define workspace lifecycle states
  - define relationship between `Workspace` and plain-language `Organization`
  - define relationship to school profile and subscription state
- Primary docs:
  - `/Users/zylstra/Code/canopy-platform/docs/workspace-identity-model.md`
- Acceptance:
  - one shared definition of `Workspace`
  - `Organization` and `Workspace` terminology is no longer ambiguous
  - no competing top-level account concept introduced in portal work
  - workspace object is stable enough for portal and product launch flows
- Status:
  - `In progress`
  - documented conceptually
  - not yet implemented in running platform code

### CP-002: User, Membership, and Platform Access Model

- Goal: Define how users relate to workspaces and how Canopy operator access differs from school access.
- Scope:
  - define `User`
  - define `Membership`
  - define `PlatformRole`
  - define initial workspace-facing roles
- Primary docs:
  - `/Users/zylstra/Code/canopy-platform/docs/workspace-identity-model.md`
- Acceptance:
  - platform admin access is distinct from school/workspace access
  - one user can belong to multiple workspaces
  - workspace membership is the basis for account access
- Status:
  - `In progress`
  - documented conceptually
  - not yet implemented in running platform code

### CP-003: Product Entitlements v1

- Goal: Define how the platform determines which products a workspace can access.
- Scope:
  - define product keys
  - define entitlement states
  - define setup state
  - define manual provisioning model for MVP
  - define how entitlements affect portal visibility and launch access
- Primary docs:
  - `/Users/zylstra/Code/canopy-platform/docs/product-entitlements.md`
- Acceptance:
  - portal can answer whether a workspace has access to a product
  - entitlement state supports at least: `active`, `pilot`, `trial`, `paused`
  - setup state is defined separately from entitlement status
  - manual product enablement by Canopy is an explicit MVP rule
  - product-launch behavior can rely on this model
- Status:
  - `In progress`
  - documented conceptually
  - not yet implemented in running platform code

### CP-009: Core Object Model

- Goal: Document the first implementation-level object model for the platform core.
- Scope:
  - define tables/entities for:
    - `users`
    - `workspaces`
    - `memberships`
    - `platform_roles`
    - `product_entitlements`
    - `subscriptions`
- Acceptance:
  - object model is implementation-ready
  - platform MVP data requirements are covered
- Status:
  - `In progress`
  - initial implementation-level object model documented in:
    - `/Users/zylstra/Code/canopy-platform/docs/core-object-model.md`

### Phase 1 Exit Criteria

- canonical workspace, membership, and entitlement models are stable
- core object model is consistent with those definitions
- we can explain who the user is, what organization they belong to, and what products they can access

### Phase 1 Locked Decisions

These decisions should now be treated as settled unless a strong reason appears to change them.

1. `Workspace` is the canonical implementation term in the Canopy platform model.
2. `Organization` is the plain-language business term for the same school account.
3. Canopy owns invitation and membership long term.
4. School access starts with an invited admin/owner, and that admin can invite additional staff.
5. Products own product-specific roles and permissions.
6. Canopy owns product enablement for the organization/workspace.
7. In MVP, product enablement is managed manually by Canopy.
8. Dashboard visibility is driven by workspace product entitlements.

## Phase 2: Portal Structure and Workflow

### CP-004: Portal Shell and Navigation Baseline

- Goal: Turn the portal into a real control plane shell for Canopy.
- Scope:
  - shared portal header
  - workspace visibility
  - product launcher/dashboard
  - account entry point
- Files:
  - `/Users/zylstra/Code/canopy-platform/apps/portal/src/app/page.tsx`
  - `/Users/zylstra/Code/canopy-platform/apps/portal/src/app/globals.css`
  - `/Users/zylstra/Code/canopy-platform/docs/platform-navigation-model.md`
- Acceptance:
  - active workspace is visible in the shell
  - top-level navigation reflects platform intent
  - product launcher feels like the center of the portal
- Status:
  - `Complete` (concept/mock level — real implementation in Phase 5)
  - portal header, workspace chip, nav, product launcher, and account entry point all implemented
  - `PortalHeader` component extracted and reused across authenticated routes

### CP-005: Authentication Entry Flow

- Goal: Add the first real sign-in and sign-out path for the platform portal.
- Scope:
  - sign-in page
  - session handling direction
  - post-auth routing into dashboard-first portal home
- Files:
  - `/Users/zylstra/Code/canopy-platform/apps/portal/`
  - `/Users/zylstra/Code/canopy-platform/docs/portal-mvp-scope.md`
  - `/Users/zylstra/Code/canopy-platform/docs/portal-technical-stack.md`
- Acceptance:
  - platform has a clear authentication entry point
  - user can reach an authenticated portal state
  - single-workspace users land directly on their dashboard
  - multi-workspace behavior does not disrupt the default sign-in flow
  - auth flow is compatible with future cross-product SSO
- Status:
  - `Complete` (concept/mock level — real Supabase auth implementation in Phase 5)
  - sign-in page implemented with split-panel layout
  - dashboard-first flow documented and implemented in mock session layer
  - mock session resolves via URL params (`?email=&workspace=`) for development

### CP-006: Workspace Resolution and Switcher Logic

- Goal: Make active workspace selection a first-class part of the portal.
- Scope:
  - single-workspace default routing
  - multi-workspace switcher behavior
  - persistence of active workspace context
- Files:
  - `/Users/zylstra/Code/canopy-platform/apps/portal/`
  - `/Users/zylstra/Code/canopy-platform/docs/workspace-identity-model.md`
- Acceptance:
  - single-workspace users land directly on their dashboard
  - products do not need to guess workspace context
  - switcher behavior is predictable and documented
  - workspace switching is not promoted as a default visible workflow
- Status:
  - `Complete` (concept/mock level — real implementation in Phase 5)
  - workspace resolution implemented in `platform.ts` mock layer
  - single-workspace users land directly on dashboard; multi-workspace via URL param
  - workspace chip visible in header without being promoted as a primary workflow

### CP-007: Entitlement-Aware Product Launcher

- Goal: Make the portal product launcher reflect real product access and state.
- Scope:
  - show enabled products
  - show state such as `active`, `pilot`, or `setup`
  - define launch destinations
- Files:
  - `/Users/zylstra/Code/canopy-platform/apps/portal/`
  - `/Users/zylstra/Code/canopy-platform/docs/product-entitlements.md`
- Acceptance:
  - portal launcher is driven by product entitlement data
  - non-enabled products are either hidden or intentionally marked
  - launch actions map to actual destinations
- Status:
  - `Complete` (concept/mock level — real entitlement data in Phase 5)
  - full product catalog implemented in `products.ts` with all states, action labels, and routes
  - dashboard renders "Your Apps", "Active Services", and "More from Canopy" sections
  - color-coded product cards with per-product icon colors and background tints

### CP-008: PhotoVault as First Connected Product

- Goal: Make `PhotoVault by Canopy` the first real product launched through the portal.
- Scope:
  - define launch URL pattern
  - define how workspace context is passed
  - define early auth/SSO handoff direction
- Cross-repo dependency:
  - `/Users/zylstra/Code/photovault`
- Primary docs:
  - `/Users/zylstra/Code/canopy-platform/docs/canopy-technical-platform-architecture-brief.md`
  - `/Users/zylstra/Code/canopy-platform/docs/integration-strategy.md`
- Acceptance:
  - portal has one real connected product target
  - PhotoVault launch flow is documented and implementable
  - platform/product boundary remains clear
- Status:
  - `Complete` (concept level — cross-repo integration in Phase 5)
  - launch URL pattern, workspace context passing, and auth/SSO handoff direction documented
  - primary doc: `/Users/zylstra/Code/canopy-platform/docs/auth-session-handoff-model.md`

### CP-010: Shared Event and Analytics Model

- Goal: Define a normalized event model for platform and product activity.
- Scope:
  - identify first event types
  - define event schema direction
  - define handoff path to future `Insights Canopy`
- Primary docs:
  - `/Users/zylstra/Code/canopy-platform/docs/integration-strategy.md`
- Acceptance:
  - platform and products can emit compatible events
  - Insights work has a clear data foundation later
- Status:
  - `Planned`

### CP-011: Shared Brand and School Profile Metadata

- Goal: Define the cross-product metadata layer for school identity and branding.
- Scope:
  - school profile metadata
  - brand profile metadata
  - relationship to PhotoVault asset references
- Acceptance:
  - brand and school identity can be reused across products
  - source-of-truth rules stay clear
- Status:
  - `Planned`

### Phase 2 Exit Criteria

- homepage, sign-in, and dashboard structure are clear
- products and services are clearly separated in the portal model
- dashboard behavior matches normal SaaS expectations
- first connected-product handoff direction is documented well enough to implement

## Phase 3: MVP Product Definition

### CP-012: Community Canopy MVP Definition

- Goal: Define `Community Canopy` as the second MVP product inside the Canopy platform.
- Scope:
  - product purpose
  - newsletter workflow
  - create/send model
  - school-facing actions
  - what is in MVP and what is not
- Acceptance:
  - `Community Canopy` is defined clearly enough to design and build without ambiguity
  - the dashboard can present meaningful newsletter actions
  - no dependency on `PhotoVault` is assumed for MVP
- Primary docs:
  - `/Users/zylstra/Code/canopy-platform/docs/community-canopy-mvp.md`
- Status:
  - `Complete`

### CP-013: Reach Canopy MVP Definition

- Goal: Define `Reach Canopy` as the third MVP product inside the Canopy platform.
- Scope:
  - product purpose
  - basic social workflow
  - posting/scheduling model
  - whether `Postiz` is the right early engine
  - what is in MVP and what is not
- Acceptance:
  - `Reach Canopy` is defined clearly enough to design and plan
  - social posting is framed as a Canopy product, not an external tool
  - no dependency on `PhotoVault` is assumed for MVP
- Primary docs:
  - `/Users/zylstra/Code/canopy-platform/docs/reach-canopy-mvp.md`
- Status:
  - `Complete`

### CP-014: MVP Product Catalog and Packaging

- Goal: Define how products and services appear in the portal and how schools understand what they have.
- Scope:
  - product list
  - service list
  - dashboard grouping
  - request-access patterns
  - enabled vs additional products
- Acceptance:
  - dashboard catalog model is stable
  - products and services are clearly separated
  - Canopy offering structure is understandable to schools
- Primary docs:
  - `/Users/zylstra/Code/canopy-platform/docs/mvp-product-catalog.md`
- Status:
  - `Complete`

### CP-022: Stories Canopy MVP Definition

- Goal: Define `Stories Canopy` as the fourth MVP product inside the Canopy platform.
- Scope:
  - product purpose
  - intake form and story type model
  - AI content generation pipeline
  - video generation
  - content package and delivery
  - cross-product integration points (Community Canopy, Reach Canopy, PhotoVault, Canopy Web)
  - what is in MVP and what is not
- Acceptance:
  - `Stories Canopy` is defined clearly enough to design and build without ambiguity
  - relationship to the Replit prototype is documented
  - cross-product content handoffs are defined
  - no hard dependency on other products is assumed for MVP
- Primary docs:
  - `/Users/zylstra/Code/canopy-platform/docs/stories-canopy-mvp.md`
- Reference implementation:
  - `/Users/zylstra/Code/canopy-platform/references/replit/success-story-engine/`
- Status:
  - `Complete`

### CP-023: Publish Canopy MVP Definition

- Goal: Define `Publish Canopy` as the fifth MVP product inside the Canopy platform.
- Scope:
  - product purpose
  - Issuu as the hosting and rendering engine
  - publication library and embed code model
  - school-facing and Canopy staff workflows
  - cross-product integration points
  - what is in MVP and what is not
- Acceptance:
  - `Publish Canopy` is defined clearly enough to design and build without ambiguity
  - relationship to the Issuu WordPress plugin is clearly separated
  - Canopy Web native module integration is documented
- Primary docs:
  - `/Users/zylstra/Code/canopy-platform/docs/publish-canopy-mvp.md`
- Reference implementation:
  - `/Users/zylstra/Code/canopy-platform/references/replit/issuu-publications-manager/`
- Status:
  - `Complete`

### CP-024: Create Canopy MVP Definition

- Goal: Define `Create Canopy` as the design request and creative services product inside the Canopy platform.
- Scope:
  - design request intake workflow
  - request types and states
  - quote and approval model (billing trigger)
  - file delivery and history
  - Canopy staff request queue
  - cross-product handoffs (Publish Canopy, Reach Canopy, PhotoVault)
- Acceptance:
  - `Create Canopy` is defined clearly enough to design and build without ambiguity
  - formal billing trigger is documented
  - relationship to other products is clear
- Primary docs:
  - `/Users/zylstra/Code/canopy-platform/docs/create-canopy-mvp.md`
- Status:
  - `Complete`

### Phase 3 Exit Criteria

- `PhotoVault`, `Community Canopy`, `Reach Canopy`, `Stories Canopy`, `Publish Canopy`, and `Create Canopy` each have a clear MVP definition
- the portal knows how to present products versus services
- no unnecessary cross-product dependency is assumed for MVP

## Phase 4: Design System and Visual Design

### CP-015: Canopy Design System Foundations

- Goal: Define the shared visual system for the Canopy homepage and portal.
- Scope:
  - color system
  - typography system
  - spacing scale
  - base components
  - visual rules for products and services
- Acceptance:
  - Canopy has one reusable design foundation
  - portal and homepage can share tokens while looking appropriate for their context
  - component styling is stable enough to support production implementation
- Status:
  - `Started`
  - design system implemented in `apps/portal/src/app/globals.css`
  - color tokens, typography scale, shadows, and component patterns all defined
  - font: Plus Jakarta Sans; palette: navy/white/blue
  - designer handoff brief updated: `/Users/zylstra/Code/canopy-platform/docs/designer-handoff-brief.md`
  - needs final documentation as a standalone design system reference

### CP-016: Portal Visual Design v1

- Goal: Turn the portal concept into a production-minded dashboard design.
- Scope:
  - authenticated shell design
  - dashboard card patterns
  - account and product/service sections
  - mobile and desktop layout behavior
- Acceptance:
  - portal feels practical, calm, and modern
  - dashboard supports real school workflows clearly
  - product and service sections are easy to scan and understand
- Status:
  - `Started`
  - dashboard implemented with color-coded product cards, dot-grid background,
    per-product gradient tints, SVG decorative header graphic
  - portal header, services list, "More from Canopy" discover section all implemented
  - needs final design polish and responsive review before Phase 5

### CP-017: Homepage Visual Design v1

- Goal: Design the public Canopy homepage and entry pages.
- Scope:
  - homepage structure
  - marketing sections
  - sign-in entry treatment
  - product/service overview presentation
- Acceptance:
  - public Canopy site clearly explains the platform
  - homepage and sign-in feel consistent with the portal
  - visual direction is ready for implementation
- Status:
  - `Started`
  - dark navy hero band with blue radial gradient and floating product icon animations
  - all 9 products shown in card grid
  - sign-in page implemented with split-panel layout
  - needs final copy review and additional marketing sections

### Phase 4 Exit Criteria

- homepage visual direction is approved
- portal visual direction is approved
- component and spacing rules are clear enough for production implementation

## Phase 5: MVP Build

### CP-018: Community Canopy Launch Through the Portal

- Goal: Add the second real product launch after PhotoVault.
- Scope:
  - `Community Canopy` product entry
  - newsletter create/send MVP flow
  - portal entitlement visibility
  - dashboard action behavior
- Acceptance:
  - second product is visible through the same platform model
  - school users can enter a newsletter workflow from the dashboard
  - Canopy clearly supports more than one real product
- Status:
  - `Planned`

### CP-019: Reach Canopy Launch Through the Portal

- Goal: Add the third real product launch after PhotoVault and Community Canopy.
- Scope:
  - `Reach Canopy` product entry
  - social posting/scheduling MVP flow
  - likely external-engine integration path
- Acceptance:
  - third product is visible through the same platform model
  - social posting is presented as a Canopy workflow
  - Canopy clearly supports a three-product MVP path
- Status:
  - `Planned`

### CP-020: Operator and Account Surfaces

- Goal: Add the first platform-level account and operator tooling beyond the MVP shell.
- Scope:
  - workspace/account settings
  - service visibility
  - platform staff/operator views later
- Acceptance:
  - account management does not have to live inside product apps
  - platform/control-plane value is clearer
- Status:
  - `Planned`

### Phase 5 Exit Criteria

- real sign-in works
- dashboard reflects real account state
- `PhotoVault` launches through the portal
- `Community Canopy` is available as the second MVP product
- `Reach Canopy` has a defined and implementable launch path

## Phase 6: MVP Validation and Launch Readiness

### CP-021: MVP Validation and Launch Checklist

- Goal: Validate that the Canopy MVP is usable, coherent, and ready for real school clients.
- Scope:
  - workflow walkthroughs
  - product/service clarity review
  - accessibility and responsive review
  - content QA
  - launch checklist
- Acceptance:
  - MVP is understandable and presentable
  - core school workflow can be demonstrated cleanly
  - launch risks are documented
- Status:
  - `Planned`

This repo should stay focused on:

- Canopy platform core
- the portal/control plane
- shared identity, entitlement, and integration models

It should not become the place where every future Canopy product is implemented by default.
