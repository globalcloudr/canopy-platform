# Canopy Workspace and Identity Model

Date: 2026-03-23

## Purpose

Define the foundational identity and workspace model for Canopy so every product can rely on the same answers to:

- who is the user
- which school account is active
- what products can they access
- what permissions apply

This is the most important platform-level model to get right early.

## Core Principle

Canopy should treat each school customer as a `Workspace`.

The workspace is the primary account boundary for:

- access
- product enablement
- billing
- settings
- reporting scope

Products should not invent their own competing top-level account concepts unless there is a strong reason.

## Core Objects

### `User`

A person with Canopy access.

Examples:

- school owner
- school staff member
- Canopy platform operator

Core responsibilities:

- authentication identity
- personal profile
- login credentials or SSO identity

### `Workspace`

The top-level school or education-organization account in Canopy.

Examples:

- one adult school
- one district program group
- one client organization

Core responsibilities:

- platform account boundary
- subscription ownership
- enabled products
- shared profile and settings

### `Membership`

The relationship between a `User` and a `Workspace`.

Core responsibilities:

- ties a user to a workspace
- defines workspace-level access
- supports invited and active states

### `PlatformRole`

A platform-level role used for Canopy internal administration.

Examples:

- `super_admin`
- `platform_staff`

These roles should be distinct from school-facing product roles.

### `ProductEntitlement`

A record of which products and services are enabled for a workspace.

Examples:

- PhotoVault enabled
- Reach Canopy enabled
- Community Canopy pilot access

## Recommended Identity Hierarchy

The identity model should work like this:

1. a person authenticates as a `User`
2. the platform resolves which `Workspace` or workspaces they belong to
3. the user selects or is routed into an active workspace
4. the platform resolves product entitlements for that workspace
5. products inherit workspace context and access rules

## Recommended Access Layers

There should be three distinct access layers.

### 1. Platform Access

Determines whether the user can access internal Canopy operator functions.

Examples:

- manage platform users
- manage customer accounts
- handle support/admin actions

This should be controlled by `PlatformRole`.

### 2. Workspace Access

Determines whether the user belongs to a specific school account.

Examples:

- owner of School A
- staff member in School B

This should be controlled by `Membership`.

### 3. Product Access

Determines whether the workspace has access to a product and what the user can do inside it.

Examples:

- workspace has PhotoVault but not Reach Canopy
- workspace has Community Canopy in pilot

This should be controlled by:

- workspace product entitlement
- product-specific role mapping

## Recommended Workspace Model

Each workspace should have:

- stable `workspace_id`
- display name
- primary school profile metadata
- billing/subscription state
- product entitlements
- brand profile linkage
- created/updated timestamps

Optional later additions:

- multi-campus structure
- workspace grouping
- service tier metadata
- reseller/partner relationship metadata

## Membership Model

Each membership should include:

- `user_id`
- `workspace_id`
- `status`
  - invited
  - active
  - suspended
- `workspace_role`
  - initial role model should stay simple
- created/updated timestamps

Recommended initial workspace-facing roles:

- `owner`
- `admin`
- `staff`

These are platform/workspace roles, not necessarily the exact same roles used inside every product.

Products may map workspace access into more specialized product roles.

## Product Role Mapping

The platform should not try to define every internal product permission centrally.

Instead:

- the platform resolves workspace identity and entitlement
- the product maps workspace membership into product behavior

Example:

- platform sees user is active in workspace `A`
- platform sees workspace `A` has PhotoVault enabled
- PhotoVault maps the user to product roles such as:
  - `owner`
  - `uploader`
  - `viewer`

This keeps the platform core simpler and prevents permission sprawl.

## Single Sign-On Direction

Long-term goal:

- one Canopy login across products

Recommended behavior:

- user authenticates through the Canopy portal
- products trust the platform identity or shared auth layer
- products receive active workspace context from the platform

This can be implemented incrementally.

Near term, the key is to preserve a model that can support SSO later even if some products begin with separate auth plumbing.

## Active Workspace Resolution

The platform should always know the current active workspace.

Recommended behavior:

- users with one workspace enter it automatically
- users with multiple workspaces choose from a workspace switcher
- workspace selection persists across product launches where possible

Products should not have to guess the active account from inconsistent local state.

## Canonical Questions the Platform Must Answer

Before any product launches, the platform should be able to answer:

- who is this user
- are they a platform operator
- which workspace is active
- which workspaces belong to them
- which products are enabled for this workspace
- what level of workspace access do they have

If the platform can answer those questions reliably, product integration becomes much easier.

## Initial Data Model Recommendation

Recommended early canonical entities:

- `users`
- `workspaces`
- `memberships`
- `platform_roles`
- `product_entitlements`
- `subscriptions`

This is enough to power:

- login
- workspace selection
- product launcher
- account visibility
- product access logic

## Relationship to PhotoVault

PhotoVault should evolve to consume this model, not define the platform model itself.

That means:

- PhotoVault remains product-specific
- the Canopy platform becomes the source of truth for workspace identity
- PhotoVault uses platform context to resolve product access

## Recommended Near-Term Decisions

1. choose the canonical name: `Workspace`
2. define initial workspace-facing roles
3. define how product roles derive from workspace access
4. define the first SSO/auth implementation path
5. define how active workspace context is passed into products

## Summary

The Canopy identity model should be:

- `User` as the person
- `Workspace` as the school account
- `Membership` as the relationship
- `PlatformRole` for internal operator access
- `ProductEntitlement` for enabled products

That model gives Canopy a clear center and lets products plug into one shared account system.
