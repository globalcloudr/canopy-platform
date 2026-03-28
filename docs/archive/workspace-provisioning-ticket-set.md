# Canopy Workspace Provisioning Ticket Set

Date: 2026-03-27

## Current Status

Completed:

- Ticket 1: Lock the provisioning contract
- Ticket 2: Add service visibility persistence plan
- Ticket 3: Add Canopy provisioning server action/route
- Ticket 4: Build minimal workspace provisioning page
- Ticket 5: Add provisioning success summary
- Ticket 6: Add invitation and membership status view

Partially completed:

- invitation delivery, resend, and acceptance flow are now implemented even though they were not broken out as separate tickets here originally

Still open:

- Ticket 7: Limit PhotoVault to compatibility during transition
- Ticket 8: Plan PhotoVault invite flow retirement

## Purpose

Break the workspace provisioning plan into a small, safe implementation sequence for `canopy-platform`.

This ticket set is intentionally scoped to:

- keep the first Canopy admin flow minimal
- preserve PhotoVault as a temporary compatibility path
- avoid turning the portal into a dumping ground for product-specific logic

## Delivery Order

Recommended order:

1. data and contract hardening
2. server-side provisioning orchestration
3. minimal portal admin page
4. invitation/status visibility
5. operational cleanup and handoff from PhotoVault

## Ticket 1: Lock The Provisioning Contract

Goal:

- finalize the exact input and output shape for Canopy workspace provisioning

Scope:

- confirm required form fields
- confirm workspace create vs select rules
- confirm product entitlement payload shape
- confirm service visibility payload shape
- confirm invitation state shape

Deliverables:

- finalized provisioning payload contract
- finalized success summary shape
- documented validation rules

Files to edit:

- [workspace-provisioning-transition-plan.md](/Users/zylstra/Code/canopy-platform/docs/workspace-provisioning-transition-plan.md)
- [shared-supabase-strategy.md](/Users/zylstra/Code/canopy-platform/docs/shared-supabase-strategy.md)

Reason:

- reduce ambiguity before building server logic

Test steps:

- confirm the final contract answers:
  - what fields the page submits
  - what DB writes occur
  - what success payload is returned

## Ticket 2: Add Service Visibility Persistence Plan

Goal:

- define where service-level enablement lives before building service toggles

Scope:

- decide whether services need a dedicated table
- avoid overloading `product_entitlements` with service-specific meaning
- document the minimum fields for service visibility state

Deliverables:

- one documented persistence decision for services

Files to edit:

- [shared-supabase-strategy.md](/Users/zylstra/Code/canopy-platform/docs/shared-supabase-strategy.md)
- [workspace-provisioning-transition-plan.md](/Users/zylstra/Code/canopy-platform/docs/workspace-provisioning-transition-plan.md)

Reason:

- the UI should not ship with unclear backend ownership for services

Test steps:

- confirm the docs clearly answer where service visibility is stored

## Ticket 3: Add Canopy Provisioning Server Action Or Route

Goal:

- create one Canopy-owned orchestration entry point for workspace provisioning

Scope:

- validate input
- create or resolve workspace
- create or prepare invitation state
- create or prepare membership state
- upsert product entitlements
- write service visibility state if available
- return a clean provisioning summary

Recommended implementation shape:

- one route or server action named `provisionWorkspace`

Files to edit:

- likely new route or action under `/Users/zylstra/Code/canopy-platform/apps/portal/src/app/`
- likely new helper(s) under `/Users/zylstra/Code/canopy-platform/apps/portal/src/lib/`

Reason:

- keep provisioning orchestration in Canopy rather than delegating it back into PhotoVault

Test steps:

- create a new workspace through the route/action
- provision an existing workspace
- confirm entitlement rows are created or updated
- confirm duplicate membership rows are not created

## Ticket 4: Build Minimal Workspace Provisioning Page

Goal:

- add the first super-admin provisioning UI to Canopy

Scope:

- page for workspace select/create
- school-admin email field
- initial role field
- product toggles
- service toggles
- notes
- review and submit state

Recommended route:

- `/app/provisioning`

Files to edit:

- likely new route under `/Users/zylstra/Code/canopy-platform/apps/portal/src/app/(portal)/app/`
- likely new component(s) under `/Users/zylstra/Code/canopy-platform/apps/portal/src/components/`

Reason:

- give Canopy the first real admin provisioning surface without overbuilding a full admin console

Test steps:

- load the page as a permitted operator
- create a workspace with PhotoVault enabled
- confirm success feedback includes workspace and product state
- verify non-operators cannot access the page

## Ticket 5: Add Provisioning Success Summary

Goal:

- make the provisioning outcome clear to operators immediately after submit

Scope:

- show workspace name
- show invited admin email
- show invitation status
- show enabled products/services
- show setup states

Files to edit:

- provisioning page UI
- any shared summary component if needed

Reason:

- reduce support confusion after provisioning

Test steps:

- submit a provisioning action
- confirm the success summary matches the actual DB state

## Ticket 6: Add Invitation And Membership Status View

Goal:

- let operators verify provisioning state without dropping back into PhotoVault

Scope:

- show pending invitation status
- show accepted invitation state when available
- show membership status
- show product entitlement status

Files to edit:

- provisioning page or a small related status page in `apps/portal`

Reason:

- Canopy should become the operational place to verify provisioning

Test steps:

- provision a workspace
- confirm the status view reflects pending state
- complete the invitation flow
- confirm the status view updates correctly

## Ticket 7: Limit PhotoVault To Compatibility During Transition

Goal:

- stop adding new provisioning ownership into PhotoVault

Scope:

- document PhotoVault as temporary compatibility path only
- ensure new admin/provisioning work starts in Canopy

Files to edit:

- [workspace-provisioning-transition-plan.md](/Users/zylstra/Code/canopy-platform/docs/workspace-provisioning-transition-plan.md)
- relevant PhotoVault docs only if needed for clarity

Reason:

- keep long-term ownership clean

Current status:

- in progress conceptually
- new provisioning/invitation work is now happening in Canopy, but PhotoVault still exists as a compatibility fallback

Test steps:

- future provisioning changes are proposed in Canopy first
- PhotoVault provisioning changes are only maintenance unless explicitly transitional

## Ticket 8: Plan PhotoVault Invite Flow Retirement

Goal:

- define the exit criteria for removing PhotoVault as the primary provisioning surface

Scope:

- list the Canopy capabilities that must exist first
- list the smoke tests required before changing operator workflow
- update operator docs when Canopy becomes primary

Files to edit:

- [workspace-provisioning-transition-plan.md](/Users/zylstra/Code/canopy-platform/docs/workspace-provisioning-transition-plan.md)
- operator docs later as needed

Reason:

- avoid a half-migration where both apps remain permanent provisioning surfaces

Current status:

- still open
- Canopy now covers the main provisioning flow, but operator retirement criteria and final workflow cutover should be documented explicitly before PhotoVault is treated as retired

Test steps:

- verify Canopy can:
  - create/select workspace
  - invite admin
  - set membership
  - enable PhotoVault
  - show provisioning status
- only then shift primary operator guidance away from PhotoVault

## Recommended First Build Slice

If you want the smallest useful implementation sequence, start with:

1. Ticket 2
2. Ticket 3
3. Ticket 4

That gives you:

- a clear backend model
- one Canopy orchestration path
- one real super-admin provisioning page
