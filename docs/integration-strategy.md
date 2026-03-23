# Canopy Integration Strategy

Date: 2026-03-23

## Purpose

Define how Canopy products, plugins, and external systems should connect without turning the platform into a fragile web of point-to-point dependencies.

This document focuses on:

- integration patterns
- system boundaries
- source-of-truth rules
- practical near-term guidance

## Core Principle

Canopy should be integrated, not tightly tangled.

That means:

- products should share platform context
- systems should connect through explicit interfaces
- the source of truth for each important object should stay clear

The goal is one connected platform experience without requiring one giant application or one giant database immediately.

## Integration Categories

Canopy integrations will likely fall into five categories.

### 1. Product-to-Platform Integrations

These connect a product to the Canopy portal/core.

Examples:

- workspace identity
- SSO/auth context
- product entitlements
- navigation launch links
- notifications
- analytics events

These are the most important integrations because they create the shared platform experience.

### 2. Product-to-Product Integrations

These connect one Canopy product to another.

Examples:

- PhotoVault assets used in Reach Canopy
- brand metadata used in Canopy Web
- publication data surfaced in Insights

These should usually flow through stable APIs or reference services.

### 3. Product-to-External-Service Integrations

These connect a Canopy product to outside tools.

Examples:

- ASAP API
- Issuu
- SendGrid or Campaign Monitor
- social channel providers
- Canva

These should remain product-specific unless there is a strong shared reason to centralize them.

### 4. Plugin Integrations

These connect Canopy into environments such as WordPress.

Examples:

- ASAP WordPress plugin work
- publication management plugin
- newsletter plugin

Plugins are valid delivery mechanisms and should be treated as first-class integration surfaces, not as architectural embarrassments.

### 5. Manual or Operator-Assisted Integrations

These cover workflows that are not yet worth fully automating.

Examples:

- implementation handoffs
- one-time migrations
- client setup tasks
- content or metadata imports

These should be documented clearly rather than hidden behind vague assumptions.

## Recommended Integration Patterns

### Pattern 1: API

Use when:

- data exchange is structured
- the connection is durable
- one system needs reliable read/write access to another

Good for:

- asset references
- entitlement checks
- shared metadata lookups
- reporting data handoff

### Pattern 2: Reference + Fetch

Use when:

- one product owns the object
- another product only needs to reference or consume it

Example:

- Reach Canopy stores a PhotoVault asset reference instead of duplicating the asset itself

This should be preferred over duplicate data copies when possible.

### Pattern 3: Event / Sync

Use when:

- reporting or derived state needs to update over time
- operational decoupling matters

Good for:

- analytics pipelines
- activity feeds
- dashboard rollups

### Pattern 4: Embed

Use when:

- the output is primarily meant to be rendered elsewhere

Good for:

- publication embeds
- website-embedded modules
- public content blocks

### Pattern 5: Plugin

Use when:

- the delivery environment is WordPress or another host platform

This is especially relevant for:

- Canopy Web
- Publish Canopy
- Community Canopy

## Source-of-Truth Rules

Every integration should answer:

- what system owns the object
- what system consumes the object
- whether the consumer stores a reference, a cache, or a copy

Recommended source-of-truth examples:

- assets and brand media
  - source of truth: PhotoVault
- workspace identity and product access
  - source of truth: Canopy platform core
- website content structures
  - source of truth: Canopy Web
- publication metadata
  - source of truth: Publish Canopy
- newsletter send records
  - source of truth: Community Canopy
- social posts and story workflows
  - source of truth: Reach Canopy
- cross-product reporting models
  - source of truth: Insights Canopy

If this answer is fuzzy, the integration is not ready.

## Credential Ownership

External integrations often require credentials.

Canopy should keep credential ownership explicit.

Recommended rule:

- the system that performs the integration owns the operational credential state
- the platform may track high-level connection status and metadata

Example:

- Reach Canopy may own social-channel OAuth state
- the platform may know that Reach Canopy is connected for a workspace

This avoids leaking product-specific secrets into the wrong layer.

## Analytics and Event Integration

Every Canopy product should emit normalized platform-relevant events.

Examples:

- product launched
- asset selected for campaign
- newsletter published
- story distributed
- publication viewed

These events should flow into a shared analytics/event pipeline so Insights Canopy can become meaningful later.

The platform does not need every product database replicated centrally. It needs a good event model.

## Recommended Integration Rules

1. Prefer explicit APIs over hidden database coupling.
2. Prefer references over duplicated content when possible.
3. Keep product-specific secrets in the product that uses them.
4. Normalize analytics events across products.
5. Document manual ops when automation does not yet exist.
6. Avoid point-to-point one-off integrations that bypass the platform model.

## Near-Term Practical Model

For the near term, Canopy will likely be hybrid:

- PhotoVault as a custom product app
- WordPress plugins for some publishing and newsletter workflows
- external tools for selected channel execution
- platform docs and core portal work growing in parallel

That is a good and realistic starting point.

The goal is not immediate technical purity.

The goal is:

- one clear platform center
- explicit integration boundaries
- a path to coherence over time

## Example Integration Flows

### PhotoVault -> Reach Canopy

Flow:

- user selects approved assets in PhotoVault
- Reach Canopy stores asset references
- Reach Canopy publishes or schedules social content
- outcome events flow to Insights

### PhotoVault -> Canopy Web

Flow:

- Canopy Web reads approved brand/media references
- web publishing surfaces use those assets
- website performance data later contributes to Insights

### Community Canopy -> Insights

Flow:

- newsletter sends and engagement metrics are collected in Community Canopy
- normalized metrics flow into the shared reporting layer

### Publish Canopy -> Website

Flow:

- publication metadata and embed settings are managed in Publish Canopy
- website embeds render through Canopy Web or WordPress surfaces

## Recommended Next Decisions

1. define the first stable platform-to-product API boundary
2. decide how workspace context is passed into products
3. define the first normalized analytics event schema
4. define how plugin-based products report status into the portal
5. document which existing integrations remain manual for now

## Summary

Canopy should integrate through:

- shared platform context
- explicit APIs and references
- normalized events
- clear system-of-record rules

That approach will let you build a connected platform without forcing every product into the same technical shape.
