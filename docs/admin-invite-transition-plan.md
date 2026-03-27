# Canopy Admin Invite Transition Plan

Date: 2026-03-27

## Purpose

Define how school-admin invitation moves from a working PhotoVault implementation into the Canopy platform without breaking the current launch path.

This document is intentionally transition-focused.

It exists to prevent two bad outcomes:

- leaving invite ownership in PhotoVault forever
- moving invite behavior into Canopy before the portal is ready to replace it safely

## Current Platform State

Today:

- PhotoVault already has a practical super-admin invite flow
- Canopy now has real auth, workspace resolution, entitlement visibility, and product launch behavior
- Canopy does not yet have the admin-facing workflow needed to replace PhotoVault invitations fully

That means:

- PhotoVault is the temporary working implementation
- Canopy is the correct long-term owner

## Ownership Decision

Long-term ownership:

- Canopy owns invitation and membership onboarding for workspace admins and staff

PhotoVault role after transition:

- consume workspace membership and product entitlement state
- map valid members into PhotoVault product behavior
- stop acting as the primary invitation surface

This is a platform-core responsibility because invitations determine:

- who belongs to a workspace
- which role they receive
- which products they can access
- how onboarding begins across the platform

## What Stays In PhotoVault For Now

Keep the current PhotoVault invite flow for now if it is needed for:

- super-admin operational continuity
- real customer onboarding before Canopy admin UX exists
- testing and support during the transition

Do not expand it further as the long-term solution.

Rule:

- maintain PhotoVault invite behavior only as a compatibility bridge

## What Moves To Canopy Later

The future Canopy-owned admin flow should cover:

- super admin creates or selects a workspace
- super admin invites a school admin into that workspace
- Canopy creates workspace membership
- Canopy sets or confirms initial product entitlements
- the invited admin signs in through Canopy
- products appear based on entitlement and membership state

Optional later extension:

- workspace admins invite additional staff from Canopy as well

## Recommended Transition Sequence

### Stage 1: Keep PhotoVault As Compatibility Path

Use today:

- PhotoVault invite flow remains operational
- Canopy remains the portal/front door

Goal:

- do not block launch or onboarding while platform admin UX is still maturing

### Stage 2: Mirror The Data Contract In Canopy

Before building the new Canopy invite UI, lock the data contract:

- invited user identity
- target workspace
- target workspace role
- target product entitlements
- invitation state
- acceptance state

Goal:

- Canopy should own the conceptual model before it owns the whole UI flow

### Stage 3: Build Canopy Super-Admin Invite UI

Add a minimal Canopy admin surface for:

- inviting a school admin to a workspace
- seeing invitation status
- seeing workspace membership summary

Keep the first scope small:

- one workspace at a time
- one invite at a time
- no bulk import
- no deep automation

### Stage 4: Provision Shared Membership First

When Canopy sends an invite, it should create or prepare:

- shared workspace membership state
- product entitlement visibility

PhotoVault should then rely on that shared state instead of requiring its own parallel invite loop.

### Stage 5: Retire PhotoVault As Primary Invite Surface

Only when Canopy can fully cover the practical admin use case:

- move primary documentation and operator workflow to Canopy
- reduce or remove invite initiation from PhotoVault
- keep only product-local access mapping where necessary

## Source-Of-Truth Rules

Canopy should own:

- invitation initiation
- invitation status
- workspace membership creation
- workspace role assignment
- product visibility at the workspace level

PhotoVault should own:

- product-role mapping
- product-specific access behavior after membership is valid

Canopy should not own:

- PhotoVault album/media behavior
- product-specific permissions beyond launch eligibility

PhotoVault should not own long-term:

- primary workspace-admin invitation
- primary cross-product onboarding

## MVP Scope For The Future Canopy Invite Flow

The smallest safe Canopy version of this feature is:

- super admin picks a workspace
- enters school-admin email
- selects initial role
- sends invitation
- Canopy records pending invitation state
- accepted invitation results in valid workspace membership

That is enough to shift ownership without overbuilding.

## What Not To Do

- do not build both Canopy and PhotoVault as equal permanent invite owners
- do not remove the PhotoVault invite path before Canopy can replace it
- do not push product-specific onboarding rules into platform core unless they apply across products
- do not tie the first Canopy invite flow to a large billing or automation project

## Implementation Bias

Near-term bias:

- keep onboarding working
- keep changes minimal
- move ownership deliberately

Long-term bias:

- Canopy becomes the single invitation and workspace-membership entry point
- PhotoVault becomes a launched product that trusts shared platform membership and entitlement state

## Suggested Next Build Step

After the auth/session handoff work, the next admin-focused platform feature should be:

- a minimal Canopy super-admin invite page for workspace admins

That page should start by matching the practical outcome of the existing PhotoVault flow, not by trying to redesign the entire platform admin experience at once.
