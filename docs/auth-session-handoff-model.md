# Canopy Auth and Session Handoff Model

Date: 2026-03-23

## Purpose

Define the first practical auth and session handoff model between:

- the Canopy platform portal at `usecanopy.school`
- `PhotoVault by Canopy` as the first connected product

This document focuses on the near-term model that is:

- believable
- compatible with the existing PhotoVault stack
- simple enough to implement without overbuilding

It is not the final long-term SSO architecture, but it should preserve a clean path toward one.

## Core Principle

The platform portal should own:

- identity entry
- workspace resolution
- product entitlements
- launch authorization decisions

PhotoVault should own:

- product-specific domain behavior
- product-specific permissions derived from workspace context
- asset, album, and brand-system workflows

The handoff model must let the portal say:

- who the user is
- which workspace is active
- whether the workspace is entitled to PhotoVault

without forcing the platform and product to become one tightly coupled application.

## Near-Term Recommendation

Recommended near-term direction:

- Canopy portal and PhotoVault should use a compatible Supabase-backed auth foundation
- the portal should resolve the active workspace before launch
- PhotoVault should verify the user session and then resolve product access using platform-compatible identity and workspace data

This preserves a path toward shared login while avoiding a premature custom SSO layer.

## Recommended Handoff Goals

The first handoff model should support:

1. one user identity across platform and product
2. a clear active workspace selected in the portal
3. a launch action from portal to PhotoVault
4. a product-side access check before showing product data
5. a future path toward stronger shared session behavior

## Recommended MVP Handoff Flow

### Step 1: User Authenticates in the Portal

The user signs into Canopy through the portal.

The portal resolves:

- current `User`
- all active `Memberships`
- active `Workspace`
- `ProductEntitlement` for `photovault`

### Step 2: Portal Validates Launch Eligibility

Before launching PhotoVault, the portal checks:

- user belongs to the active workspace
- workspace has `photovault` entitlement
- entitlement status allows access
- setup state is acceptable for launch

If access is valid, the portal allows launch.

### Step 3: Portal Launches PhotoVault

The portal sends the user into PhotoVault with:

- a compatible authenticated session
- active workspace context
- a launch destination

Near-term implementation bias:

- prefer a shared auth-compatible session approach over custom token exchange if possible

### Step 4: PhotoVault Verifies Session and Context

PhotoVault should not blindly trust the launch link alone.

PhotoVault should verify:

- authenticated user identity
- workspace membership
- product access compatibility
- product-specific role mapping

Then PhotoVault can resolve its own product behavior.

## Recommended Active Workspace Handoff

The active workspace is the most important context to carry across.

Recommended near-term rule:

- the portal chooses the active workspace
- the launch into PhotoVault includes that workspace context explicitly
- PhotoVault verifies the user has access to that workspace before use

Possible near-term transport patterns:

- workspace slug in launch URL
- workspace id in signed launch state
- session-backed active workspace state if both apps share a sufficiently compatible auth/session layer

Recommended bias for MVP:

- start with explicit workspace context in the launch flow

This is easier to reason about and easier to debug.

## Recommended Product Access Check in PhotoVault

PhotoVault should still perform product-side access checks.

For the first connected model, PhotoVault should verify:

- user is authenticated
- user has a valid workspace relationship
- workspace matches the active launch context
- workspace has access to PhotoVault
- user maps into a valid PhotoVault product role

This protects against:

- stale launch links
- incorrect active workspace assumptions
- direct product access outside expected portal flow

## Product Role Mapping Direction

The portal should not decide PhotoVault's detailed internal role behavior.

Recommended rule:

- portal determines workspace eligibility and launch access
- PhotoVault maps membership into product-specific roles

Example:

- workspace role `owner` -> PhotoVault role `owner`
- workspace role `admin` -> PhotoVault role `uploader` or manager-equivalent
- workspace role `staff` -> PhotoVault role determined by product rules

This mapping can evolve later, but the separation of concerns should remain.

## Recommended MVP Architecture Options

There are two realistic near-term options.

### Option A: Shared Supabase Project

Description:

- portal and PhotoVault share the same Supabase project for auth and selected core identity data

Pros:

- fastest path
- simplest session compatibility
- easiest user identity continuity

Cons:

- tighter coupling between platform and product data environments
- harder to separate later if boundaries are not respected

### Option B: Separate Supabase Projects with Launch Handoff

Description:

- portal and PhotoVault use separate backends and coordinate through explicit launch/session handoff patterns

Pros:

- cleaner system boundary
- better long-term separation

Cons:

- more complexity early
- more moving pieces for auth/session trust

## Recommended MVP Bias

For the first platform phase, the recommended bias is:

- prefer the simpler shared-auth-compatible path if it can be done without collapsing product boundaries

In practice, that means:

- keep the product schema separate conceptually
- but do not force a heavyweight custom SSO boundary before the portal MVP proves itself

## Launch URL and Routing Direction

The first PhotoVault launch flow should likely follow a pattern like:

- portal chooses active workspace
- launcher uses a product route or product entry URL
- workspace context is carried explicitly

What matters is not the final URL pattern itself.

What matters is that the flow answers:

- which workspace is being entered
- why this user is allowed to enter it

## Failure States the Portal Must Handle

The handoff model should also define how the portal behaves when:

- the workspace is not entitled to PhotoVault
- the product is still in setup
- the user no longer has membership
- the launch context is stale
- the product cannot resolve the workspace safely

The portal should present:

- a clear status
- a next action
- not a confusing failed redirect

## Recommended Near-Term Implementation Order

1. define the active workspace selection model in the portal
2. define the PhotoVault launcher contract
3. implement product entitlement check before launch
4. implement product-side verification in PhotoVault
5. refine toward a more seamless shared login experience after the first launch flow works

## Open Questions To Resolve Later

These do not need to block the first written model, but they will matter during implementation:

1. Should platform and PhotoVault share the same Supabase project initially?
2. What exact launch-state format should carry workspace context?
3. Which product access checks should live in the portal versus PhotoVault?
4. What should happen when a user navigates directly into PhotoVault without coming through the portal?
5. How should logout behave across platform and product surfaces?

## Summary

The first Canopy-to-PhotoVault auth and session model should be:

- portal-led for identity and workspace resolution
- explicit about active workspace context
- product-verified on entry
- simple enough to implement without a heavyweight custom SSO system

That approach keeps the platform real, keeps PhotoVault independent as a product, and preserves a path toward stronger unified login later.
