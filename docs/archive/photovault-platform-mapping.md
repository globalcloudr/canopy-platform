# PhotoVault To Canopy Platform Mapping

Date: 2026-03-27

## Purpose

Map the existing PhotoVault implementation into the Canopy platform model so the portal can launch quickly without forcing an early full rewrite of the live product.

This document is a transition map.

It is not a claim that PhotoVault should permanently own platform-core concerns.

## Mapping Principle

The MVP goal is:

- reuse the working PhotoVault data model where it already overlaps with platform needs
- add the missing platform-core objects carefully
- avoid duplicating the same concept in multiple places without a migration plan

## High-Level Mapping

| PhotoVault today | Canopy platform concept | MVP handling |
|---|---|---|
| `organizations` | `workspaces` | Treat `organizations` as the active workspace/account object for MVP |
| `memberships` | `memberships` | Reuse as the working workspace-access model |
| `profiles.is_super_admin` / `profiles.platform_role` | `platform_roles` | Use as compatibility source until canonical platform-role storage is finalized |
| `albums`, `assets`, brand files | PhotoVault product objects | Keep product-owned inside PhotoVault |
| no current product entitlement table | `product_entitlements` | Add in shared Supabase project |
| current product routes and UI | PhotoVault product app | Keep in PhotoVault, launched from Canopy |

## Workspace Mapping

### PhotoVault Object

- `organizations`

Current responsibility:

- top-level customer/school account
- org-scoped data boundary
- active org context for product behavior

Canopy equivalent:

- `Workspace`

MVP recommendation:

- treat `organizations` as the working Canopy workspace/account object during initial launch

Reason:

- it already functions as the top-level customer boundary
- it is already integrated with memberships, RLS, and product behavior
- replacing it immediately would add migration risk without improving the first launch

Longer-term direction:

- decide later whether `organizations` should be renamed, wrapped, or replaced by a canonical `workspaces` table

## Membership Mapping

### PhotoVault Object

- `memberships`

Current responsibility:

- ties users to organizations
- provides product access boundary
- stores current role values

Canopy equivalent:

- `Membership`

MVP recommendation:

- reuse `memberships` as the working workspace-membership model

Important note:

- PhotoVault's current role set is product-oriented
- Canopy's long-term workspace-role model is broader and should remain platform-owned conceptually

## Role Mapping

### PhotoVault Product Roles

Current PhotoVault product membership roles:

- `owner`
- `uploader`
- `viewer`

These reflect product behavior inside PhotoVault.

### Canopy Workspace Roles

Planned Canopy workspace-facing roles:

- `owner`
- `admin`
- `staff`

### MVP Recommendation

Do not force immediate role unification across both systems.

Instead:

- let Canopy determine workspace eligibility and product launch
- let PhotoVault continue mapping access into its own product behavior

Near-term mapping direction:

- Canopy `owner` -> PhotoVault `owner`
- Canopy `admin` -> PhotoVault manager/uploader-equivalent behavior
- Canopy `staff` -> PhotoVault `viewer` or another product-local role based on policy

Rule:

- the portal decides whether the workspace can launch PhotoVault
- PhotoVault decides what the user can do inside PhotoVault

## Platform Operator Mapping

### PhotoVault Today

PhotoVault already supports platform-oriented access concepts through:

- `profiles.is_super_admin`
- `profiles.platform_role`

Observed platform roles:

- `super_admin`
- `platform_staff`

Canopy equivalent:

- `PlatformRole`

MVP recommendation:

- use the existing PhotoVault-compatible platform-role model as the transition source
- normalize this into the portal behavior
- decide later whether a dedicated `platform_roles` table becomes the canonical platform record

## Product Entitlement Mapping

### PhotoVault Today

PhotoVault has no full Canopy-wide entitlement layer yet.

Canopy equivalent:

- `product_entitlements`

MVP recommendation:

- add `product_entitlements` in the shared Supabase project
- start with one row per workspace/product combination
- first required product key: `photovault`

Minimum useful fields:

- `workspace_id` or compatible `organization_id`
- `product_key`
- `status`
- `plan_key`
- `setup_state`
- `source`
- timestamps

Portal usage:

- determine whether PhotoVault appears in the launcher
- determine whether it is enabled, pilot, or in setup
- determine whether launch is allowed

## Auth And Session Mapping

### PhotoVault Today

- Supabase Auth
- org context resolved in the product
- current active org heavily influenced by client-side state

Canopy requirement:

- portal-owned identity entry
- portal-owned active workspace resolution
- product launch with explicit workspace context

MVP recommendation:

- use a shared Supabase-compatible auth/session model
- let Canopy become the primary sign-in destination
- launch PhotoVault with explicit workspace context
- require PhotoVault to re-check membership and access on entry

## Launch Handoff Mapping

Required Canopy responsibilities:

- authenticate the user
- resolve active workspace
- confirm `photovault` entitlement
- launch with explicit workspace context

Required PhotoVault responsibilities:

- verify authenticated user
- verify workspace membership
- verify access compatibility for PhotoVault
- map role into PhotoVault behavior

What not to do:

- do not trust a launch URL alone
- do not rely only on local storage for workspace handoff

## What Remains Product-Owned In PhotoVault

These stay in PhotoVault and should not be promoted into platform core during MVP launch:

- `albums`
- `assets`
- `asset variants`
- `share_links`
- `org_theme_settings`
- storage structure and media access policies
- brand portal content/config
- audit events tied to PhotoVault product activity

## What Needs To Be Added On The Platform Side

For MVP launch, Canopy still needs:

- a real auth/session layer in the portal
- a real workspace-resolution layer in the portal
- a real entitlement layer
- a real launcher backed by actual workspace/product state

## Recommended Migration Stance

Near-term recommendation:

- reuse PhotoVault's existing customer/org/membership model as the bridge
- add the missing platform objects around it
- move platform-front-door responsibility into Canopy
- keep product workflows in PhotoVault

Long-term recommendation:

- gradually make Canopy the source of truth for identity, invitations, workspace membership, and entitlements
- keep PhotoVault the source of truth for media and brand asset workflows

## Summary

The MVP platform mapping should be:

- `organizations` function as workspaces for now
- `memberships` function as workspace access for now
- platform-role compatibility comes from the current PhotoVault profile model
- `product_entitlements` are added as the missing platform-core layer
- Canopy launches PhotoVault as Product 1 without forcing a risky rewrite of the live product
