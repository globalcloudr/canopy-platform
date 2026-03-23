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

- the active workspace
- the portal as the control plane
- products as launchable work areas

The platform should not bury the user in a huge left nav full of every future idea.

## Top-Level Navigation Model

Recommended top-level portal navigation:

- `Home`
- `Products`
- `Account`

Optional later additions:

- `Notifications`
- `Support`
- `Insights`

## Primary Portal Behaviors

### Home

Purpose:

- workspace overview
- product launcher
- current service state
- important tasks or setup prompts

### Products

Purpose:

- list enabled products
- show product status
- provide launch actions
- optionally show not-yet-enabled products if you want controlled upsell visibility

### Account

Purpose:

- workspace profile
- user profile
- service/account visibility
- billing visibility later

## Global Header

Recommended persistent header elements:

- Canopy mark / home link
- active workspace name
- workspace switcher
- product launcher access
- account menu

This is the minimum shell needed to make the portal feel like a real platform.

## Product Launcher Model

The product launcher should be treated as a core platform object, not an afterthought.

Recommended product card content:

- product name
- short descriptor
- status
- launch button

Optional metadata:

- setup in progress
- pilot label
- last activity later

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

- show workspace name in the header
- expose a switcher when more than one workspace exists
- carry workspace context into product launch URLs or auth/session state

## Recommended MVP Navigation

For the first portal version:

- top header only
- simple home/dashboard
- products section or products area on home
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
- active workspace always visible
- strong product launcher
- clear separation between portal navigation and product navigation

That supports a connected platform without making the portal feel bloated.
