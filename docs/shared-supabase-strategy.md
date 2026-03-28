# Canopy Shared Supabase Strategy

Date: 2026-03-27

## Purpose

Define the near-term backend strategy for launching Canopy quickly and safely using the existing PhotoVault Supabase foundation.

This document answers:

- whether Canopy and PhotoVault should share a Supabase project for MVP
- which existing PhotoVault tables Canopy should read first
- which new platform tables should be added first
- what must remain product-owned

## Recommendation

For the Canopy MVP, use **one shared Supabase project** for both:

- `canopy-platform`
- `photovault`

This is the recommended MVP bias because:

- PhotoVault already has the live auth and data foundation
- Canopy does not yet have a real backend
- shared auth/session compatibility is easier with one Supabase project
- workspace and membership continuity is easier to maintain
- it avoids early duplication and sync complexity

This is a pragmatic launch decision, not a permanent lock-in requirement.

## What Shared Means

One shared Supabase project means:

- one `auth.users` identity base
- one Postgres database
- one storage/account environment
- one set of environment credentials per deployed app

It does **not** mean:

- one giant undifferentiated schema
- no ownership boundaries
- platform core can read or mutate every product object freely

The platform boundary must remain explicit even inside a shared Supabase environment.

## MVP System-Of-Record Rules

For MVP, the system of record should be:

- identity and authentication
  - shared Supabase Auth foundation
- workspace/account boundary
  - PhotoVault `organizations` acting as the MVP workspace bridge
- workspace access
  - PhotoVault `memberships` acting as the MVP membership bridge
- platform operator access
  - PhotoVault-compatible profile/platform-role model during transition
- product entitlements
  - Canopy platform core
- approved media and brand assets
  - PhotoVault

## Existing PhotoVault Tables Canopy Should Read First

For the first real portal implementation, Canopy should read only the minimum existing PhotoVault-backed objects it needs.

### 1. `organizations`

Use as the MVP equivalent of `workspaces`.

Needed for:

- active workspace resolution
- dashboard identity
- workspace switcher behavior

### 2. `memberships`

Use as the MVP equivalent of workspace memberships.

Needed for:

- determining which organizations/workspaces a user belongs to
- role-aware routing and visibility

### 3. `profiles` compatibility fields

Observed fields currently relevant in PhotoVault:

- `is_super_admin`
- `platform_role`

Needed for:

- platform operator visibility
- support/admin flows

Rule:

- Canopy should use these as compatibility inputs during MVP unless a canonical platform-role table is introduced immediately

### 4. `auth.users`

Use for:

- authenticated identity
- canonical auth user record
- email resolution where app-local tables do not store email directly

## New Platform Tables To Add First

The portal does not need the full long-term platform schema on day one.

Add only the minimum missing platform tables first.

### 1. `product_entitlements`

This is the most important new platform table.

Purpose:

- determine which products/services a workspace can access
- drive portal launcher visibility and state
- control launch eligibility

Minimum recommended fields:

- `id`
- `workspace_id` or compatible `organization_id`
- `product_key`
- `status`
- `plan_key`
- `setup_state`
- `source`
- `starts_at`
- `ends_at`
- `notes`
- `created_at`
- `updated_at`

Initial required product key:

- `photovault`

### 2. `workspace_service_states`

Services should not be treated as products if they represent managed offerings rather than launched apps.

Purpose:

- determine which services are visible for a workspace
- track basic service status in the portal
- support provisioning without overloading `product_entitlements`

Recommended minimum fields:

- `id`
- `organization_id`
- `service_key`
- `status`
- `setup_state`
- `source`
- `notes`
- `starts_at`
- `ends_at`
- `created_at`
- `updated_at`

Recommended status examples:

- `active`
- `available`
- `paused`
- `inactive`

Recommended setup state examples:

- `ready`
- `setup`
- `pilot`

Initial service use:

- simple visibility and operational state in the portal
- not deep service workflow configuration

### 3. `platform_roles` or canonical equivalent

Only add this immediately if you decide the current profile-based compatibility model is not sufficient.

Purpose:

- formalize Canopy-internal operator access

If delayed for MVP:

- continue using PhotoVault's current compatibility model

### 4. `subscriptions` (optional for early MVP)

Purpose:

- basic account/service visibility

This is useful later, but not required to make the first launcher real.

## Tables Canopy Should Not Own

The portal should not become the owner of PhotoVault product objects.

These remain product-owned:

- `albums`
- `assets`
- `share_links`
- `org_theme_settings`
- asset variants and storage-path rules
- brand portal files/content
- PhotoVault product audit data

Canopy may reference PhotoVault as a product, but should not absorb its workflow tables into platform core.

## Query Scope Rules For MVP

Canopy should prefer reading:

- user identity
- active organization/workspace
- memberships
- platform-role compatibility
- product entitlements
- workspace service states

Canopy should avoid directly reading:

- deep product workflow tables
- product-only configuration tables
- product-specific content models

Reason:

- the first portal only needs identity, workspace, and launcher answers

## Product Vs Service Persistence Rule

Canopy should store products and services separately.

Use `product_entitlements` for:

- launched apps
- product access control
- launcher visibility
- product setup state

Use `workspace_service_states` for:

- managed services
- service visibility in the portal
- basic service lifecycle/status

Do not:

- overload `product_entitlements` with service-specific meaning
- mix launched-app access rules and managed-service operational state into one table unless there is a strong future reason and an explicit migration plan

## Auth And Session Strategy

Recommended MVP strategy:

- Canopy and PhotoVault use the same Supabase Auth foundation
- Canopy becomes the primary sign-in destination
- Canopy resolves the active workspace before launch
- PhotoVault verifies session and workspace access after launch

This avoids:

- custom SSO too early
- duplicate auth systems
- complex token exchange before it is needed

## Workspace Resolution Strategy

Near-term rule:

- Canopy should choose the active workspace
- the launch into PhotoVault should carry explicit workspace context
- PhotoVault should re-check that the user has access to that workspace

Do not rely only on:

- client local storage
- implicit last-used state
- trust in the launch URL without verification

## Schema Evolution Strategy

For MVP:

- use existing PhotoVault tables as the compatibility bridge
- add the smallest missing platform objects
- avoid broad renaming migrations unless they solve a real problem

Later:

- evaluate whether `organizations` should remain the shared top-level account object or evolve into canonical `workspaces`
- evaluate whether `platform_roles` should move out of profile compatibility fields into its own canonical table
- evaluate whether multiple Supabase projects are needed only after the platform model is stable

## Why Not Two Databases Yet

Using two databases now would introduce:

- duplicate identity concerns
- harder auth/session handoff
- workspace sync complexity
- entitlement sync complexity
- more deployment and operational surface area

There is no strong MVP benefit that outweighs that added complexity.

The right current priority is:

- clear ownership boundaries inside one backend

not:

- physical backend separation before launch

## Recommended First Portal Data Reads

The first real portal implementation should support:

1. authenticated user
2. list of organizations/workspaces for that user
3. active organization/workspace
4. operator/platform role if applicable
5. product entitlement rows for the active workspace

That is enough to support:

- sign-in
- workspace resolution
- launcher rendering
- PhotoVault launch eligibility

## Recommended Immediate Implementation Order

1. connect `canopy-platform` to the shared Supabase project
2. replace portal mock user/session resolution
3. replace portal mock workspace resolution using `organizations` + `memberships`
4. add and read `product_entitlements`
5. render the PhotoVault launcher state from real data
6. implement explicit launch handoff into PhotoVault

## Summary

The safest shared Supabase strategy is:

- one Supabase project for MVP
- strict ownership boundaries inside that project
- reuse PhotoVault's existing account and membership model as the bridge
- add `product_entitlements` as the key missing platform layer
- keep product workflows in PhotoVault while Canopy becomes the front door
