# Canopy And PhotoVault Integration

Date: 2026-03-27

## Current Relationship

PhotoVault is the first real connected product behind Canopy.

Current setup:

- Canopy is the platform front door
- PhotoVault remains the mature product implementation
- both apps share one Supabase project
- both apps are deployed separately

## Launch Flow Today

1. user signs into Canopy
2. Canopy resolves the active workspace
3. Canopy checks `photovault` entitlement
4. Canopy launches PhotoVault with explicit `workspace` context
5. PhotoVault applies that workspace context instead of defaulting silently to another org

## Important Current Limitation

Login is not yet seamless across domains.

That means:

- a user can be signed into Canopy
- then still be prompted to sign into PhotoVault on the PhotoVault domain
- once signed in, the workspace context is preserved correctly

## Boundary Rule

Canopy owns:

- entry point
- workspace context
- entitlements
- provisioning
- invitations

PhotoVault owns:

- albums
- assets
- brand portal workflows
- product-specific roles and permissions

## Transition Rule

PhotoVault compatibility behavior is still allowed where needed, but it should no longer become the permanent home of platform-owned workflows.
