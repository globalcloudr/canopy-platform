# Canopy Platform MVP Delivery Plan

Repository: `/Users/zylstra/Code/canopy-platform`  
Scope: `usecanopy.school` platform MVP  
Purpose: Define the complete path from platform concept to a usable Canopy MVP

## MVP Definition

The Canopy MVP is not "every future product fully built."

The MVP is:

- a public Canopy homepage with a clear platform story
- a working sign-in flow
- a school-facing dashboard that shows the organization's products and services
- a platform core that can identify the user, resolve the organization, and determine product access
- one real connected product launch
- one or two additional product/service surfaces that make the platform feel credible and useful

The MVP should prove:

- Canopy is the parent platform
- schools sign in once and land on one dashboard
- products and services can coexist inside the same customer environment
- the platform can grow without becoming one monolithic app
- the first three practical school workflows can be delivered through connected products

## Working MVP Outcome

A school user should be able to:

1. Visit `usecanopy.school`
2. Click `Sign in`
3. Land on their organization's dashboard
4. See their enabled Canopy products
5. See their Canopy services separately
6. Click a meaningful task such as `View Photos` or `Create Newsletter`
7. Launch at least one real connected product through the platform

## Recommended MVP Sequence

The MVP should be built around three practical school workflows:

1. `PhotoVault`
   - first connected product
   - photo, asset, and brand-management workflow
2. `Community Canopy`
   - second connected product/workflow
   - create and send newsletters
3. `Reach Canopy`
   - third connected product/workflow
   - social posting and scheduling
   - likely implemented through a Postiz-backed integration layer behind the Canopy product surface

## Phases

## Phase 0: Strategy and Platform Shape

Goal: Lock the platform concept before visual design and deeper implementation.

Includes:

- define Canopy as the parent platform
- define product family and service family
- define target school user expectations
- define product vs service dashboard model
- define dashboard-first workflow
- define Canopy positioning against larger platforms

Primary outputs:

- `/Users/zylstra/Code/canopy-platform/docs/platform-product-strategy-memo.md`
- `/Users/zylstra/Code/canopy-platform/docs/canopy-technical-platform-architecture-brief.md`
- `/Users/zylstra/Code/canopy-platform/docs/portal-mvp-scope.md`

Exit criteria:

- Canopy is clearly the platform
- PhotoVault is clearly one product, not the platform center
- product and service categories are clear enough to model in the dashboard
- post-sign-in experience is defined as a dashboard, not a workspace chooser

## Phase 1: Platform Core Model

Goal: Define the shared platform objects that make the portal possible.

Related board items:

- `CP-001`
- `CP-002`
- `CP-003`
- `CP-009`

Includes:

- canonical `Workspace`
- `User`
- `Membership`
- `PlatformRole`
- `ProductEntitlement`
- subscription and access state
- schema direction and backend assumptions

Primary outputs:

- `/Users/zylstra/Code/canopy-platform/docs/workspace-identity-model.md`
- `/Users/zylstra/Code/canopy-platform/docs/product-entitlements.md`
- `/Users/zylstra/Code/canopy-platform/docs/core-object-model.md`
- `/Users/zylstra/Code/canopy-platform/docs/schema-implementation-path.md`

Exit criteria:

- platform has one stable account model
- access model is clear enough for routing and dashboard visibility
- product visibility can be driven by entitlement state

## Phase 2: Portal Structure and Workflow Definition

Goal: Turn the portal concept into a real application structure.

Related board items:

- `CP-004`
- `CP-005`
- `CP-006`
- `CP-007`

Includes:

- public homepage structure
- sign-in entry flow
- authenticated dashboard structure
- account and organization visibility in the shell
- products section
- services section
- product card action model
- workspace resolution behavior behind the scenes

Primary outputs:

- `/Users/zylstra/Code/canopy-platform/docs/platform-navigation-model.md`
- `/Users/zylstra/Code/canopy-platform/docs/portal-launcher-contract.md`
- `/Users/zylstra/Code/canopy-platform/apps/portal/`

Exit criteria:

- the dashboard concept is stable
- the sign-in to dashboard flow matches normal SaaS expectations
- product cards and service cards are structurally defined
- multi-workspace logic is treated as an edge case, not the default user flow

## Phase 3: UX Definition

Goal: Define the practical behavior of each key portal surface before visual polish.

This phase is still pre-design-system. It is about screen purpose and behavior.

Includes:

- homepage information architecture
- dashboard information architecture
- product card behavior
- service card behavior
- account area expectations
- empty states
- setup states
- pilot/trial/paused states
- launch and request-access behavior

Primary outputs:

- wireframe-level page definitions
- task-oriented dashboard content model
- first homepage and dashboard content hierarchy

Exit criteria:

- each page has a clear purpose
- each dashboard card has a clear primary and secondary action
- the MVP does not depend on visual styling decisions to make sense

## Phase 4: Design System and Visual Design

Goal: Design the actual visual system after the portal and workflow model are settled.

This is where the following belong:

- final visual style
- final component styling
- brand polish
- spacing system
- production UI patterns

Recommended new board items:

- `CP-014: Canopy Design System Foundations`
- `CP-015: Portal Visual Design v1`
- `CP-016: Homepage Visual Design v1`

Includes:

- Canopy visual language
- typography choices
- color system
- spacing scale
- button, form, card, and navigation patterns
- marketing vs portal presentation rules
- mobile and desktop behavior

Exit criteria:

- public homepage has a clear visual direction
- portal has a calm, practical operational UI
- shared components and spacing rules are stable enough for production implementation

## Phase 5: MVP Build

Goal: Build the minimum real platform experience.

Related board items:

- `CP-005`
- `CP-007`
- `CP-008`

Includes:

- real authentication path
- real session handling
- workspace resolution
- entitlement-aware dashboard content
- actual product and service metadata source
- first connected product launch
- account/service entry points

Must-have MVP implementation targets:

- real homepage route
- real sign-in route
- real dashboard route
- one real product launch target
- one real product/service state model

Recommended MVP product rollout:

1. `PhotoVault`
2. `Community Canopy`
3. `Reach Canopy`

Exit criteria:

- a real school account can sign in
- the account lands on a real dashboard
- the dashboard shows organization-specific products and services
- at least one product can be launched through the platform

## Phase 6: MVP Validation and Launch Readiness

Goal: Make sure the MVP is usable, presentable, and supportable.

Includes:

- content review
- role and entitlement testing
- cross-browser/mobile checks
- accessibility review
- support/contact flow review
- internal pilot walkthrough
- launch checklist

Primary outputs:

- launch checklist
- MVP walkthrough script
- issue list for post-MVP improvements

Exit criteria:

- the core school workflow works cleanly
- the product/service model is understandable
- the MVP is good enough to show to real school clients

## Recommended MVP Scope

To stay disciplined, the MVP should include:

- Canopy public homepage
- sign-in flow
- dashboard with:
  - enabled products
  - additional products
  - services
- one real connected product launch
- account and support entry point

The MVP should not require:

- every future product fully implemented
- a perfect design system on day one
- every service flow fully operational in software
- a full operator back office

## Recommended Product/Service Mix For MVP

Products to show now:

- `PhotoVault`
- `Canopy Web`
- `Community Canopy`
- `Assist Canopy`
- `Reach Canopy`
- `Create Canopy`
- `Publish Canopy`
- `Insights Canopy`

Services to show now:

- `School Website Setup`
- `Design Support`
- `Communications Support`

Products that should likely feel most real in the MVP:

- `PhotoVault`
- `Community Canopy`
- `Reach Canopy`

Services that should likely feel most real in the MVP:

- `School Website Setup`
- `Communications Support`

## What Success Looks Like

By the end of the MVP path, Canopy should feel like:

- one platform
- one sign-in
- one dashboard
- multiple products
- multiple services
- practical, familiar, and easy for schools to understand
- anchored around real school work: assets, newsletters, and social posting

It should not feel like:

- PhotoVault with extras attached
- a technical architecture demo
- a collection of unrelated prototypes
- a luxury brand exercise before the workflow is real

## Immediate Next Steps

1. Add this plan to the implementation board as the reference roadmap.
2. Add the new design-phase board items:
   - `CP-014`
   - `CP-015`
   - `CP-016`
3. Continue refining the dashboard concept around:
   - current products
   - additional products
   - services
4. Decide the first real connected product after portal sign-in.
5. Define the second and third connected MVP workflows:
   - `Community Canopy`
   - `Reach Canopy`
6. Start defining wireframe-level page behavior for:
   - homepage
   - sign-in
   - dashboard
   - account/services
