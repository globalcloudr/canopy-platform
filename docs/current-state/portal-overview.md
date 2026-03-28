# Canopy Portal Overview

Date: 2026-03-27

## What Is Live Today

Canopy is a real Next.js portal in `apps/portal` with:

- Supabase-backed sign-in
- cookie-backed portal sessions
- workspace resolution
- entitlement-aware dashboard behavior
- operator-only provisioning tools
- invitation send, resend, and acceptance handling
- workspace-aware launch into PhotoVault

Current live portal URL:

- `https://canopy-platform-portal.vercel.app`

Intended production direction:

- `https://usecanopy.school`

## Portal Responsibilities

Canopy currently owns:

- sign-in entry
- workspace selection and resolution
- product entitlement visibility
- service visibility
- operator provisioning
- workspace-admin invitations
- product launch decisions

Canopy does not own:

- PhotoVault media workflows
- PhotoVault albums, assets, and share links
- PhotoVault product-specific permissions and UI

## Main Portal Routes

- `/`
  - public homepage
- `/sign-in`
  - real portal sign-in
  - also receives invite acceptance continuation
- `/app`
  - main dashboard
- `/app/account`
  - account and workspace details
- `/app/provisioning`
  - operator-only workspace provisioning
- `/app/products/[slug]`
  - product placeholder pages
- `/app/services/[slug]`
  - service placeholder pages
- `/api/portal-session`
  - portal session payload
- `/api/provision-workspace`
  - provisioning backend
- `/api/resend-workspace-invitation`
  - resend backend
- `/auth/sign-in`
  - sign-in route
- `/auth/sign-out`
  - sign-out route
- `/auth/accept-invite`
  - invite completion route

## Platform Operator Behavior

Platform operators no longer default into the first client workspace.

Current rule:

- if an operator has no explicit `?workspace=` selection, they land in a neutral platform overview state
- if `?workspace=<slug>` is present, the portal resolves that workspace as active context

This avoids making one client organization appear special just because it sorts first.
