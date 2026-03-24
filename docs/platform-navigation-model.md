# Canopy Platform Navigation Model

Date: 2026-03-23

## Purpose

Define a simple navigation model for Canopy so the platform feels unified as products are added.

Navigation should make three things obvious:

- where the user is
- which workspace is active
- which products and services are available

## Core Principle

Navigation should be organized around:

- the active organization/workspace
- the portal as the control plane
- products as launchable work areas

The platform should not bury the user in a huge left nav full of every future idea.

## Top-Level Navigation Model

Recommended top-level authenticated portal navigation:

- `Home`
- `Products`
- `Account`

Optional later additions:

- `Notifications`
- `Support`
- `Insights`

## Public vs Authenticated Navigation

Canopy has two navigation contexts:

### Public Site

Purpose:

- explain Canopy
- present products and services
- route users to sign-in

Recommended public navigation:

- `Products`
- `Services`
- `About`
- `Sign in`

### Authenticated Portal

Purpose:

- orient the signed-in user
- show the organization's products and services
- provide account entry and launch actions

The authenticated portal should feel operational, not promotional.

The default authenticated landing destination should be the dashboard, not a chooser or intermediary routing screen unless a real edge case requires it.

## Primary Portal Behaviors

### Home

Purpose:

- workspace overview
- product launcher
- current service state
- important tasks or setup prompts

### Products

Purpose:

- list the organization's current products
- show product status
- provide product actions
- optionally show additional Canopy products separately

### Account

Purpose:

- workspace profile
- user profile
- service/account visibility
- billing visibility later

## Global Header

Recommended persistent header elements:

- Canopy mark / home link
- active organization/workspace name
- primary navigation
- account menu

Recommended MVP rule:

- do not expose a visible workspace switcher in the normal default shell unless the user actually belongs to more than one organization/workspace

This is the minimum shell needed to make the portal feel like a real platform without making the user think about platform mechanics.

## Portal Shell Contract

For MVP, the authenticated shell should include:

### Header

- Canopy brand / home link
- top-level nav:
  - `Home`
  - `Products`
  - `Account`
- passive organization/workspace label
- account menu or account chip

### Dashboard Body

- welcome/context section
- `Your Apps`
- `Other Products`
- `Services`
- account/support entry

### What Should Not Be In The MVP Shell

- full left navigation
- large admin control panels
- deep settings architecture in the main shell
- noisy notification systems
- technical workspace controls as a default visible pattern

## Product Launcher Model

The product launcher should be treated as a core platform object, not an afterthought.

Recommended product card content:

- product name
- short descriptor
- status
- primary action
- optional secondary action

Optional metadata:

- setup in progress
- pilot label
- last activity later

Recommended card rule:

- product cards should be task-oriented
- avoid generic `Launch Product` labels when a more specific action is available

## Product Naming Model

Recommended visible naming:

- `PhotoVault`
- `Canopy Web`
- `Create Canopy`
- `Publish Canopy`
- `Community Canopy`
- `Reach Canopy`
- `Assist Canopy`
- `Insights Canopy`

Keep visible naming consistent everywhere:

- portal
- product launcher
- account/service screens
- customer-facing materials

## Relationship Between Portal Nav and Product Nav

Portal navigation should answer:

- how do I move around the Canopy platform

Product navigation should answer:

- how do I work inside this product

Do not force the portal nav to become the entire app nav for every product.

Instead:

- the portal launches the product
- the product owns its internal workflow navigation

## Workspace Visibility

The active workspace should always be visible.

Recommended behavior:

- show organization/workspace name in the header
- expose a switcher only when more than one workspace exists
- carry workspace context into product launch URLs or auth/session state

## Recommended MVP Navigation

For the first portal version:

- top header only
- simple home/dashboard
- products and services sections on home
- account/settings page

That is enough to feel coherent without overbuilding IA too early.

## Future Navigation Expansion

Later, the platform may support:

- notifications center
- support area
- billing area
- operator/admin tools
- shared insights surfaces

These should be added only when real workflows justify them.

## Summary

The best early navigation model for Canopy is:

- simple portal shell
- active organization/workspace always visible
- strong product launcher
- clear products vs services separation
- clear separation between portal navigation and product navigation

That supports a connected platform without making the portal feel bloated.
