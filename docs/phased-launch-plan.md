# Canopy Phased Launch Plan

Date: 2026-03-27

## Purpose

Define the safest practical path to launch Canopy as the live platform front door while preserving PhotoVault as the first real product.

This plan is intentionally biased toward:

- minimal risk
- clear system boundaries
- fast launch of `usecanopy.school`
- reuse of the existing PhotoVault production foundation

## Current Position

Today:

- `canopy-platform` contains the platform architecture, portal app, product catalog, and launcher model
- `photovault` contains the mature product implementation, live Supabase-backed data model, and current production workflows

The launch goal is **not**:

- rebuilding PhotoVault inside the portal
- moving every future product into platform core immediately
- splitting infrastructure before it is necessary

The launch goal **is**:

- make Canopy the platform entry point
- make PhotoVault the first connected product
- establish one shared identity, workspace, and entitlement model
- preserve clean boundaries for future products

## Recommended MVP Launch Architecture

Near-term recommendation:

- one shared Supabase project/database
- one Vercel project for `canopy-platform`
- one Vercel project for `photovault`
- one live Canopy portal domain
- one live PhotoVault product domain

Recommended domain direction:

- `usecanopy.school` -> Canopy portal
- `photovault.school` or `photovault.usecanopy.school` -> PhotoVault

## Source-of-Truth Rules

For MVP, the system of record should be:

- identity, workspace access, product entitlements
  - Canopy platform core
- approved media, albums, brand assets, share-ready media
  - PhotoVault

During the transition, PhotoVault's existing schema will act as the compatibility base for the initial platform rollout.

## Boundary Rules

What belongs in `canopy-platform`:

- sign-in entry
- workspace resolution
- product entitlements
- dashboard and launcher
- account-level platform visibility
- product launch decisions

What belongs in `photovault`:

- albums
- assets
- share links
- brand portal workflows
- media permissions
- product-specific APIs and UI

What should not happen:

- do not turn `canopy-platform` into the implementation home for every product workflow
- do not keep growing PhotoVault into the permanent platform core
- do not duplicate source-of-truth ownership across platform and product

## Phase 0: Lock The Transition Model

Goal:

- confirm the system boundary before implementation work expands

Deliverables:

- this phased launch plan
- PhotoVault-to-Canopy object mapping
- shared Supabase strategy
- launch handoff rules

Decisions to lock:

- PhotoVault remains Product 1
- `organizations` in PhotoVault are the MVP equivalent of Canopy `workspaces`
- one shared Supabase project is the MVP bias
- Canopy is the platform front door
- PhotoVault is the first connected product

Exit criteria:

- boundary between platform core and product code is written down clearly
- launch architecture is agreed before implementation work spreads

## Phase 1: Make The Portal Real

Goal:

- replace mock portal behavior with real platform behavior

In scope:

- real Supabase connection from `canopy-platform`
- real auth flow
- real user/session resolution
- real workspace resolution
- real membership lookup
- real `photovault` product entitlement lookup
- real dashboard and launcher state

Out of scope:

- deep billing
- full notifications center
- cross-product search
- implementation of future product workflows

Exit criteria:

1. a user can sign into Canopy
2. Canopy resolves the active workspace
3. Canopy shows PhotoVault as enabled when appropriate
4. the portal is no longer driven by mock session data

## Phase 2: Add The Minimum Shared Platform Schema

Goal:

- introduce the minimum platform-core tables into the existing Supabase project

Initial platform tables:

- `product_entitlements`
- `platform_roles` if not finalized elsewhere as the canonical source
- optional `subscriptions`

Compatibility rule:

- keep using PhotoVault `organizations` and `memberships` as the MVP bridge unless there is a strong reason to create a parallel `workspaces` layer immediately

Important constraint:

- do not remap every product table into platform terminology just for naming consistency

Exit criteria:

- entitlement-aware dashboard logic is backed by real data
- platform/operator access is stable enough for portal behavior

## Phase 3: Portal-To-PhotoVault Launch Handoff

Goal:

- establish the first real connected-product experience

Required launch flow:

1. user signs into Canopy
2. Canopy resolves the active workspace
3. Canopy checks `photovault` entitlement for that workspace
4. Canopy launches PhotoVault with explicit workspace context
5. PhotoVault verifies session, membership, and product access before product entry

Handoff rules:

- prefer a shared Supabase-compatible auth/session model over a custom token-exchange layer
- pass active workspace context explicitly
- PhotoVault must not blindly trust the launch link alone

Exit criteria:

- launch from Canopy into PhotoVault works reliably
- wrong-workspace access is rejected
- stale or direct product entry does not bypass access checks

## Phase 4: Launch Canopy Live

Goal:

- make `usecanopy.school` the real platform front door

In scope:

- deploy `canopy-platform`
- connect the production Canopy domain
- configure auth callback URLs
- point the launcher at the live PhotoVault destination
- run production smoke tests

Recommended MVP product surfaces:

- `PhotoVault` as the first real connected product
- one or two additional placeholder products/services for credibility

Exit criteria:

- Canopy is live
- users can sign in and launch PhotoVault
- the dashboard clearly separates products and services

## Phase 5: Stabilize Before Expanding

Goal:

- harden the first connected-platform experience before building more products

In scope:

- launch flow cleanup
- workspace-context hardening
- role/permission alignment
- platform UX cleanup

Recommended next product candidates:

- `Community Canopy`
- `Reach Canopy`

Rule:

- build one next product/workflow at a time

## Workspace Provisioning Direction

Workspace provisioning ownership should move toward Canopy, not remain split across product apps.

Near-term rule:

- keep the existing PhotoVault operational workflow available while the portal is still hardening

Long-term rule:

- super admin workflow should be initiated from Canopy
- that workflow should combine:
  - workspace selection/creation
  - admin invitation
  - product/service enablement
- products should consume the resulting membership and entitlement state rather than owning separate operational loops

Transition constraint:

- do not remove PhotoVault's current operational path until Canopy can create the same practical outcome for workspace setup and school-admin onboarding

Exit criteria:

- Canopy and PhotoVault launch flow is stable enough that the next product can plug into the same model

## What Should Not Move Yet

Do not move these into platform core during MVP launch:

- PhotoVault albums
- PhotoVault assets
- PhotoVault share links
- PhotoVault brand portal logic
- PhotoVault media-role rules
- product-specific external integrations

Do not do these yet:

- repo merge
- second database
- broad renaming migration for its own sake
- implementation of multiple future products at once

## Major Risks

1. Platform sprawl inside PhotoVault
2. Hidden database coupling without a clear contract
3. Workspace handoff that relies only on client local state
4. Role drift between platform/workspace roles and PhotoVault product roles
5. Trying to launch Canopy by simultaneously building every future product

## Recommended Immediate Next Steps

1. finalize the PhotoVault-to-Canopy object mapping
2. define the shared Supabase MVP strategy
3. replace portal mock session data with real Supabase-backed platform data
4. implement the first explicit Canopy-to-PhotoVault launch handoff
5. deploy Canopy as the live front door

## Summary

The safest launch path is:

- Canopy becomes the live platform front door
- PhotoVault remains the first real connected product
- one shared Supabase project is used initially
- product workflows stay inside the product
- future apps are added one at a time through the same platform model
