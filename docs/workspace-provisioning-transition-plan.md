# Canopy Workspace Provisioning Transition Plan

Date: 2026-03-27

## Purpose

Define how workspace provisioning moves from today's PhotoVault-heavy operational flow into a Canopy-owned platform workflow.

This plan treats invitation as only one part of provisioning.

Provisioning also includes:

- selecting or creating the workspace
- assigning the initial admin
- setting workspace role
- enabling products and services
- setting initial access/setup state

## Current Platform State

Today:

- PhotoVault already has a practical super-admin invite flow
- Canopy now has real auth, workspace resolution, entitlement visibility, and product launch behavior
- `product_entitlements` already exists in the shared Supabase project
- Canopy does not yet have the super-admin workflow needed to replace PhotoVault provisioning fully

That means:

- PhotoVault is the temporary operational path
- Canopy is the correct long-term owner

## Ownership Decision

Long-term ownership:

- Canopy owns workspace provisioning
- Canopy owns school-admin invitation
- Canopy owns workspace membership setup
- Canopy owns product and service enablement at the workspace level

PhotoVault role after transition:

- consume valid workspace membership and entitlement state
- map members into PhotoVault product behavior
- stop acting as the primary provisioning surface

This belongs in platform core because provisioning determines:

- which workspace exists
- who administers it
- which products/services are enabled
- how the customer first enters the platform

## What Stays In PhotoVault For Now

Keep the current PhotoVault operational flow for now if it is needed for:

- super-admin continuity
- real customer onboarding before Canopy admin UX exists
- testing and support during the transition

Rule:

- treat PhotoVault provisioning as a compatibility bridge, not the long-term platform model

## What Moves To Canopy Later

The future Canopy-owned provisioning flow should cover:

- super admin creates or selects a workspace
- super admin invites the initial school admin
- Canopy creates or prepares workspace membership
- Canopy enables the correct products and services
- Canopy records product/service status and setup state
- the invited admin signs in through Canopy
- the dashboard shows only the provisioned products/services

Optional later extension:

- workspace admins invite additional staff from Canopy
- workspace admins request or activate additional products/services through Canopy-managed flows

## Recommended Transition Sequence

### Stage 1: Keep PhotoVault As Compatibility Path

Use today:

- PhotoVault invite/provisioning behavior remains operational
- Canopy remains the portal/front door

Goal:

- do not block launch or customer onboarding while platform admin UX is still maturing

### Stage 2: Lock The Provisioning Data Contract In Canopy

Before building Canopy admin UI, lock the platform data contract for:

- invited user identity
- target workspace
- target workspace role
- product entitlements
- service enablement state
- setup status
- invitation state
- acceptance state

Goal:

- Canopy should own the provisioning model before it owns the whole workflow

### Stage 3: Build Minimal Canopy Super-Admin Provisioning UI

Add a small Canopy admin surface for:

- selecting or creating a workspace
- inviting the school admin
- choosing initial workspace role
- enabling products/services
- reviewing invitation and provisioning status

Keep the first scope small:

- one workspace at a time
- one initial admin at a time
- a simple set of product/service toggles
- no bulk import
- no heavy automation

### Stage 4: Provision Shared Membership And Entitlements First

When Canopy provisions a workspace, it should create or prepare:

- shared workspace membership state
- product entitlements
- service visibility state

PhotoVault should then rely on that shared state instead of requiring its own parallel provisioning loop.

### Stage 5: Retire PhotoVault As Primary Provisioning Surface

Only when Canopy fully covers the real operational use case:

- move super-admin onboarding workflow and documentation to Canopy
- reduce or remove primary provisioning initiation from PhotoVault
- keep only product-local access mapping where necessary

## Source-Of-Truth Rules

Canopy should own:

- workspace provisioning initiation
- invitation initiation and status
- workspace membership creation
- workspace role assignment
- product entitlement state
- service visibility and setup state

PhotoVault should own:

- product-role mapping
- product-specific access behavior after membership and entitlement are valid

Canopy should not own:

- PhotoVault album/media workflows
- product-specific permissions beyond launch/access eligibility

PhotoVault should not own long-term:

- primary workspace provisioning
- primary school-admin invitation
- primary cross-product onboarding

## MVP Scope For The Future Canopy Provisioning Flow

The smallest safe Canopy version of this feature is:

- super admin picks or creates a workspace
- enters school-admin email
- selects initial workspace role
- enables products/services for that workspace
- records setup state
- sends invitation
- accepted invitation results in valid workspace membership and visible product access

That is enough to shift ownership without overbuilding.

## What Not To Do

- do not build both Canopy and PhotoVault as equal permanent provisioning owners
- do not separate school-admin invitation from product/service enablement in a way that creates operational drift
- do not remove PhotoVault's current operational path before Canopy can replace it
- do not push product-specific onboarding rules into platform core unless they apply across products
- do not tie the first Canopy provisioning flow to a large billing or automation rewrite

## Implementation Bias

Near-term bias:

- keep onboarding working
- keep changes minimal
- move ownership deliberately

Long-term bias:

- Canopy becomes the single workspace provisioning entry point
- PhotoVault becomes a launched product that trusts shared platform membership and entitlement state

## Suggested Next Build Step

After the auth/session handoff work, the next admin-focused platform feature should be:

- a minimal Canopy super-admin workspace provisioning page

That page should start by matching the practical outcome of today's PhotoVault operational flow, with product/service enablement included from the beginning.
