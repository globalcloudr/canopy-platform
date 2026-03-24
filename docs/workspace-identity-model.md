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

In business terms, this is also the customer `Organization`.

For the early platform model, `Workspace` and `Organization` can be treated as the same core object viewed from two angles:

- `Organization` = the school customer account
- `Workspace` = the active environment that school staff enter inside Canopy and its products

The workspace is the primary account boundary for:

- access
- product enablement
- billing
- settings
- reporting scope

Products should not invent their own competing top-level account concepts unless there is a strong reason.

## Terminology Direction

Recommended practical terminology:

- use `Workspace` as the canonical platform-model term in implementation docs and schema
- treat `Organization` as the plain-language business term for the same customer account

For early MVP, the important point is not the label.

The important point is that there is one shared top-level school account object across Canopy.

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
- supports Canopy-managed invitation flow

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

## Invitation Ownership

Long-term rule:

- invitation logic should live at `Canopy`

That means:

1. Canopy staff or an authorized school admin invites a user into the organization/workspace
2. the user accepts the invitation once
3. the user becomes an active Canopy user with workspace membership
4. products use that membership and product access to authorize entry

Products should not require a second separate invitation loop for the same staff user once the Canopy platform model is in place.

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

Recommended early invitation pattern:

- Canopy or platform staff invites the first school admin
- that school admin becomes the initial `owner` or `admin`
- that school admin can invite additional school staff into the workspace

This matches the current PhotoVault operating model and is a good Canopy starting point.

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

## Product Access Ownership

Canopy should decide:

- whether the organization/workspace has access to a product
- whether the user belongs to that organization/workspace
- whether the user should be allowed to enter the product

The product should decide:

- what detailed product role the user has
- what actions that role can perform inside the product

Recommended long-term split:

- Canopy owns invitation and membership
- Canopy owns product enablement
- products own product-specific role behavior

## Single Sign-On Direction

Long-term goal:

- one Canopy login across products

Recommended behavior:

- user authenticates through the Canopy portal
- products trust the platform identity or shared auth layer
- products receive active workspace context from the platform

This can be implemented incrementally.

Near term, the key is to preserve a model that can support SSO later even if some products begin with separate auth plumbing.

## PhotoVault Transition Note

PhotoVault already has working organization and invite behavior.

For MVP, the platform should not break that prematurely.

Recommended transition direction:

- treat Canopy as the future source of truth for invites and memberships
- keep PhotoVault-compatible membership handling during the transition
- move toward a model where Canopy membership can provision or synchronize the product-side access that PhotoVault needs

## Active Workspace Resolution

The platform should always know the current active workspace.

Recommended behavior:

- users with one workspace enter it automatically
- users with multiple workspaces choose from a workspace switcher
- workspace selection persists across product launches where possible

Products should not have to guess the active account from inconsistent local state.

## MVP Workspace Resolution Rules

For MVP, workspace resolution should follow these rules:

1. after sign-in, Canopy resolves all active memberships for the user
2. if the user has one active workspace, Canopy routes directly to that dashboard
3. if the user has more than one active workspace, Canopy resolves a default workspace when possible
4. only if a default workspace cannot be resolved cleanly should the user be asked to choose

Recommended default resolution order:

1. last-used active workspace
2. explicitly assigned default workspace if one exists later
3. first active workspace by stable fallback order

Recommended user-experience rule:

- workspace resolution is a platform responsibility, not a main visible task for most users

Recommended shell rule:

- show the active organization/workspace passively in the header
- expose a switcher only when the user truly has more than one active workspace

## Why This Matters

This model protects two things at once:

- users get the familiar "sign in -> dashboard" experience
- the platform still carries the active organization/workspace explicitly for product launch and authorization

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
