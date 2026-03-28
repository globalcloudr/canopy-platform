# Canopy Provisioning

Date: 2026-03-27

## What Provisioning Does Today

The operator provisioning page at `/app/provisioning` is the current Canopy-owned admin surface for:

- selecting or creating a workspace
- entering the primary school-admin email
- choosing an initial role
- enabling products
- enabling services
- recording notes
- reviewing current invitation state

## Current Provisioning Outcomes

When provisioning runs, Canopy can:

- create a new `organization` when needed
- reuse an existing organization
- create or reuse membership for an existing auth user
- create or update `product_entitlements`
- create or update `workspace_service_states`
- create invitation records for unknown emails
- send or resend invitations

## Result States You May See

### Existing member

Meaning:

- the email already belongs to a user in the shared auth system
- that user already had membership in the selected workspace

### Membership prepared

Meaning:

- the email already belongs to a user in the shared auth system
- Canopy created membership for that workspace

### Invitation sent

Meaning:

- the email did not already exist as a workspace member
- Canopy created or reused a pending invitation record
- Canopy attempted delivery through Supabase auth invite infrastructure

### Needs resend

Meaning:

- a pending invitation exists but there is no sent-tracking for it yet
- operator should use the resend action

## Current Limitations

- provisioning still uses `organizations` and `memberships` as the active bridge instead of a dedicated `workspaces` table
- service configuration is still lightweight visibility/state, not deep operational workflow modeling
