# Canopy Portal Launcher Contract

Date: 2026-03-23

## Purpose

Define the first implementation-level contract for the Canopy product launcher.

This document translates the platform vision into a practical launcher model that can drive:

- the portal home/dashboard
- the products view
- product card rendering
- launch behavior
- entitlement-aware user guidance

The launcher is one of the most important platform objects because it is where Canopy becomes visibly connected.

## Core Principle

The launcher should answer four questions for the active workspace:

1. what products exist
2. which products are available here
3. what state each product is in
4. what the user can do next

This should be driven by:

- workspace context
- product entitlements
- setup state
- stable product metadata

## Launcher Responsibilities

The portal launcher should:

- list products for the active workspace
- show product state in human-readable language
- determine whether a product can be launched
- route the user to the right next action
- provide enough context to avoid confusing dead ends

The launcher should not:

- own product-specific workflow logic
- make detailed product-role decisions
- duplicate product-side permission systems

## Launcher Inputs

The launcher should be built from two kinds of input:

### 1. Static Product Metadata

This is platform-owned configuration describing each product.

Examples:

- visible product name
- short descriptor
- icon or visual token
- category
- default launch target
- whether the product should be shown when not entitled

### 2. Workspace-Specific Product State

This is dynamic data derived from the active workspace.

Examples:

- entitlement status
- setup state
- plan key
- whether launch is allowed
- whether the product should show setup guidance instead of launch

## Recommended Product Metadata Model

The portal should maintain a small platform-side product registry.

Recommended fields:

- `product_key`
- `display_name`
- `short_description`
- `category`
- `icon_key`
- `default_launch_path`
- `launch_mode`
- `show_when_not_enabled`
- `sort_order`

Recommended example values:

- `product_key`
  - `photovault`
  - `canopy_web`
  - `community_canopy`
- `launch_mode`
  - `direct`
  - `setup`
  - `info_only`

Notes:

- this registry is not the entitlement record
- it is the platform's canonical product catalog

## Recommended Launcher State Model

For each product card, the portal should derive a user-facing launcher state.

Recommended user-facing states:

- `Enabled`
- `In Setup`
- `Pilot`
- `Trial`
- `Paused`
- `Not Enabled`

These should be derived from:

- entitlement `status`
- entitlement `setup_state`
- product metadata

## Recommended State Rules

### `Enabled`

Conditions:

- entitlement status is `active`
- setup state is `ready`

Card behavior:

- show launch button
- allow direct product entry

### `In Setup`

Conditions:

- entitlement exists
- setup state is `not_started`, `in_setup`, or `blocked`

Card behavior:

- do not present as fully launch-ready
- show setup or next-step action instead

### `Pilot`

Conditions:

- entitlement status is `pilot`
- setup state may be `ready` or still in setup

Card behavior:

- show pilot label
- allow launch only if operationally ready

### `Trial`

Conditions:

- entitlement status is `trial`

Card behavior:

- show launch if ready
- show trial context

### `Paused`

Conditions:

- entitlement status is `paused`

Card behavior:

- do not allow normal launch
- show account/service context instead

### `Not Enabled`

Conditions:

- no active entitlement for the workspace

Card behavior:

- either hide the product or show a non-launch state, depending on platform policy

## Recommended Card Contract

Each launcher card should be able to render from a stable object shape.

Recommended fields:

- `product_key`
- `display_name`
- `short_description`
- `category`
- `state`
- `state_label`
- `can_launch`
- `primary_action_label`
- `primary_action_target`
- `secondary_action_label`
- `secondary_action_target`
- `workspace_slug`
- `plan_key`

This is not necessarily the database shape.

It is the shape the portal UI should receive after platform-side resolution.

## Recommended Action Rules

The launcher should always show the best next action for the user.

### If `can_launch = true`

Primary action:

- `Launch Product`

### If product is `In Setup`

Primary action:

- `Continue Setup`
or
- `View Setup`

### If product is `Paused`

Primary action:

- `View Account`
or
- `Contact Support`

### If product is `Not Enabled` and visible

Primary action:

- `Learn More`
or
- `Request Access`

This prevents cards from becoming visually present but operationally useless.

## Recommended Launch Target Model

When a product can launch, the launcher should resolve:

- product destination
- active workspace context
- any required launch-state metadata

Recommended resolved launch object:

- `product_key`
- `launch_url`
- `workspace_slug`
- `requires_auth`
- `requires_entitlement_check`

For PhotoVault, the launch target should preserve:

- active workspace context
- the expectation that product-side verification still occurs

## Recommended First Product Contract: PhotoVault

The first real product contract should be for `photovault`.

Recommended metadata:

- `product_key`: `photovault`
- `display_name`: `PhotoVault by Canopy`
- `category`: `Asset Foundation`
- `launch_mode`: `direct`

Recommended launcher behavior:

- if entitled and ready:
  - show `Launch Product`
- if entitled but setup incomplete:
  - show `Continue Setup`
- if not entitled:
  - hide or show controlled visibility depending on portal policy

## Recommended Display Policy for Non-Enabled Products

Near-term recommendation:

- on the main workspace home, prioritize enabled products first
- for MVP, keep non-enabled products minimal or hidden unless there is a clear sales or service reason to show them

Reason:

- too much “coming soon” or upsell noise will weaken the portal experience

A quieter launcher will feel more credible and useful.

## Recommended UI Rendering Order

Within the active workspace, order products roughly as:

1. enabled and ready
2. entitled but in setup
3. pilot/trial products
4. optional non-enabled products, if shown at all

This puts the user's next action first.

## Failure and Edge States

The launcher should handle:

- missing entitlement data
- stale workspace selection
- product marked launchable but setup incomplete
- launch target unavailable

In those cases, the launcher should prefer:

- a clear explanatory state
- a non-destructive fallback action

It should not encourage a redirect that immediately fails.

## Recommended MVP Implementation Order

1. define the product metadata registry inside the portal
2. define the derived launcher-card object shape
3. wire launcher state from entitlement and setup data
4. implement `photovault` as the first real launchable product
5. add secondary products only after the first product flow is stable

## Relationship to Navigation

The launcher should appear in:

- workspace home/dashboard
- products page
- optionally a global quick-launch entry later

The launcher is not a one-off page feature.

It is a core platform interaction surface.

## Summary

The Canopy launcher contract should combine:

- a stable product metadata registry
- workspace-specific entitlement and setup state
- a consistent card/action shape

That is what will make the portal feel like a real shared control plane rather than a static list of product ideas.
