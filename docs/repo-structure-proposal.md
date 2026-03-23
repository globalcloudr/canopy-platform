# Canopy Platform Repo Structure Proposal

Date: 2026-03-23

## Goal

Create a repo shape that supports:

- a platform core
- multiple future apps and services
- plugins and integration work
- shared packages over time

without forcing premature complexity on day one.

## Starting Point

This repository currently contains:

- platform planning docs
- newsletter-related plugin work in `sendgrid-newsletter-pro/`

That is okay.

The right move is not to reorganize everything immediately. The right move is to establish the target structure now and let the implementation grow into it.

## Recommended Top-Level Structure

```text
canopy-platform/
  README.md
  docs/
  apps/
  packages/
  services/
  plugins/
  infra/
  scripts/
```

## Directory Roles

### `docs/`

Purpose:

- platform architecture
- product boundary docs
- object model docs
- roadmap and planning notes

Recommended early files:

- `canopy-technical-platform-architecture-brief.md`
- `repo-structure-proposal.md`
- `workspace-identity-model.md`
- `product-entitlements.md`
- `integration-strategy.md`

### `apps/`

Purpose:

- user-facing applications and portals

Recommended early contents:

- `portal/`
  - the Canopy control plane at `usecanopy.school`

Potential later contents:

- `insights/`
- `assist/`

Use this folder only when those become real platform applications.

### `packages/`

Purpose:

- reusable shared code

Likely future packages:

- `auth`
- `ui`
- `config`
- `analytics`
- `types`
- `workspace-sdk`

Do not create all of these immediately. Add them only when duplication appears.

### `services/`

Purpose:

- platform-level backend services and workers

Potential services:

- notifications
- event-ingestion
- audit-pipeline
- identity-sync
- asset-reference-service

This folder becomes useful once the platform starts owning background workflows.

### `plugins/`

Purpose:

- WordPress plugins and channel-specific extensions

Recommended near-term move:

- relocate `sendgrid-newsletter-pro/` here once you want a cleaner structure

Target:

```text
plugins/
  sendgrid-newsletter-pro/
```

### `infra/`

Purpose:

- deployment, environment, and infrastructure config

Possible future contents:

- Terraform
- Docker setup
- environment templates
- deployment notes

### `scripts/`

Purpose:

- local utilities
- migration helpers
- setup scripts
- operational tooling

## Recommended First App

When you are ready to begin implementation here, the first app should be:

- `apps/portal`

That app should own:

- login entry
- workspace switcher
- product launcher
- product entitlement visibility
- account and billing visibility
- notifications shell

It should not try to reimplement every product workflow.

## Recommended Near-Term Files to Add Next

The most useful next docs in this repo would be:

1. `docs/workspace-identity-model.md`
2. `docs/product-entitlements.md`
3. `docs/integration-strategy.md`
4. `docs/platform-navigation-model.md`

## Migration Guidance

You do not need to move everything at once.

Recommended sequence:

1. keep existing plugin work where it is for now
2. use `docs/` as the canonical planning location
3. create `apps/portal` when platform implementation begins
4. create `plugins/` when you want to normalize plugin storage
5. add shared packages only after real duplication exists

## Summary

This repo should grow into the Canopy platform home:

- docs first
- portal app next
- shared packages and services as needed
- plugins grouped cleanly once the structure settles
