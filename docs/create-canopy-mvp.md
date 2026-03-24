# Canopy Create MVP Definition

Date: 2026-03-23

## Purpose

Define `Canopy Create` as an MVP product inside the Canopy platform so it can be designed and built without ambiguity.

## What Canopy Create Is

Canopy Create is the design request and creative services management product inside Canopy.

It gives school staff a formal way to submit design requests — flyers, brochures, class catalogs, social graphics, event programs, and more — and gives Canopy staff a structured workflow to receive, scope, produce, and deliver that work.

This product solves a real operational problem:
- Schools regularly need designed materials and currently make requests informally — via email, text, or phone
- Requests arrive without enough detail, leading to back-and-forth clarification
- There is no formal pricing or approval step before work begins
- Deliverables are shared through email or file-sharing links with no organized history
- Design work is often undercharged or not charged at all because there is no clear billing trigger

Canopy Create puts a formal process around creative services and creates a clear path for Canopy to charge for design work.

## Request Types

Canopy Create supports the design request types schools most commonly need:

- **Flyer** — single-page promotional or informational sheet
- **Brochure** — multi-panel or multi-page program overview
- **Class catalog** — full term course listing (feeds into Publish Canopy on delivery)
- **Social graphic** — platform-sized image for Facebook, Instagram, LinkedIn
- **Event program** — ceremony or event booklet
- **Enrollment guide** — prospective student packet
- **Banner or signage** — print-ready large-format file
- **Email header or template graphic** — branded asset for Community Canopy use
- **Custom** — any other design request with a description

## The Request Workflow

### School Side

1. School staff submits a design request through Canopy Create
2. They fill out a request form: asset type, purpose, dimensions/format, key content or copy, deadline, any reference materials or examples
3. Request is submitted and status shows as **Submitted**
4. Canopy reviews the request and responds with a quote and estimated turnaround
5. School reviews the quote and approves or declines
6. Once approved, status moves to **In Production**
7. School receives a notification when the design is ready for review
8. School reviews the delivered file and either approves or requests a revision
9. On approval, the final file is available to download from the Canopy Create portal
10. Status moves to **Delivered**

### Canopy Staff Side

1. New request appears in the Canopy Create staff queue
2. Staff reviews the request details and any attached reference files
3. Staff adds a quote (flat fee or hourly) and estimated delivery date, sends to school for approval
4. School approves → request moves to In Production
5. Staff designs the asset outside the portal (in their design tool of choice)
6. Staff uploads the finished file and marks the request as ready for review
7. School approves or requests revisions
8. On final approval, request is marked Delivered and the file is locked in the portal

## Request States

| State | Meaning |
|---|---|
| Submitted | School has submitted the request, awaiting Canopy review |
| Quoted | Canopy has sent a quote, awaiting school approval |
| Approved | School approved the quote, work has not started |
| In Production | Canopy is actively working on the design |
| In Review | Canopy has delivered a draft, awaiting school feedback |
| Revision Requested | School has requested changes |
| Delivered | Final file approved and available for download |
| Cancelled | Request was withdrawn or declined |

## Pricing and Billing

Canopy Create formalizes the design fee process:

- Each request gets a quoted price before work begins
- School must approve the quote before Canopy starts production
- Quote approval is the billing trigger — it creates a clear record of what was agreed
- Final invoice or charge is generated on delivery

At MVP, pricing and payment processing are handled outside the portal (Canopy invoices through their normal billing process). Canopy Create records the quoted amount and approval — the billing record — without requiring an integrated payment system at this stage.

Payment integration is a later capability.

## File Delivery and Version Management

Every design request in Canopy Create maintains a full version history. This is especially important for recurring publications like class catalogs, which are updated every term, and for any project that goes through multiple revision rounds.

### How Versioning Works

Each time Canopy uploads a file for review, it is stored as a numbered version:

- **v1** — first draft delivered for school review
- **v2** — revised version after first round of feedback
- **v3** — and so on through additional revisions
- **Final** — the version the school approves for delivery

Every version is stored and accessible. School staff can see the full revision history for any request and download any previous version. Nothing is overwritten.

### Revision Notes

Each version includes a notes field:
- Canopy staff describe what changed from the previous version
- School staff describe what they want changed when requesting a revision
- This creates a written record of every decision and change across the full production history

### Publication Versions Across Terms

For recurring publications like class catalogs, Canopy Create tracks versions across requests over time — not just within a single project:

- **Fall 2025 Catalog** — v1, v2, Final
- **Spring 2026 Catalog** — v1, Final
- **Fall 2026 Catalog** — v1, v2, v3, Final

Each term's catalog is a new request, but all versions are grouped under the same publication name in the workspace. School staff can see the complete history of their catalog across every term and download any version that was ever delivered.

This gives schools a clean archive of all their published materials, and gives Canopy staff a reference point when starting a new term's version — they can see exactly what was approved last time.

### Approval Record

When a school approves a final version, the approval is recorded with a timestamp and the approving user's name. This creates an unambiguous record of what was signed off on and when — useful for both billing and for resolving any future disputes about what was delivered.

### Storage and Access

Finished design files are stored per workspace in Canopy Create. School staff can:

- Download any version of any file at any time
- See the full revision history and notes for every request
- Filter their request history by publication type or date range

Finished files for print publications (class catalogs, brochures) can be forwarded directly to Publish Canopy for Issuu upload, completing the production-to-publishing handoff within the Canopy platform.

## Connection to Other Products

Canopy Create sits at the start of the content production pipeline:

- **Publish Canopy** — finished catalogs and brochures produced through Canopy Create are uploaded to Issuu and assigned to the workspace in Publish Canopy
- **Reach Canopy** — finished social graphics can be used directly in Reach Canopy posts
- **Community Canopy** — finished email header graphics and promotional assets can be used in newsletter templates
- **PhotoVault** — finished brand assets (logos, banners, approved graphics) can be stored in PhotoVault as the school's approved asset library

## Connection to the Platform

Canopy Create connects to the Canopy platform through the standard model:

- User authenticates through the Canopy portal
- Active workspace determines which requests and delivered files are shown
- Product entitlement for `create_canopy` must be `active` or `pilot` to launch

## Canopy Staff Interface

Canopy staff need a way to:

- See all incoming design requests across all workspaces in a single queue
- Review request details and attached reference files
- Send quotes and track school approval
- Upload finished files and mark requests as ready for review
- Manage revision rounds
- View the full request history per school

This is addressed through Canopy's operator/platform-staff access.

## Self-Serve Consideration

Canopy Create is primarily a managed service workflow product — school staff request, Canopy produces. There is no self-serve design tool inside Canopy at MVP.

However, the product still delivers school-facing value through the portal: structured intake, status visibility, quote approval, file delivery, and request history. Schools get a professional experience instead of an informal email thread, and Canopy gets a documented record of every project.

## MVP Scope

### In Scope

- Design request intake form with asset type, details, deadline, and reference file upload
- Request status tracking through the full workflow
- Canopy staff quote and school approval step (billing trigger)
- File delivery and download from the portal
- Full version history per request — every draft and revision stored, never overwritten
- Revision notes per version (what changed, what was requested)
- Publication version history across terms for recurring publications (catalogs, brochures)
- Timestamped approval record on final version
- Request history per workspace
- Canopy staff request queue across all workspaces
- Handoff path to Publish Canopy for print publications

### Out of Scope for MVP

- Integrated payment processing (billing handled externally)
- In-portal design tools
- Automated pricing based on asset type
- Client-facing revision markup tools (revisions communicated by description)
- Multi-file or multi-asset project management
- Template library for schools to customize themselves
- Billing or plan enforcement logic

## MVP Success Criteria

Canopy Create MVP succeeds if:

1. A school staff member can submit a design request with all necessary details in one form
2. They can see the status of their request at every stage
3. They can review and approve a quote before work begins
4. They can download the finished file from the portal
5. Canopy staff have a single queue showing all incoming requests across all schools
6. Every design project has a documented quote and approval record
7. The portal dashboard card for Canopy Create shows active requests and a "New Request" action

## Summary

Canopy Create replaces an informal, ad-hoc design request process with a structured workflow that benefits both schools and Canopy. Schools get visibility into their requests and a clean way to receive finished files. Canopy gets a formal intake process, a documented billing trigger, and a professional service delivery experience — without building a design tool. The product is primarily a managed service workflow, and its output feeds directly into the rest of the Canopy platform.
