# Portal App Structure Recommendation

Date: 2026-03-23

## Purpose

Define a clean starting folder structure for the future portal app without overengineering it before implementation begins.

## Recommended Starting Structure

```text
apps/portal/
  README.md
  ARCHITECTURE.md
  package.json
  tsconfig.json
  next.config.ts
  src/
    app/
    components/
    lib/
    server/
    styles/
```

## Folder Roles

### `src/app/`

Purpose:

- Next.js app routes
- layouts
- route-level pages

Likely early routes:

- sign-in
- workspace home
- account/settings

### `src/components/`

Purpose:

- portal UI components
- dashboard sections
- layout pieces
- product launcher components

### `src/lib/`

Purpose:

- client-safe helpers
- shared utilities
- configuration helpers

Examples:

- formatting helpers
- portal navigation config
- product metadata definitions

### `src/server/`

Purpose:

- server-only logic
- auth/session helpers
- workspace resolution
- entitlement lookup

This helps keep the platform control logic out of page components.

### `src/styles/`

Purpose:

- global styles
- theme variables
- future portal-specific tokens

## Recommended Early Internal Modules

As the portal grows, these are likely useful internal boundaries:

- `server/auth`
- `server/workspaces`
- `server/entitlements`
- `components/layout`
- `components/products`
- `components/account`

Do not create all of these immediately unless implementation actually needs them.

## Recommended Build Sequence

1. create the app shell
2. add sign-in
3. add workspace resolution
4. add entitlement-aware dashboard
5. add PhotoVault launch flow

## Summary

The portal app should start with a simple structure:

- route layer
- UI components
- small utility layer
- clear server-only platform logic

That is enough to build the first version cleanly without pretending the app is larger than it is yet.
