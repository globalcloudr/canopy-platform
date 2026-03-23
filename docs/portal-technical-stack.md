# Canopy Portal Technical Stack Recommendation

Date: 2026-03-23

## Purpose

Recommend a practical technical stack for the first Canopy portal implementation at `usecanopy.school`.

This recommendation is optimized for:

- speed to first working portal
- compatibility with the existing PhotoVault direction
- low architectural regret
- a clean path to shared auth and workspace context

## Recommendation

Build the first Canopy portal as a `Next.js` application.

Recommended baseline:

- `Next.js`
- `React`
- `TypeScript`
- `Node 20`

This is the strongest near-term choice because:

- it aligns well with the existing PhotoVault stack
- it supports a fast portal/dashboard build
- it keeps the frontend and server boundary simple early on
- it gives you flexibility for server-rendered auth and account surfaces

## Data and Backend Direction

Near-term recommendation:

- use a simple application backend that supports:
  - auth
  - workspace resolution
  - memberships
  - product entitlements

Because PhotoVault already uses Supabase, a reasonable early path is:

- shared Supabase-backed auth and database for the portal's foundational objects

This should be treated as a practical starting point, not a forever constraint.

The important thing is not the exact tool. The important thing is:

- one clear source of truth for platform identity and workspace access

## Why Not Overbuild the Portal Stack

The portal MVP does not need:

- a microservice fleet
- a complex event bus on day one
- a custom auth platform from scratch
- a heavy multi-repo shared package system before real duplication exists

It needs:

- clean auth
- clean workspace resolution
- clean entitlement-aware UI
- a reliable launch path into products

## UI Direction

The portal should use a shared Canopy UI language, but the first implementation can stay lean.

Recommended approach:

- establish a small shared UI baseline inside the portal app first
- extract shared packages only after duplication appears

Do not create a large shared design-system package prematurely.

## Initial Portal Responsibilities

The portal app should own:

- sign-in
- workspace selection
- product launcher
- account overview
- simple settings and service visibility

It should not own:

- PhotoVault workflows
- social publishing workflows
- website editing workflows
- newsletter creation workflows

Those belong to the products themselves.

## Recommended Near-Term Stack Summary

Application:

- `Next.js`
- `React`
- `TypeScript`

Runtime:

- `Node 20`

Initial backend/data direction:

- practical shared auth and database layer, likely Supabase-compatible in the near term

Styling:

- keep it simple and consistent with the future Canopy brand system

Deployment:

- choose the simplest reliable deployment path for a web app and auth-aware portal

## Summary

The best first portal stack is one that gets `usecanopy.school` live quickly and cleanly.

The recommendation is:

- use `Next.js + React + TypeScript`
- keep the backend model simple
- focus on auth, workspace context, and product launch
- avoid premature platform complexity

