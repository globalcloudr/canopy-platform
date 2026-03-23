# Canopy Platform MVP Implementation Board

Repository: `/Users/zylstra/Code/canopy-platform`  
Current focus: `usecanopy.school` portal MVP + shared platform core

Reference roadmap:

- `/Users/zylstra/Code/canopy-platform/docs/mvp-delivery-plan.md`

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

## Phase 1: Now (Platform Core MVP)

### CP-001: Canonical Workspace Model

- Goal: Establish `Workspace` as the top-level Canopy account object.
- Scope:
  - define canonical workspace fields
  - define workspace lifecycle states
  - define relationship to school profile and subscription state
- Primary docs:
  - `/Users/zylstra/Code/canopy-platform/docs/workspace-identity-model.md`
- Acceptance:
  - one shared definition of `Workspace`
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
  - define how entitlements affect portal visibility and launch access
- Primary docs:
  - `/Users/zylstra/Code/canopy-platform/docs/product-entitlements.md`
- Acceptance:
  - portal can answer whether a workspace has access to a product
  - entitlement state supports at least: `active`, `pilot`, `trial`, `paused`
  - product-launch behavior can rely on this model
- Status:
  - `In progress`
  - documented conceptually
  - not yet implemented in running platform code

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
  - `Started`
  - initial mock implemented
  - still page-local and not yet split into reusable portal layout components

### CP-005: Authentication Entry Flow

- Goal: Add the first real sign-in and sign-out path for the platform portal.
- Scope:
  - sign-in page
  - session handling direction
  - post-auth routing into workspace-aware portal home
- Files:
  - `/Users/zylstra/Code/canopy-platform/apps/portal/`
  - `/Users/zylstra/Code/canopy-platform/docs/portal-mvp-scope.md`
  - `/Users/zylstra/Code/canopy-platform/docs/portal-technical-stack.md`
- Acceptance:
  - platform has a clear authentication entry point
  - user can reach an authenticated portal state
  - auth flow is compatible with future cross-product SSO
- Status:
  - `Not started`

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
  - user can enter the correct active workspace
  - products do not need to guess workspace context
  - switcher behavior is predictable and documented
- Status:
  - `Not started`
  - UI placeholder exists in the portal mock

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
  - `Started`
  - mocked in UI
  - not yet backed by real data or routing rules

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
  - `In progress`
  - initial handoff direction documented in:
    - `/Users/zylstra/Code/canopy-platform/docs/auth-session-handoff-model.md`

## Phase 2: Next (Shared Platform Services)

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

## Phase 3: Later (Second Product + Connected Platform Experience)

### CP-012: Second Product Launch Through the Portal

- Goal: Add the second real product launch after PhotoVault.
- Recommended candidates:
  - `Reach Canopy`
  - `Canopy Web`
- Acceptance:
  - second product is visible through the same workspace and entitlement model
  - platform value becomes clearly cross-product
- Status:
  - `Planned`

### CP-013: Operator and Account Surfaces

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

## Phase 4: Design System and Visual Design

### CP-014: Canopy Design System Foundations

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
  - `Planned`

### CP-015: Portal Visual Design v1

- Goal: Turn the portal concept into a real, production-minded dashboard design.
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
  - `Planned`

### CP-016: Homepage Visual Design v1

- Goal: Design the public Canopy homepage and supporting entry pages.
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
  - `Planned`

## Immediate Next Priorities

1. Define the implementation-level core object model
2. Define the schema implementation path and initial backend direction
3. Define the portal launcher contract and product metadata model
4. Add a sign-in page and auth entry flow to `apps/portal`
5. Split the current portal mock into reusable shell/layout components

## Working Rule

This repo should stay focused on:

- Canopy platform core
- the portal/control plane
- shared identity, entitlement, and integration models

It should not become the place where every future Canopy product is implemented by default.
