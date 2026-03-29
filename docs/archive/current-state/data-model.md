# Canopy Current Data Model

Date: 2026-03-27

## Shared Backend Shape

Canopy and PhotoVault currently share one Supabase project.

The current system is intentionally split into:

- compatibility tables that originated in PhotoVault
- newer platform tables now owned by Canopy

## Compatibility Layer Still In Use

These existing PhotoVault-backed tables are still part of the active Canopy runtime:

- `auth.users`
  - canonical auth identity
- `organizations`
  - current workspace bridge
- `memberships`
  - current workspace membership bridge
- `profiles`
  - compatibility source for platform-role style fields during transition

## Canopy-Owned Platform Tables

### `product_entitlements`

Purpose:

- controls which products are enabled for a workspace
- drives the launcher and product visibility

Current important fields:

- `organization_id`
- `product_key`
- `status`
- `setup_state`
- `plan_key`
- `source`

### `workspace_service_states`

Purpose:

- controls which managed services are visible for a workspace
- keeps service state separate from product entitlements

Current important fields:

- `organization_id`
- `service_key`
- `status`
- `setup_state`
- `source`

### `workspace_admin_invitations`

Purpose:

- tracks Canopy-owned workspace-admin invitation lifecycle
- supports pending, sent, resend, and accepted states

Current important fields:

- `organization_id`
- `email`
- `role`
- `status`
- `delivery_status`
- `sent_at`
- `accepted_at`
- `accepted_by_user_id`

## Ownership Rules

Canopy owns:

- product entitlements
- service visibility
- invitation records
- provisioning writes that create or update platform access state

PhotoVault owns:

- product-domain tables and workflows
- media, albums, and asset-related data

The shared database does not mean shared ownership of every table.
