# Canopy Portal MVP Scope

Date: 2026-03-23

## Purpose

Define the smallest believable first version of the Canopy platform portal at `usecanopy.school`.

The goal is not to build the entire platform at once.

The goal is to create the first real control plane for:

- identity
- workspace access
- product visibility
- product launch

## MVP Goal

The first version of the portal should answer these questions cleanly:

- who is the user
- which workspace is active
- which products does this workspace have access to
- where does the user go next

If the portal can do that well, it becomes a real platform center instead of just a marketing site.

## In Scope

### Authentication Entry

- sign in
- sign out
- password reset or equivalent auth recovery flow

### Workspace Resolution

- resolve which workspace or school account the user belongs to
- support a simple workspace switcher if a user belongs to more than one workspace

### Product Launcher

- show enabled products for the active workspace
- show product status such as active, pilot, or setup in progress
- launch the user into the correct product destination

### Account Overview

- display workspace name
- display enabled products
- display a simple account or services summary

### Basic Navigation Shell

- top-level portal navigation
- account/settings entry
- product launcher/dashboard home

## Out of Scope for MVP

- full billing management
- deep reporting dashboards
- cross-product search
- complex notification center
- advanced support tooling
- full platform admin back office
- every future product integration

Those can come later once the portal core exists.

## Recommended MVP Screens

### 1. Sign-In

Primary purpose:

- authenticate the user into Canopy

### 2. Workspace Home / Dashboard

Primary purpose:

- orient the user
- show the active workspace
- show enabled products and their state

### 3. Product Launcher

Primary purpose:

- help the user enter PhotoVault or any other enabled product

This can be part of the dashboard at first rather than a separate page.

### 4. Account / Workspace Settings

Primary purpose:

- show basic workspace profile and service visibility

## Recommended First Product Integration

The first product the portal should launch is:

- `PhotoVault`

Reason:

- it already exists
- it is already live
- it gives the portal an immediate practical purpose

## MVP Data Requirements

The portal MVP needs only a small amount of data:

- `User`
- `Workspace`
- `Membership`
- `ProductEntitlement`

That is enough to support:

- sign-in
- workspace selection
- product visibility
- launch logic

## MVP Success Criteria

The portal MVP is successful if:

1. a school user can sign in
2. the system can resolve the active workspace
3. the portal clearly shows which products are enabled
4. the user can launch PhotoVault from the portal
5. the portal feels like the beginning of a real shared Canopy experience

## Recommended Build Order

1. authentication
2. workspace resolution
3. entitlement-aware dashboard
4. PhotoVault launch integration
5. lightweight settings/account surface

## Summary

The portal MVP should be small, clean, and useful.

It should prove the Canopy platform model by establishing:

- one login
- one workspace context
- one product launcher

That is enough to make `usecanopy.school` real.
