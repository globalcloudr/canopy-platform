# Canopy Product Entitlements

Date: 2026-03-23

## Purpose

Define how Canopy determines which products, services, and features a workspace can access.

Product entitlements are the bridge between:

- the commercial model
- the workspace/account model
- the product-launch experience

Without a clear entitlement model, the portal becomes confusing and products drift into inconsistent access logic.

## Core Principle

Entitlements should be resolved at the `Workspace` level first, not the individual user level.

Reason:

- schools buy or are provisioned into products as accounts
- users inherit access through workspace membership
- product access should be predictable across the workspace

User-level restrictions can still exist inside products, but the primary question is:

- is this workspace entitled to this product or service

## What an Entitlement Controls

An entitlement can control:

- whether a product is enabled
- whether a product is visible in the portal
- whether a product is in trial, pilot, active, paused, or retired state
- which service tier applies
- whether specific feature bundles are enabled

## Recommended Entitlement Layers

### 1. Product Entitlement

Determines whether the workspace can access a product.

Examples:

- PhotoVault enabled
- Reach Canopy enabled
- Canopy Web not enabled

### 2. Plan / Tier Entitlement

Determines the service or feature level within a product.

Examples:

- standard PhotoVault
- advanced PhotoVault
- Reach Canopy pilot tier

### 3. Feature Flag / Capability Entitlement

Determines whether specific capabilities are enabled.

Examples:

- success story automation
- multiple social channels
- advanced analytics export

These should be used sparingly and intentionally.

## Recommended Core Fields

Each product entitlement should include:

- `workspace_id`
- `product_key`
- `status`
  - trial
  - active
  - paused
  - retired
  - pilot
- `plan_key`
- `starts_at`
- `ends_at`
- `source`
  - sales
  - manual provisioning
  - migration
  - internal grant
- `notes`

Optional later fields:

- billing linkage
- contract linkage
- seat/capacity metadata
- feature bundle references

## Product Keys

Recommended initial product keys:

- `photovault`
- `canopy_web`
- `create_canopy`
- `publish_canopy`
- `community_canopy`
- `reach_canopy`
- `assist_canopy`
- `insights_canopy`

Keep product keys stable and implementation-agnostic.

## Portal Behavior

The platform portal should use product entitlements to decide:

- which products appear in the launcher
- which products are marked active, pilot, or coming soon
- where users are allowed to navigate
- whether product onboarding or setup should appear

Recommended portal states:

- `Enabled`
- `In Setup`
- `Pilot`
- `Trial`
- `Paused`
- `Not Enabled`

These are presentation states derived from the entitlement model and setup state.

## Product Behavior

Products should trust the platform on the question:

- is this workspace allowed to access this product

Products should still control:

- user-specific permissions inside the product
- feature behavior that depends on product-local roles or settings

This keeps the platform responsible for product availability and the product responsible for workflow behavior.

## Relationship to Billing

Entitlements should be closely related to billing, but not identical to billing.

Reason:

- some access may be manually granted
- pilots may exist without standard billing
- implementation and service phases may create temporary states

Recommended model:

- billing informs entitlement state
- entitlement state controls actual access

That separation gives operational flexibility.

## Relationship to Sales and Services

Canopy may deliver a mix of:

- software products
- managed services
- setup or implementation work
- plugin-backed customer solutions

The entitlement model should allow for that reality.

Examples:

- a workspace has Canopy Web implementation in progress
- a workspace has Community Canopy service enabled but plugin setup pending
- a workspace has Reach Canopy pilot access before standard packaging exists

This is why entitlement state should support operational nuance.

## Initial Recommendation

Start with a small model:

- one row per workspace/product combination
- clear status
- simple plan key
- optional notes

Do not start with a highly abstract pricing engine.

The goal is:

- product visibility
- access control
- supportable provisioning

## Example Scenarios

### Example 1: PhotoVault Only

Workspace:

- `Acme Adult School`

Entitlements:

- `photovault` = active
- all others = not enabled

Portal result:

- PhotoVault shows as available
- other products show only if you want upsell visibility

### Example 2: PhotoVault + Reach Pilot

Workspace:

- `Bay Learning Center`

Entitlements:

- `photovault` = active
- `reach_canopy` = pilot

Portal result:

- PhotoVault available
- Reach Canopy available with pilot messaging

### Example 3: Community Canopy Setup in Progress

Workspace:

- `North Valley School`

Entitlements:

- `community_canopy` = active
- setup state = incomplete

Portal result:

- Community Canopy visible
- product card shows setup steps rather than full launch readiness

## Recommended Near-Term Decisions

1. finalize product keys
2. finalize entitlement status values
3. decide whether upsell visibility appears for non-enabled products
4. define how setup/onboarding state relates to entitlement state
5. define the first manual provisioning workflow

## Summary

The Canopy entitlement model should be:

- workspace-first
- product-based
- operationally flexible
- simple enough to support manually at first

That gives the portal a reliable way to decide what each school can access and what it should see next.
