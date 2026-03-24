# Canopy Schema Implementation Path

Date: 2026-03-23

## Purpose

Define the first practical implementation path for the Canopy platform core schema.

This document bridges the gap between:

- conceptual architecture
- the core object model
- the first real portal implementation

It focuses on:

- the recommended near-term backend path
- the order in which core tables should be introduced
- the minimum constraints needed for the portal MVP
- how this work should relate to PhotoVault and future products

## Recommended Near-Term Backend Choice

Recommended starting point:

- use a Supabase-backed platform core for the first Canopy portal implementation

Reason:

- it aligns with the existing PhotoVault direction
- it is fast to stand up for auth and relational data
- it supports the first portal MVP without overbuilding
- it leaves room to evolve later if the platform outgrows the initial setup

This is a pragmatic implementation decision, not a long-term lock-in statement.

The platform principle still matters more than the exact tool:

- Canopy must have one clear source of truth for identity, workspace access, and product entitlements

## Scope of the First Schema

The first schema should support only what the portal MVP needs:

- user identity
- workspace access
- platform operator access
- product entitlements
- simple subscription state

Do not try to model:

- every future product object
- detailed feature flags
- complex billing engines
- deep service delivery workflows

The first schema should be small, explicit, and stable.

## Recommended Implementation Order

### Step 1: `users`

Purpose:

- anchor the signed-in person record used by the platform

Implementation note:

- if using Supabase Auth, the canonical auth identity will come from `auth.users`
- the platform should still maintain a first-class application user/profile record for portal-specific fields

Recommended initial fields:

- `id`
- `email`
- `display_name`
- `avatar_url`
- `status`
- `last_login_at`
- `created_at`
- `updated_at`

Why first:

- every other core relationship depends on user identity

### Step 2: `workspaces`

Purpose:

- define the top-level Canopy customer/school account

Recommended initial fields:

- `id`
- `slug`
- `display_name`
- `workspace_type`
- `status`
- `primary_contact_user_id`
- `school_profile_status`
- `brand_profile_status`
- `created_at`
- `updated_at`

Why second:

- the portal needs a stable account object before it can resolve memberships or product access

### Step 3: `memberships`

Purpose:

- connect users to workspaces and define workspace-facing access

Recommended initial fields:

- `id`
- `workspace_id`
- `user_id`
- `workspace_role`
- `status`
- `invited_by_user_id`
- `joined_at`
- `created_at`
- `updated_at`

Why third:

- this is what allows the portal to answer:
  - which workspaces belong to this user
  - what role do they have there

### Step 4: `platform_roles`

Purpose:

- separate internal Canopy operator access from customer workspace access

Recommended initial fields:

- `id`
- `user_id`
- `role`
- `status`
- `granted_by_user_id`
- `created_at`
- `updated_at`

Why fourth:

- operator access is important but not needed to establish the basic customer workspace model

### Step 5: `product_entitlements`

Purpose:

- determine what each workspace can access

Recommended initial fields:

- `id`
- `workspace_id`
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

Why fifth:

- this powers the product launcher and makes the portal a real control plane

### Step 6: `subscriptions`

Purpose:

- add minimal commercial/service context

Recommended initial fields:

- `id`
- `workspace_id`
- `status`
- `plan_key`
- `billing_model`
- `starts_at`
- `ends_at`
- `notes`
- `created_at`
- `updated_at`

Why sixth:

- useful for account visibility, but not strictly required to render the first product launcher

## Recommended Initial Constraints

The first schema should enforce a few important invariants.

### `users`

- unique `email`

### `workspaces`

- unique `slug`

### `memberships`

- unique active relationship per `user_id` + `workspace_id`

### `platform_roles`

- avoid duplicate active platform-role assignment for the same user and role

### `product_entitlements`

- unique active row per `workspace_id` + `product_key`

### `subscriptions`

- one current active subscription row per workspace for MVP simplicity

## Recommended Status Sets

To reduce drift, keep the first implementation aligned to the object-model docs.

### `users.status`

- `active`
- `invited`
- `suspended`

### `workspaces.status`

- `active`
- `setup`
- `paused`
- `archived`

### `memberships.status`

- `invited`
- `active`
- `suspended`
- `removed`

### `platform_roles.status`

- `active`
- `suspended`
- `revoked`

### `product_entitlements.status`

- `trial`
- `active`
- `pilot`
- `paused`
- `retired`

### `product_entitlements.setup_state`

- `not_started`
- `in_setup`
- `ready`
- `blocked`

### `subscriptions.status`

- `active`
- `trial`
- `paused`
- `expired`

## What the Portal Should Implement First

The first portal implementation does not need every table fully used on day one.

Recommended functional rollout:

### Portal Milestone 1

Needs:

- `users`
- `workspaces`
- `memberships`

Supports:

- sign-in
- workspace resolution
- workspace switcher

### Portal Milestone 2

Needs:

- `product_entitlements`

Supports:

- entitlement-aware product launcher
- product state display

### Portal Milestone 3

Needs:

- `platform_roles`
- `subscriptions`

Supports:

- operator/admin surfaces
- simple service/account visibility

## Relationship to PhotoVault

The platform schema should not try to absorb PhotoVault's domain schema.

Recommended rule:

- Canopy platform core owns identity, workspaces, and entitlements
- PhotoVault continues to own its product-specific domain model

This means:

- PhotoVault should eventually consume platform context
- the platform should not duplicate PhotoVault's asset, album, or product-domain tables

## Phase 5 Entry Point: Shared Supabase Project

**Decision (confirmed 2026-03-23):** PhotoVault's existing Supabase project will be promoted to the Canopy platform core. A separate Supabase project will not be created.

**Why this is safe:**
- PhotoVault is still in beta with operator-populated test data only
- No real customer data is at risk
- The existing tables and auth setup give a clean starting foundation

**Why this is the right call:**
- Avoids cross-project auth token passing and JWT complexity at the start
- The portal and PhotoVault can share `auth.users` and `workspaces` natively
- One source of truth from day one

### Phase 5 Pre-Build Checklist

Before writing any Phase 5 portal code against Supabase, complete these steps in order:

1. **Audit existing PhotoVault tables** — identify which are platform-core-safe (users, auth) vs. PhotoVault-specific (assets, albums, etc.). Document the boundary.
2. **Add `product_entitlements` table** — this is the only new platform-core table needed. Use the schema defined in Step 5 above.
3. **Review and tighten RLS policies** — PhotoVault's existing policies were written for a single-product context. Update them to account for platform-level workspace and role concepts.
4. **Switch portal auth to server-side Supabase calls** — replace the `platform.ts` mock layer with real Supabase queries using the same Supabase project.
5. **Keep PhotoVault domain tables separate** — do not merge or rename PhotoVault's product-specific tables into platform-core names. Platform core and PhotoVault domain live in the same project but remain logically distinct.

## Resolved Questions

The following questions from the original open list have been decided:

**1. Shared Supabase project?**
Yes. PhotoVault's Supabase project becomes the platform core. See Phase 5 Entry Point section above.

**4. Should non-enabled products appear in the portal?**
Yes — upsell visibility. Non-enabled products render as dimmed cards in a "More from Canopy" section with a "Request Access" action. They do not link to the product itself. See `docs/mvp-product-catalog.md`.

## Remaining Open Questions

These decisions can remain open until Phase 5 build begins:

1. What is the first auth/session handoff path from portal to PhotoVault? (token passing vs. shared session)
2. How should active workspace context be persisted across product launches? (URL param, cookie, or Supabase session metadata)
3. What is the first operational flow for provisioning a new workspace and its initial entitlements? (manual Supabase insert at MVP, or a lightweight admin UI)

## Recommended Near-Term Implementation Bias

Unless a strong reason appears otherwise, the best near-term bias is:

- use Supabase for the initial platform core
- keep the schema small
- build the portal against real objects early
- avoid premature multi-service complexity

This will make Canopy feel real much faster.

## Summary

The first Canopy platform schema should be implemented in this order:

1. `users`
2. `workspaces`
3. `memberships`
4. `platform_roles`
5. `product_entitlements`
6. `subscriptions`

That is enough to support a credible portal MVP and establish the real platform center before additional products are connected.
