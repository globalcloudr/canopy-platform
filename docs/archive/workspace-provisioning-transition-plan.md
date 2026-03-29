# Canopy Workspace Provisioning Transition Plan

Date: 2026-03-27

## Implementation Status

Implemented now:

- Canopy workspace provisioning page at `/app/provisioning`
- create/select workspace flow
- product entitlement provisioning
- service visibility provisioning
- invitation record creation
- invitation delivery through Supabase auth invite flow
- invitation resend flow
- invitation acceptance completion into real membership
- invitation status visibility in the provisioning UI

Still incomplete or transitional:

- invite delivery still depends on shared Supabase auth email infrastructure
- PhotoVault remains a compatibility fallback for any operator workflows not yet fully moved into Canopy
- broader staff invitation and richer admin tooling are still later expansions

## Purpose

Define how workspace provisioning moves from today's PhotoVault-heavy operational flow into a Canopy-owned platform workflow.

This plan treats invitation as only one part of provisioning.

Provisioning also includes:

- selecting or creating the workspace
- assigning the initial admin
- setting workspace role
- enabling products and services
- setting initial access/setup state

## Current Platform State

Today:

- PhotoVault already has a practical super-admin invite flow
- Canopy now has real auth, workspace resolution, entitlement visibility, and product launch behavior
- `product_entitlements` already exists in the shared Supabase project
- Canopy now has a working first super-admin provisioning workflow, but the overall migration away from PhotoVault is still transitional

That means:

- PhotoVault is the temporary operational path
- Canopy is the correct long-term owner

## Ownership Decision

Long-term ownership:

- Canopy owns workspace provisioning
- Canopy owns school-admin invitation
- Canopy owns workspace membership setup
- Canopy owns product and service enablement at the workspace level

PhotoVault role after transition:

- consume valid workspace membership and entitlement state
- map members into PhotoVault product behavior
- stop acting as the primary provisioning surface

This belongs in platform core because provisioning determines:

- which workspace exists
- who administers it
- which products/services are enabled
- how the customer first enters the platform

## What Stays In PhotoVault For Now

Keep the current PhotoVault operational flow for now if it is needed for:

- super-admin continuity
- real customer onboarding before Canopy admin UX exists
- testing and support during the transition

Rule:

- treat PhotoVault provisioning as a compatibility bridge, not the long-term platform model

## What Moves To Canopy Later

The future Canopy-owned provisioning flow should cover:

- super admin creates or selects a workspace
- super admin invites the initial school admin
- Canopy creates or prepares workspace membership
- Canopy enables the correct products and services
- Canopy records product/service status and setup state
- the invited admin signs in through Canopy
- the dashboard shows only the provisioned products/services

Optional later extension:

- workspace admins invite additional staff from Canopy
- workspace admins request or activate additional products/services through Canopy-managed flows

## Recommended Transition Sequence

### Stage 1: Keep PhotoVault As Compatibility Path

Use today:

- PhotoVault invite/provisioning behavior remains operational
- Canopy remains the portal/front door

Goal:

- do not block launch or customer onboarding while platform admin UX is still maturing

### Stage 2: Lock The Provisioning Data Contract In Canopy

Before building Canopy admin UI, lock the platform data contract for:

- invited user identity
- target workspace
- target workspace role
- product entitlements
- service enablement state
- setup status
- invitation state
- acceptance state

Goal:

- Canopy should own the provisioning model before it owns the whole workflow

Service persistence rule:

- products and services must not share one ambiguous persistence model
- product access belongs in `product_entitlements`
- service visibility/status belongs in a separate Canopy-owned service-state model

### Stage 3: Build Minimal Canopy Super-Admin Provisioning UI

Add a small Canopy admin surface for:

- selecting or creating a workspace
- inviting the school admin
- choosing initial workspace role
- enabling products/services
- reviewing invitation and provisioning status

Keep the first scope small:

- one workspace at a time
- one initial admin at a time
- a simple set of product/service toggles
- no bulk import
- no heavy automation

### Stage 4: Provision Shared Membership And Entitlements First

When Canopy provisions a workspace, it should create or prepare:

- shared workspace membership state
- product entitlements
- service visibility state

PhotoVault should then rely on that shared state instead of requiring its own parallel provisioning loop.

### Stage 5: Retire PhotoVault As Primary Provisioning Surface

Only when Canopy fully covers the real operational use case:

- move super-admin onboarding workflow and documentation to Canopy
- reduce or remove primary provisioning initiation from PhotoVault
- keep only product-local access mapping where necessary

## Source-Of-Truth Rules

Canopy should own:

- workspace provisioning initiation
- invitation initiation and status
- workspace membership creation
- workspace role assignment
- product entitlement state
- service visibility and setup state

PhotoVault should own:

- product-role mapping
- product-specific access behavior after membership and entitlement are valid

Canopy should not own:

- PhotoVault album/media workflows
- product-specific permissions beyond launch/access eligibility

PhotoVault should not own long-term:

- primary workspace provisioning
- primary school-admin invitation
- primary cross-product onboarding

## MVP Scope For The Future Canopy Provisioning Flow

The smallest safe Canopy version of this feature is:

- super admin picks or creates a workspace
- enters school-admin email
- selects initial workspace role
- enables products/services for that workspace
- records setup state
- sends invitation
- accepted invitation results in valid workspace membership and visible product access

That is enough to shift ownership without overbuilding.

## MVP Provisioning Page Fields

The first Canopy super-admin provisioning page should stay intentionally small.

Recommended MVP fields:

- workspace selector
  - choose an existing workspace or create a new one
- workspace name
  - required when creating a new workspace
- workspace slug
  - required when creating a new workspace
- primary school-admin email
  - required
- initial workspace role
  - default: `owner`
- enabled products
  - first required product toggle: `PhotoVault`
- enabled services
  - optional simple toggles for service visibility
- per-product setup state
  - example: `ready`, `setup`, `pilot`
- provisioning notes
  - optional internal-only field for operator context

Recommended hidden/system-managed fields:

- invitation status
- acceptance timestamp
- membership status
- entitlement status
- created_by
- updated_by
- created_at
- updated_at

Recommended service persistence model:

- `workspace_service_states`

Recommended minimum fields:

- `organization_id`
- `service_key`
- `status`
- `setup_state`
- `source`
- `notes`

## MVP Submission Outcome

Submitting the first Canopy provisioning form should produce these results:

1. workspace exists
2. school-admin invitation is recorded and, when possible, sent
3. workspace membership is created or prepared when the admin already exists
4. selected product entitlements are created
5. selected services are marked visible or active according to the chosen status
6. the invited admin can accept through Canopy and see the provisioned workspace

## MVP UI Rules

Keep the first page simple:

- one workspace at a time
- one admin invite at a time
- checkboxes or toggles for products/services
- no billing logic in the first version
- no bulk provisioning
- no product-specific workflow configuration on this page

The purpose of the first page is operational consistency, not full account automation.

## MVP Page Spec

Recommended page title:

- `Workspace Provisioning`

Recommended page purpose text:

- `Create or update a client workspace, assign the initial school admin, and enable the products or services they should see in Canopy.`

Recommended page sections:

### Section 1: Workspace

Fields:

- workspace mode
  - `Select existing`
  - `Create new`
- workspace selector
  - shown when `Select existing`
- workspace name
  - shown when `Create new`
- workspace slug
  - shown when `Create new`

### Section 2: Primary Admin

Fields:

- school-admin email
- initial workspace role

Recommended default:

- `owner`

### Section 3: Products

Fields:

- `PhotoVault` toggle
- future product toggles as they become real

Per-product controls:

- setup state
  - `ready`
  - `setup`
  - `pilot`

Recommended first-version rule:

- `PhotoVault` should be the only real enabled product option at first

### Section 4: Services

Fields:

- service toggles
- optional service status if needed

Recommended first-version rule:

- keep service controls simple and visibility-oriented
- do not add deep service workflow settings here

### Section 5: Internal Notes

Fields:

- provisioning notes textarea

Purpose:

- internal operator context only

### Section 6: Review

Summary block should show:

- workspace
- invited admin
- selected role
- enabled products
- enabled services
- setup states

Primary action:

- `Provision workspace`

Secondary action:

- `Save draft` only if draft support becomes necessary later

Recommended first-version rule:

- skip draft support unless operations truly need it

## MVP Interaction Rules

Recommended validation:

- workspace name required when creating a workspace
- workspace slug required when creating a workspace
- email required and normalized
- at least one product or service should be selected if this page is used for provisioning

Recommended UX behavior:

- if workspace already exists, prefill current entitlement/service state
- if the admin already belongs to the workspace, do not create duplicate membership rows
- show a clear success state with:
  - workspace name
  - invitation status
  - enabled products/services

## MVP Database Writes

The first Canopy provisioning form should write only the minimum shared platform records.

### 1. Workspace Record

If creating a new workspace:

- insert into the current workspace bridge table
- near-term implementation bias: existing `organizations`

Fields:

- `name`
- `slug`

If selecting an existing workspace:

- do not create a new workspace row

### 2. Invitation Record

Recommended near-term implementation:

- create a Canopy-managed invitation record in `workspace_admin_invitations`

Minimum data to persist:

- invited email
- workspace id
- target role
- invitation status
- invited by
- timestamps

### 3. Membership Record

When possible:

- create or prepare the workspace membership row tied to the invited user

Near-term compatibility case:

- if membership cannot be finalized until acceptance, create it on acceptance
- but the Canopy workflow should still remain the system that initiated it

Minimum fields:

- `user_id` when known
- `org_id` or compatible workspace id
- `role`
- `status`

### 4. Product Entitlement Rows

For each enabled product:

- upsert into `product_entitlements`

Minimum fields:

- `organization_id`
- `product_key`
- `status`
- `setup_state`
- `plan_key`
- `source`

Recommended initial values:

- `status = 'active'`
- `source = 'canopy_provisioning'`

### 5. Service Visibility State

Services should use their own Canopy-managed persistence layer:

- `workspace_service_states`

Minimum fields:

- `organization_id`
- `service_key`
- `status`
- `setup_state`
- `source`
- `notes`

Important rule:

- do not overload `product_entitlements` with service-specific meaning if products and services are distinct concepts in the portal

Recommended first-version service keys:

- `school-website-setup`
- `creative-retainer`

### 6. Audit Metadata

Record:

- who provisioned the workspace
- what changed
- when it happened

This can begin as lightweight operator notes plus timestamps if a fuller audit layer is not ready yet.

## Recommended Server Action / API Shape

The first implementation can be one Canopy server action or route handler:

- `provisionWorkspace`

Suggested responsibilities:

1. validate input
2. create or resolve workspace
3. create invitation state
4. create or prepare membership state
5. upsert product entitlements
6. persist service visibility state if applicable
7. return a provisioning summary

Recommended rule:

- keep this orchestration in Canopy
- do not delegate the primary provisioning workflow back into PhotoVault

## What Not To Do

- do not build both Canopy and PhotoVault as equal permanent provisioning owners
- do not separate school-admin invitation from product/service enablement in a way that creates operational drift
- do not remove PhotoVault's current operational path before Canopy can replace it
- do not push product-specific onboarding rules into platform core unless they apply across products
- do not tie the first Canopy provisioning flow to a large billing or automation rewrite

## Implementation Bias

Near-term bias:

- keep onboarding working
- keep changes minimal
- move ownership deliberately

Long-term bias:

- Canopy becomes the single workspace provisioning entry point
- PhotoVault becomes a launched product that trusts shared platform membership and entitlement state

## Suggested Next Build Step

After the auth/session handoff work, the next admin-focused platform feature should be:

- a minimal Canopy super-admin workspace provisioning page

That page should start by matching the practical outcome of today's PhotoVault operational flow, with product/service enablement included from the beginning.
