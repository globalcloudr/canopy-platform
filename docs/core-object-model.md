# Canopy Core Object Model

Date: 2026-03-23

## Purpose

Define the first implementation-level object model for the Canopy platform core.

This document translates the higher-level platform architecture into a practical foundational data model that can support:

- portal authentication and routing
- workspace-aware access
- product entitlement checks
- account and service visibility
- future cross-product platform behavior

This is the first version of the platform core model, not the final long-term model.

## Scope

This document covers the initial platform-core entities for the portal MVP:

- `users`
- `workspaces`
- `memberships`
- `platform_roles`
- `product_entitlements`
- `subscriptions`

It also defines:

- initial status values
- relationship rules
- minimal operational behavior

## Design Principles

The core object model should follow these rules:

- keep the top-level account model simple
- treat `Workspace` as the canonical school/customer account
- separate platform operator access from school/workspace access
- resolve product access at the workspace level first
- avoid over-modeling commercial and billing complexity too early
- support software, managed service, and hybrid delivery

## Core Entity Overview

### `users`

Represents a person with Canopy access.

Responsibilities:

- authentication identity
- personal account profile
- reusable person record across one or more workspaces

Recommended fields:

- `id`
- `email`
- `display_name`
- `avatar_url`
- `status`
- `last_login_at`
- `created_at`
- `updated_at`

Recommended status values:

- `active`
- `invited`
- `suspended`

Notes:

- one user may belong to multiple workspaces
- do not encode workspace access directly in the `users` table

### `workspaces`

Represents the top-level school or education-organization account.

Responsibilities:

- primary account boundary for the platform
- product enablement scope
- billing and service relationship scope
- shared profile and settings scope

Recommended fields:

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

Recommended status values:

- `active`
- `setup`
- `paused`
- `archived`

Recommended `workspace_type` values:

- `school`
- `district_program`
- `organization`

Notes:

- `school` will likely cover the majority of early customers
- use a stable `slug` for portal URLs and workspace routing

### `memberships`

Represents the relationship between a user and a workspace.

Responsibilities:

- workspace access
- workspace-level role assignment
- membership lifecycle state

Recommended fields:

- `id`
- `workspace_id`
- `user_id`
- `workspace_role`
- `status`
- `invited_by_user_id`
- `joined_at`
- `created_at`
- `updated_at`

Recommended `workspace_role` values:

- `owner`
- `admin`
- `staff`

Recommended `status` values:

- `invited`
- `active`
- `suspended`
- `removed`

Notes:

- product-specific roles should not be stored here initially
- product apps can map workspace membership into product behavior

### `platform_roles`

Represents Canopy-internal operator access.

Responsibilities:

- platform-level administrative permissions
- distinction between internal operator access and customer/workspace access

Recommended fields:

- `id`
- `user_id`
- `role`
- `status`
- `granted_by_user_id`
- `created_at`
- `updated_at`

Recommended `role` values:

- `super_admin`
- `platform_staff`

Recommended `status` values:

- `active`
- `suspended`
- `revoked`

Notes:

- this model should stay small
- do not overload it with product-specific permissions

### `product_entitlements`

Represents product access for a workspace.

Responsibilities:

- determine whether a workspace can access a product
- determine high-level product state in the portal
- support plan/tier and operational access state

Recommended fields:

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

Recommended `product_key` values:

- `photovault`
- `canopy_web`
- `create_canopy`
- `publish_canopy`
- `community_canopy`
- `reach_canopy`
- `assist_canopy`
- `insights_canopy`

Recommended `status` values:

- `trial`
- `active`
- `pilot`
- `paused`
- `retired`

Recommended `setup_state` values:

- `not_started`
- `in_setup`
- `ready`
- `blocked`

Recommended `source` values:

- `sales`
- `manual_provisioning`
- `migration`
- `internal_grant`

Notes:

- `status` answers whether the workspace is entitled
- `setup_state` answers whether the product is operationally ready
- this keeps commercial and setup concerns separate

### `subscriptions`

Represents the commercial/service relationship for a workspace.

Responsibilities:

- account plan tracking
- service and billing context
- future contract or service-package linkage

Recommended fields:

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

Recommended `status` values:

- `active`
- `trial`
- `paused`
- `expired`

Recommended `billing_model` values:

- `software`
- `service`
- `hybrid`

Notes:

- do not try to build a full pricing engine at the start
- this object should be simple enough to support manual operations

## Relationship Model

Initial relationship rules:

- one `User` can have many `Memberships`
- one `Workspace` can have many `Memberships`
- one `User` can have zero or more `PlatformRole` rows
- one `Workspace` can have many `ProductEntitlements`
- one `Workspace` can have one primary active `Subscription`

Recommended relationship summary:

- `users` 1 -> many `memberships`
- `workspaces` 1 -> many `memberships`
- `users` 1 -> many `platform_roles`
- `workspaces` 1 -> many `product_entitlements`
- `workspaces` 1 -> many `subscriptions`

## Canonical Questions This Model Must Answer

With this model, the platform should be able to answer:

- who is the signed-in user
- which workspaces belong to this user
- which workspace is currently active
- what workspace role does the user have there
- does the user also have platform operator access
- which products are enabled for the workspace
- which products are ready versus still in setup

If the model cannot answer those cleanly, the portal MVP will remain fuzzy.

## Portal MVP Query Needs

The portal MVP should be able to render its main state from this model.

### Sign-In / Session

Needs:

- current `User`
- any active `PlatformRole`

### Workspace Resolution

Needs:

- all active `Memberships` for the user
- associated `Workspace` records

### Workspace Home

Needs:

- active `Workspace`
- active `Membership`
- `ProductEntitlements` for the active workspace
- `Subscription` summary for the active workspace

### Product Launcher

Needs:

- product entitlements by `product_key`
- product setup state
- product display metadata from app configuration

## Recommended Initial Constraints

To keep the model stable early:

- one membership per `user_id` + `workspace_id`
- one active product entitlement per `workspace_id` + `product_key`
- one current primary subscription per workspace
- do not allow product apps to mutate platform-core identity records directly without an explicit service boundary

## Deliberate Non-Goals

Do not add these to the first implementation-level core model unless they are immediately needed:

- granular feature-flag systems
- complex seat licensing
- reseller/channel-partner hierarchies
- deep campus hierarchies
- custom object polymorphism
- per-product billing engines

Those can be added later once real pressure appears.

## Implementation Assumptions

This document assumes:

- the first platform app is the Canopy portal at `usecanopy.school`
- PhotoVault is the first connected product
- the platform core should be compatible with shared auth and future cross-product SSO
- the system must support both software and service-assisted customer relationships

## Recommended Next Steps

1. define the first concrete schema implementation path
2. define the first portal auth/session model
3. define how active workspace context is persisted
4. define portal display metadata for product cards and launch targets
5. define the first PhotoVault launch handoff contract

## Summary

The first implementation-level Canopy platform core should be built around six entities:

- `users`
- `workspaces`
- `memberships`
- `platform_roles`
- `product_entitlements`
- `subscriptions`

That is enough to support the portal MVP cleanly without overbuilding the platform too early.
