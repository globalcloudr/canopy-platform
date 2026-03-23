# Canopy Platform

Canopy is a connected school growth platform built to help schools organize, publish, communicate, and grow.

This repository is intended to become the home for the Canopy platform core:

- the central portal at `usecanopy.school`
- the shared workspace and identity model
- product entitlements and launch flows
- shared platform services
- cross-product architecture and planning docs

It is not intended to absorb every product into one codebase by default.

The platform direction is:

- one Canopy platform core
- modular product applications around it
- shared identity, workspace, permissions, and analytics

## Current Contents

- `docs/`
  - platform strategy and architecture docs
- `apps/portal/`
  - starter `Next.js` portal app skeleton for `usecanopy.school`
- `references/replit/`
  - imported product and plugin experiments kept as reference material
- `sendgrid-newsletter-pro/`
  - moved under `references/replit/` as reference material

## Recommended Long-Term Repo Shape

- `docs/`
- `apps/`
- `packages/`
- `plugins/`
- `services/`
- `infra/`

This repo can start small and grow into that structure as the platform core becomes real.

## Key Docs

- [Technical Platform Architecture Brief](/Users/zylstra/Code/canopy-platform/docs/canopy-technical-platform-architecture-brief.md)
- [Repo Structure Proposal](/Users/zylstra/Code/canopy-platform/docs/repo-structure-proposal.md)
- [Portal MVP Scope](/Users/zylstra/Code/canopy-platform/docs/portal-mvp-scope.md)
- [Portal Technical Stack Recommendation](/Users/zylstra/Code/canopy-platform/docs/portal-technical-stack.md)

## Local Development

```bash
cd /Users/zylstra/Code/canopy-platform
npm install
npm run dev
```

The root workspace scripts currently run the portal app in `apps/portal`.

## Relationship to PhotoVault

PhotoVault remains its own product repository and should continue to evolve as:

- `PhotoVault by Canopy`
- the asset foundation of the platform

The PhotoVault repo should hold product-specific docs and implementation details.

This repo should become the canonical home for platform-level architecture and the shared Canopy core.
