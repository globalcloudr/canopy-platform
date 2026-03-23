# Canopy Technical Platform Architecture Brief

Date: 2026-03-23

## Purpose

Define a practical technical architecture for Canopy so the platform can grow beyond PhotoVault without collapsing into either:

- a monolithic app that tries to do everything
- a loose collection of disconnected tools under one brand

This brief describes:

- the Canopy platform core
- the core objects across the ecosystem
- product boundaries
- shared services
- the integration model
- a recommended phase-by-phase build order

## Working Position

Canopy should be built as:

- one platform core
- one shared workspace and identity model
- multiple modular product applications

PhotoVault should remain a distinct product inside the platform:

- `PhotoVault by Canopy`

The central control plane should live at:

- `usecanopy.school`

## Architecture Principle

The platform should not be:

- one giant codebase that owns every workflow
- one WordPress install pretending to be a full platform
- one product repo gradually absorbing every future feature

The platform should be:

- a shared platform core with modular products around it

That lets Canopy:

- launch incrementally
- preserve product clarity
- integrate external tools where useful
- keep strong shared identity and workspace cohesion

## Platform Model

### Tier 1: Portal / Control Plane

The portal is the operational center of Canopy.

Primary domain:

- `usecanopy.school`

Responsibilities:

- authentication
- school/workspace management
- user and role management
- subscriptions and product entitlements
- billing and service visibility
- product launch and navigation
- account settings
- notifications
- audit and activity surfaces

This is the true platform core.

### Tier 2: Shared Platform Services

These services create coherence across products.

Responsibilities:

- shared school profile metadata
- shared brand profile metadata
- asset references and asset permissions
- publication and campaign metadata
- integration credential management
- analytics event collection
- notification routing
- shared search and knowledge context over time

These services should support products without forcing all product logic into one place.

### Tier 3: Product Applications

These are distinct products with their own workflows and domain behavior.

Current target product family:

- `PhotoVault by Canopy`
- `Canopy Web`
- `Create Canopy`
- `Publish Canopy`
- `Community Canopy`
- `Reach Canopy`
- `Assist Canopy`
- `Insights Canopy`

Products may be implemented differently:

- standalone app
- embedded module
- plugin-backed experience
- service workflow with supporting UI

Not every product needs the same technical shape.

## Core Objects

The Canopy platform should define a small, stable shared object model first.

These are the primary objects in the Canopy universe:

### Platform Core Objects

- `Workspace`
  - the top-level school or education organization account
- `Organization`
  - optional internal or customer-facing organizational unit when needed
- `User`
  - a person with platform access
- `Membership`
  - the relationship between a user and a workspace
- `PlatformRole`
  - platform-level role such as super admin or platform staff
- `ProductEntitlement`
  - which products and services a workspace can access
- `Subscription`
  - billing and service plan information
- `Notification`
  - system and product-level alert routed through the platform
- `AuditEvent`
  - security and administrative activity log

### Shared Business Objects

- `SchoolProfile`
  - school identity and profile metadata used across products
- `BrandProfile`
  - brand colors, logo references, typography, and guidelines metadata
- `Asset`
  - a managed media object reference
- `AssetCollection`
  - album, library, or structured grouping of assets
- `IntegrationCredential`
  - API credentials and connection state for external services
- `Campaign`
  - shared campaign metadata used across newsletter, social, and reporting surfaces
- `Publication`
  - long-form brochure, catalog, or guide metadata
- `KnowledgeSource`
  - structured information source for Assist Canopy
- `InsightReport`
  - reporting artifact, metric set, or dashboard snapshot

### Product-Specific Objects

These should exist inside product boundaries unless a shared use case emerges later.

- `Website`
- `ProgramFeed`
- `DesignRequest`
- `Revision`
- `NewsletterIssue`
- `SocialPost`
- `Story`
- `Conversation`
- `EmbedConfig`

## System of Record Rules

Every important object should have a clear system of record.

Recommended ownership:

- `Workspace`, `User`, `Membership`, `PlatformRole`, `ProductEntitlement`, `Subscription`
  - system of record: Canopy platform core
- `BrandProfile`
  - system of record: Canopy platform core with asset references from PhotoVault
- `Asset`, `AssetCollection`, approved media, logos, brand files
  - system of record: PhotoVault
- `Website`, `ProgramFeed`, website publishing configuration
  - system of record: Canopy Web
- `DesignRequest`, collateral workflow objects
  - system of record: Create Canopy
- `Publication`, publication embeds, Issuu mappings
  - system of record: Publish Canopy
- `NewsletterIssue`, newsletter distribution records
  - system of record: Community Canopy
- `SocialPost`, `Story`, outreach workflows
  - system of record: Reach Canopy
- `KnowledgeSource`, assistant-specific conversation context
  - system of record: Assist Canopy
- `InsightReport`, cross-product reporting views
  - system of record: Insights Canopy

This rule prevents duplication drift and reduces platform ambiguity.

## Product Boundaries

Each product needs a clear ownership boundary.

### PhotoVault by Canopy

Role:

- asset foundation and brand asset system

Owns:

- photo libraries
- albums
- asset metadata
- share-ready media
- approved brand files
- asset access patterns

Reads:

- workspace identity
- memberships and roles
- product entitlements
- brand profile metadata when needed

Shares:

- approved asset references
- brand asset references
- asset metadata needed by other products

### Canopy Web

Role:

- school web publishing and CMS layer

Owns:

- websites
- page/content structures
- class and program publishing surfaces
- WordPress and ASAP-facing web integrations

Reads:

- workspace and brand metadata
- approved assets from PhotoVault
- publication metadata where needed

Shares:

- website status
- public publishing outputs
- content performance signals to Insights

### Create Canopy

Role:

- design and collateral production workflow

Owns:

- design requests
- revisions
- collateral production workflows
- approval states

Reads:

- brand profile metadata
- approved assets from PhotoVault
- campaign context where applicable

Shares:

- completed design outputs
- production status
- collateral metadata

### Publish Canopy

Role:

- publication management for digital brochures, catalogs, and guides

Owns:

- publication records
- embed configurations
- Issuu mappings
- publication publishing workflows

Reads:

- brand profile metadata
- approved assets
- website integration targets

Shares:

- publication status
- embed metadata
- visibility and performance signals

### Community Canopy

Role:

- newsletter and recurring school communication workflows

Owns:

- newsletter issues
- editorial workflow
- send records
- audience and communication workflow state

Reads:

- approved assets
- campaign metadata
- school profile and brand metadata

Shares:

- distribution metrics
- communication activity
- campaign linkage data

### Reach Canopy

Role:

- social outreach, scheduling, and storytelling

Owns:

- social posts
- social calendars
- story workflows
- social channel connection state

Reads:

- approved assets from PhotoVault
- brand profile metadata
- campaign metadata

Shares:

- distribution status
- outreach performance
- story and campaign outcomes

Note:

- A tool such as Postiz could be used as an engine for Reach Canopy, but it should remain a modular product service rather than the Canopy platform core.

### Assist Canopy

Role:

- communication and knowledge access layer

Owns:

- assistant experiences
- knowledge-source mappings
- conversation state
- support and query workflows

Reads:

- structured data from shared services and selected products
- workspace metadata
- permissions and access rules

Shares:

- usage analytics
- surfaced knowledge insights
- support workflow metadata

### Insights Canopy

Role:

- cross-product reporting and visibility layer

Owns:

- aggregated reporting models
- dashboards
- cross-product performance views

Reads:

- analytics events from the platform core
- product performance summaries
- campaign, publication, newsletter, and social metadata

Shares:

- executive and operator-facing reporting
- recommended areas of focus

## Shared Services

The following services should be treated as platform-level shared capabilities.

### Identity and Access

- authentication
- single sign-on across products
- workspace membership resolution
- product entitlements
- role and permission policy

### Workspace and Account Services

- workspace creation
- school profile
- subscription and service access
- account settings
- billing state

### Brand Services

- shared brand profile metadata
- logo and asset references
- theme and presentation metadata
- brand-consistency enforcement hooks over time

### Asset Reference Services

- asset lookup across products
- approved asset selection
- storage references and permissions
- lightweight metadata sync where needed

PhotoVault should remain the asset system of record, while the platform exposes reusable references and policies.

### Notification Services

- in-app alerts
- email notifications
- task and approval alerts
- cross-product status notifications

### Audit and Compliance Services

- activity tracking
- administrative audit events
- access logs
- key workflow event capture

### Analytics Event Services

- platform-wide event collection
- normalized event schema
- product usage tracking
- reporting handoff to Insights Canopy

### Search and Knowledge Services

- shared metadata indexing
- document and object discovery
- knowledge retrieval foundations for Assist Canopy

## Integration Model

Canopy will likely remain a hybrid system for some time.

That is expected and acceptable.

The integration model should clearly distinguish between:

- platform core
- product modules
- external systems
- plugins
- manual or operator-assisted workflows

### Integration Types

Recommended connection patterns:

- `API`
  - for structured product-to-product or product-to-service data exchange
- `Embed`
  - for public publishing or portal surface inclusion
- `Plugin`
  - for WordPress or channel-specific extensions
- `Sync`
  - for background propagation of metadata or reporting data
- `Manual Ops`
  - for workflows not yet automated but still supported operationally

### Likely External Integrations

- ASAP API
- WordPress
- Issuu
- Campaign Monitor or SendGrid
- social publishing providers
- Canva
- analytics and reporting tools
- future assistant or RAG services

### Integration Rules

- Prefer API-based integrations for durable platform connections.
- Use plugins where the delivery surface requires them.
- Keep credential ownership and connection state explicit.
- Avoid hidden point-to-point data duplication between products.
- Push normalized activity events into a shared analytics pipeline.
- Record the source of truth for every synced object.

## Identity and Workspace Model

This is the most important foundational decision.

Recommended model:

- each school is a `Workspace`
- users join workspaces through memberships
- the platform core resolves the active workspace
- products inherit workspace identity and access from the platform
- each workspace has product entitlements that determine what is enabled

This model allows Canopy to act like one ecosystem even when products are technically separate.

## Portal and Product Relationship

The platform portal should answer:

- who is the user
- which workspace is active
- which products are available
- which permissions apply
- which services are enabled

Products should answer:

- how does this workflow operate
- what domain data does this product own
- what outcomes does this product produce

That separation keeps the platform core clean.

## Recommended Repository Direction

Near-term recommendation:

- keep developing PhotoVault in its current repository
- use this repository for the shared Canopy portal/core

Reason:

- PhotoVault is already a functioning product with its own roadmap
- the platform core has different responsibilities and should not become accidental baggage inside the PhotoVault repo
- a separate platform repo makes it easier to define stable shared APIs and boundaries

Practical shape:

- `photovault`
  - asset foundation product
- `canopy-platform`
  - portal, identity, entitlements, workspace model, navigation, billing, notifications
- future product repos or services as they become real

## Recommended Phase-by-Phase Build Order

The goal is to create a believable platform without overbuilding too early.

### Phase 0: Platform Definition

Deliverables:

- platform architecture map
- core object model
- product boundary definitions
- system-of-record matrix

Success criteria:

- Canopy has a clear platform language
- product roles are defined
- future build decisions can be evaluated against an agreed structure

### Phase 1: PhotoVault as Product One

Deliverables:

- continue shipping PhotoVault as the first Canopy product
- harden auth, permissions, and asset workflows
- preserve its role as the asset system of record

Success criteria:

- PhotoVault remains independently useful
- its APIs and object model are clear enough to support later integration

### Phase 2: Canopy Platform Core

Deliverables:

- shared authentication and workspace model
- user memberships and entitlements
- portal dashboard and product launcher
- account and service visibility

Success criteria:

- schools can sign in through a central Canopy portal
- the portal can determine workspace, role, and product access

### Phase 3: PhotoVault Integration Into the Portal

Deliverables:

- unified launch path from `usecanopy.school`
- shared identity and workspace context between portal and PhotoVault
- shared navigation conventions and account experience

Success criteria:

- PhotoVault feels like a connected Canopy product rather than a separate destination

### Phase 4: Shared Event and Brand Layer

Deliverables:

- common analytics event model
- shared brand profile metadata
- shared notification hooks
- reusable asset reference services

Success criteria:

- future products can plug into real shared services instead of inventing their own copies

### Phase 5: Launch the Second Product

Recommended candidate:

- `Reach Canopy` or `Canopy Web`

Reason:

- each has a strong external value story
- each benefits directly from PhotoVault and shared platform context

Success criteria:

- the second product launches through the portal
- shared identity and workspace access are preserved
- cross-product value is visible to users

### Phase 6: Add Integration-Heavy Products

Candidates:

- `Publish Canopy`
- `Community Canopy`
- `Create Canopy`

Approach:

- implement product-specific workflows incrementally
- use plugins and external systems where they are the fastest path
- avoid rebuilding mature channel-specific tooling unless needed

Success criteria:

- products share the platform backbone without forcing identical implementation patterns

### Phase 7: Assist and Insights

Deliverables:

- cross-product knowledge access
- normalized reporting and dashboards
- operational and client-facing visibility layers

Success criteria:

- Canopy becomes a true connected system, not just a branded bundle

## Near-Term Next Decisions

The next architecture decisions that matter most are:

1. define the canonical `Workspace` model
2. define the initial shared auth and SSO approach
3. define the first product-entitlement model
4. define which metadata must be shared versus product-local
5. choose the second product to integrate after PhotoVault

## Summary

The strongest architecture for Canopy is:

- one platform portal and control plane at `usecanopy.school`
- one shared workspace and identity model
- shared services for cross-product cohesion
- modular products with clear ownership boundaries

PhotoVault should remain the first product and the asset foundation of the ecosystem.

Canopy should grow by adding connected products around that foundation, not by turning PhotoVault into the entire platform.
