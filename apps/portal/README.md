# Canopy Portal App

Workspace portal app for the Canopy product suite.

- `usecanopy.school`

## Purpose

The portal is the control plane for Canopy.

It is responsible for:

- authentication entry
- workspace resolution and school context
- product launcher and product access visibility
- one-time product launch exchange
- account and service overview
- shared platform navigation
- owner/admin invitation and role management
- operator provisioning for products and services

It is not responsible for reimplementing each product's internal workflows.

## Current Direction

The live portal currently focuses on:

- sign-in
- workspace resolution
- one-time launch exchange into PhotoVault, Stories, and Reach
- entitlement-aware dashboard
- product launch across PhotoVault, Stories, and Reach
- school context for normal workspace users
- true workspace switching only for platform operators

See:

- [Canopy Platform README](/Users/zylstra/Code/canopy-platform/README.md)
- [Platform PRD](/Users/zylstra/Code/canopy-platform/docs/PRD.md)
- [Platform Progress](/Users/zylstra/Code/canopy-platform/docs/progress.md)
