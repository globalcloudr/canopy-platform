# Canopy Publish MVP Definition

Date: 2026-03-23

## Purpose

Define `Canopy Publish` as the fifth MVP product inside the Canopy platform so it can be designed and built without ambiguity.

## What Canopy Publish Is

Canopy Publish is the digital publications management product inside Canopy.

It gives schools a clean Canopy-native interface to access, display, and share the class catalogs, program brochures, and other print materials that Canopy designs and publishes on their behalf.

This product is grounded in an existing real-world service:
- Canopy designs class catalogs, brochures, enrollment guides, and program materials for adult education schools
- These publications are uploaded to **Issuu**, a digital publishing platform that hosts them as interactive flipbooks
- Schools receive an embed code from Issuu that displays the flipbook on their website
- Schools with WordPress sites use the Canopy-built WordPress plugin to manage which publications appear on their site

Canopy Publish turns this workflow into a managed Canopy product: schools see their full publication library in the portal, can get embed codes, share links, and display publications on their Canopy-powered website — without ever needing to know what Issuu is.

## Publishing Infrastructure: Issuu

Issuu is the flipbook hosting and rendering platform that powers Canopy Publish at MVP.

Issuu provides:
- Interactive flipbook rendering (page-turn viewer) for PDFs
- Hosted public publication URLs
- Embed codes for displaying publications on external websites
- Publication-level view stats (page views, reading time, reader count)
- API access for fetching publication data and embed codes

Canopy operates one Issuu account. Each school's publications are uploaded to Canopy's Issuu account and assigned to that school's workspace in Canopy Publish.

Schools never interact directly with Issuu. Canopy Publish is the only surface they see.

This is the same infrastructure model as Community Canopy (SendGrid) and Reach Canopy (Postiz): an established platform provides the delivery engine, and Canopy owns the school-facing product layer.

## Publication Types

Canopy Publish supports the publication types Canopy currently produces for schools:

- **Class catalog** — full term or semester course listings
- **Program brochure** — single program or department overview
- **Enrollment guide** — prospective student information packet
- **Event program** — graduation, awards ceremony, or community event
- **Annual report** — school year recap and outcomes
- **Custom document** — any other designed PDF publication

Each publication belongs to a workspace and is tagged by type and term/year for easy browsing.

## School-Facing Features

### Publication Library

School staff see all publications assigned to their workspace:
- Publication name, type, and term/year
- Thumbnail preview
- View count and last-viewed date (from Issuu)
- Links to: view online, copy embed code, copy public share link

### Embed Code

Each publication has a Canopy-generated embed code. Schools paste this once into any page on their website to display the flipbook inline. The embed code pulls the current publication from Issuu.

For schools using Canopy Web, there is no embed code needed — publications are displayed through a native publications module (see below).

### Share Link

Each publication has a hosted public URL. Schools can share this link directly in emails, newsletters, or social posts. The link opens the full Issuu flipbook reader.

### Analytics

Per-publication view stats from Issuu:
- Total views
- Unique readers
- Average reading time
- Page-level engagement (which pages readers reach)

## Canopy Web Integration

Schools using Canopy's CMS (`Canopy Web`) can enable a native publications module on their website that displays their Canopy Publish library with no embed code required. As Canopy assigns new publications to the workspace, they appear on the school's site automatically.

This is the native path for schools fully on the Canopy platform. It mirrors how Community Canopy newsletters can appear natively on a Canopy Web site.

## WordPress Plugin

The `Issuu Publications Manager` WordPress plugin is a **separate standalone product** — not the backend of Canopy Publish.

It exists as an independent offering for schools that manage their own WordPress site and want to display their Issuu publications without a Canopy portal account. It uses an access code system: Canopy generates a code for each school, assigns their publications to that code, and the school enters the code in their WordPress admin to display their library.

Schools with Canopy accounts and WordPress sites may use both, or just Canopy Publish. There is no hard dependency between them.

## Self-Serve vs. Managed Service

Canopy Publish supports two delivery modes from day one.

### Self-Serve

School staff log into the Canopy portal, enter Canopy Publish, and manage their own publication display:
- View their full publication library
- Copy embed codes and share links
- Display publications on their site using embed codes or the Canopy Web module
- Review per-publication view stats

At MVP, schools do not upload publications themselves. Canopy uploads finished PDFs to Issuu and assigns them to the workspace. Self-serve upload is a later capability.

### Managed Service

School contacts Canopy for the full production workflow. Canopy staff handle:
- Design and layout of the class catalog or brochure
- PDF export and upload to Issuu
- Workspace assignment so the publication appears in the school's Canopy Publish library
- Delivery notification

The managed service is the default relationship at MVP. Most schools will not have their own PDF to upload — they rely on Canopy to produce the publication.

## Canopy Staff Interface

Canopy staff need a way to:
- Upload a finished PDF to Issuu and assign it to a workspace
- Tag publications by type, term, and year
- Update publication metadata (name, cover thumbnail)
- Remove or archive outdated publications from a workspace

This is addressed through Canopy's operator/platform-staff access, not through a separate admin app.

## Connection to the Platform

Canopy Publish connects to the Canopy platform through the standard model:

- User authenticates through the Canopy portal
- Active workspace determines which publications are shown
- Product entitlement for `publish_canopy` must be `active` or `pilot` to launch
- Publication library is populated by Canopy staff assigning publications during or after production

## Cross-Product Integration

- **Community Canopy** — schools can link to a publication (class catalog, program brochure) inside a newsletter, or embed a flipbook directly if the template supports it
- **Reach Canopy** — schools can share a publication link as a social post, pulling the cover image and link directly from the Canopy Publish library
- **Canopy Web** — native publications module displays the workspace library without embed codes
- **Stories Canopy** — program overviews and annual reports can draw on approved publications as context and source material

## MVP Workflow — Step by Step

**Canopy staff (after designing a class catalog for a school):**
1. Export finished design as PDF
2. Upload PDF to Issuu via the Canopy Issuu account
3. In Canopy Publish staff view: assign the publication to the school's workspace, set type and term
4. School is notified that their new class catalog is available

**School staff:**
1. Logs into Canopy portal and enters Canopy Publish
2. Sees their publication library with the new catalog
3. Copies the embed code and pastes it into their website (or uses the Canopy Web module)
4. Shares the public link in their next Community Canopy newsletter
5. Checks view stats after the newsletter goes out

## MVP Scope

### In Scope

- Publication library view per workspace
- Publication types: catalog, brochure, enrollment guide, event program, annual report, custom
- Embed code and public share link per publication
- Per-publication view stats from Issuu
- Canopy staff can upload and assign publications to any workspace
- Canopy Web native publications module
- Cross-product link sharing with Community Canopy and Reach Canopy
- Managed service pathway visible in the portal
- WordPress plugin as standalone product (separate from the Canopy portal)

### Out of Scope for MVP

- Self-serve PDF upload by school staff
- Self-serve Issuu account management
- In-portal flipbook viewer (links out to Issuu or uses Issuu embed)
- PDF design tools inside Canopy
- Print ordering or fulfillment
- Advanced reader analytics beyond Issuu-provided stats
- Billing or plan enforcement logic

## MVP Success Criteria

Canopy Publish MVP succeeds if:

1. A school staff member can log in and see their full publication library
2. They can copy an embed code and share link for any publication
3. View stats are visible per publication
4. Canopy staff can upload a publication and assign it to any school's workspace
5. Publications appear automatically on a Canopy Web site when the module is enabled
6. The portal dashboard card for Canopy Publish shows recent publications and a clear entry point

## Relationship to the WordPress Plugin

The `Issuu Publications Manager` WordPress plugin operates independently from Canopy Publish. Both use Issuu as the underlying publication host, but they serve different access paths:

- **Canopy Publish**: school staff access publications through the Canopy portal
- **WordPress plugin**: school staff access publications through their WordPress admin using an access code

Schools fully on the Canopy platform use Canopy Publish. Schools that prefer WordPress-based management use the plugin. Schools with both can use both.

## Summary

Canopy Publish is the Canopy-native face of a service Canopy already delivers — designing and distributing class catalogs and brochures for adult education schools. Issuu handles the hosting and rendering. Canopy Publish gives schools a clean portal interface to access their library, display publications on their site, and share them across channels — without any awareness of the underlying platform.
