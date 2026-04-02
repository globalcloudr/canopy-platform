# Canopy Workspace Provisioning Transition Plan

Date: 2026-04-02

## Goal

Move workspace provisioning to Canopy Portal as the single Super Admin workflow, and retire PhotoVault as the primary provisioning surface once Portal fully covers the real operational path.

## Why

PhotoVault was the original provisioning tool because it existed first. Now that Canopy Portal is the front door to the platform and already owns identity, invitations, entitlements, and product launch, Super Admins should provision schools from one place.

Keeping both Portal and PhotoVault as long-term provisioning owners creates operational drift and support risk. Portal should become the single source of truth for provisioning workflow, while PhotoVault remains a product that consumes valid workspace membership and entitlement state.

## Current State

Implemented already:

- Portal has a working provisioning surface at `/app/provisioning`
- Portal already owns invitation initiation, membership acceptance, entitlements, and product launch
- Portal is the primary entry point for operators and school users
- Portal now has the preferred Super Admin workflow surfaces for:
  - provisioning
  - school operations
  - platform-user management
- Portal now exposes operator-facing invite template editing, provisioning status visibility, and service-state visibility without requiring PhotoVault
- PhotoVault provisioning still exists as a compatibility path

Current limitation:

- operator workflow is functionally Portal-first in product/code, but the final production cutover checklist still needs to be validated as an operational process
- PhotoVault still acts as a fallback provisioning path
- retirement criteria and cutover checks were not previously active in the current docs

## Ownership Decision

Portal is the long-term owner of:

- workspace provisioning
- school-admin invitation
- workspace membership setup
- workspace role assignment
- product entitlement state
- service visibility and setup state
- operator-facing provisioning status

PhotoVault should only own:

- product-local role mapping
- product-specific access behavior after membership and entitlement are valid
- temporary compatibility behavior until Portal fully replaces the workflow

PhotoVault should not remain the long-term owner of:

- primary workspace provisioning
- primary school-admin invitation
- primary operator onboarding workflow

## Required Capabilities Before Retirement

Portal must reliably support all of these before PhotoVault stops being the compatibility path:

### 1. Workspace selection and creation

- select an existing workspace or create a new one
- validate workspace names and slugs
- prevent duplicate workspace creation

### 2. School-admin invitation

- invite the initial school admin
- show invitation status
- resend invite
- complete invitation acceptance successfully

### 3. Membership setup

- accepted invitation results in correct workspace membership
- role assignment is correct
- duplicate membership rows are not created

### 4. Product and service enablement

- enable the correct products for the workspace
- track service visibility and setup state separately where needed
- enabled products appear and launch correctly from Portal

### 5. Provisioning status visibility

- operators can see whether a workspace is invited, accepted, active, or incomplete
- operators do not need to drop into PhotoVault to understand provisioning state

### 6. Operational continuity

- real customer onboarding can be completed end to end from Portal
- operators are not blocked by partial, existing, or mid-acceptance user states

## Production Smoke Checks Before Cutover

Before shifting operators to Portal as the default provisioning workflow, verify all of these in production:

### 1. New workspace flow

- create a new workspace in Portal
- invite the initial school admin
- confirm membership is created or completed correctly
- confirm the right products and services are enabled
- confirm the invited admin lands in the correct workspace after acceptance

### 2. Existing workspace flow

- select an existing workspace in Portal
- update entitlements or services
- confirm no duplicate workspace or membership is created
- confirm updated access is reflected correctly in the dashboard

### 3. Invitation lifecycle

- send invite
- resend invite
- accept invite
- confirm the operator-visible provisioning status updates correctly

### 4. Cross-product visibility

- enabled products appear in Portal
- disabled products are not launchable
- launch into PhotoVault, Stories, and Reach works for the provisioned workspace

### 5. Operator workflow

- Super Admin can complete the practical provisioning workflow without using PhotoVault
- operator can understand current state without checking PhotoVault
- any support-only fallback path is explicitly documented

### 6. Regression checks

- PhotoVault compatibility flow still works during transition
- invite acceptance behavior is not broken
- no cross-school mixing of members, media, or entitlements occurs

## Cutover Sequence

### Stage 1: Portal preferred, PhotoVault fallback

- Portal is the preferred provisioning workflow
- PhotoVault remains available as a compatibility fallback
- all new provisioning improvements happen in Portal, not PhotoVault
- operator docs begin pointing to Portal first

Status: substantially complete in product/code. Portal now contains the connected Super Admin workflow across Provisioning, School Ops, and Platform Users. The remaining work is production validation and the operator-process shift, not more primary-surface building in PhotoVault.

### Stage 2: Production validation

- run the production smoke checklist above
- confirm operators can complete real provisioning without PhotoVault
- resolve any blockers found in production use

### Stage 3: Operator process shift

- update internal docs to make Portal the default provisioning tool
- explicitly label PhotoVault provisioning as fallback-only
- stop training operators on PhotoVault-first provisioning

### Stage 4: Retire PhotoVault as the primary surface

- Portal becomes the sole documented Super Admin provisioning path
- PhotoVault is no longer treated as the normal provisioning tool
- PhotoVault remains only as a temporary compatibility path for edge cases, if still needed

### Stage 5: Cleanup

- remove or hide PhotoVault-first provisioning guidance
- keep only product-local mapping and compatibility behavior in PhotoVault
- do not maintain permanent equal ownership between Portal and PhotoVault

## What Remains Product-Local In PhotoVault

After the transition, PhotoVault should still own:

- product-local access interpretation
- product-local behavior after membership and entitlement are valid
- media, albums, share links, and other product-local workflows

Portal should not own:

- PhotoVault album and media workflows
- PhotoVault-specific permissions beyond launch and access eligibility

## Rules

- avoid a permanent dual-ownership model
- do not remove a working operational path prematurely
- treat PhotoVault as a compatibility path only until Portal fully replaces the provisioning workflow
- keep provisioning orchestration in Portal, not split back across products

## Acceptance Criteria

- there is an active exit plan for removing PhotoVault as the primary provisioning surface
- the plan explicitly states that Super Admin provisioning should converge on Portal as the single workflow
- the plan lists the Canopy capabilities that must exist first
- the plan lists the production smoke checks required before operator cutover
- the plan defines when internal docs and operator process should shift to Portal
- the plan defines what remains product-local in PhotoVault after the transition
- the plan avoids a permanent dual-ownership model
