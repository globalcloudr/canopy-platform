# Community Canopy MVP Definition

Date: 2026-03-23

## Purpose

Define `Community Canopy` as the second MVP product inside the Canopy platform so it can be designed and built without ambiguity.

## What Community Canopy Is

Community Canopy is the newsletter and school-to-community communications product inside Canopy.

It lets school staff create, send, and track email newsletters to their enrolled student and community lists — either themselves or through Canopy as a managed service.

This product is grounded in a proven real-world workflow:
- Canopy has drafted and sent newsletters on behalf of adult education schools for two years
- Schools average 40–60% open rates and 4–15% click rates
- Schools have email lists ranging from a few hundred contacts to nearly 20,000
- Content follows repeatable patterns: upcoming classes, success stories, new semester/term, community events

Community Canopy turns this proven service into a self-serve product while keeping the managed service path available for schools that prefer it.

## Email Delivery Provider

Community Canopy uses **SendGrid** (via Twilio) as the email delivery provider.

Key SendGrid capabilities in use:
- Dynamic Templates — school-specific branded templates designed in SendGrid's drag-and-drop builder
- Subuser accounts — each school workspace gets its own SendGrid subuser for isolated sending reputation and separate analytics
- Webhook events — opens, clicks, bounces, and unsubscribes tracked in real time
- Transactional API — campaigns sent via SendGrid's mail send API

A working WordPress plugin (`SendGrid Newsletter Pro`) already exists that handles the SendGrid integration and is installed on each school's WordPress website. At MVP, it continues to serve two specific roles:
- Site embedding: published campaigns are embedded on the school's website automatically
- Webhook endpoint: receives SendGrid event data and stores it locally on the school site

## Self-Serve vs. Managed Service

Community Canopy supports two delivery modes from day one.

### Self-Serve

School staff log into the Canopy portal, enter Community Canopy, and handle their own newsletter workflow:
- Create a new campaign
- Choose a school-branded template
- Add or update content (subject line, sections, links)
- Select the target list
- Send or save as draft
- View analytics after sending

### Managed Service

School contacts Canopy instead of creating the campaign themselves. Canopy staff handle:
- Content drafting based on materials the school provides
- Template selection and layout
- List management
- Sending and delivery confirmation
- Analytics reporting

The managed service is a paid add-on. It is visible in the portal as a service offering, not a software button.

## Email List Management

Schools maintain their own email lists.

Current real-world workflow:
- Schools pull their email list quarterly from their enrollment system
- Lists are provided as CSV files (columns: email, first name, last name)
- Lists are uploaded into the system and organized by term or cohort

Community Canopy MVP list management:
- Upload subscriber list via CSV
- Organize into named lists (e.g., "Fall 2025 Students", "Spring 2026 Prospects")
- View subscriber count per list
- Unsubscribes handled automatically by SendGrid

List growth and segmentation tools are out of scope for MVP.

## Email Templates

Templates are created in SendGrid's Dynamic Template builder and assigned to each school workspace.

Template setup at MVP:
- Canopy creates one branded template per school during onboarding
- Template reflects the school's colors, logo, and layout preferences
- Templates are maintained by Canopy initially; self-serve template editing is out of MVP scope

Content sections available in templates:
- Header with school name/logo
- Featured story or announcement
- Upcoming classes or programs
- Event callout
- Success story / student highlight
- Footer with unsubscribe link and contact info

School staff fill in the content, not the design. This matches how the current managed service already works.

## MVP Workflow — Step by Step

1. School staff logs into Canopy portal
2. Launches Community Canopy from the dashboard
3. Sees their campaign history and analytics summary
4. Clicks "Create Newsletter"
5. Selects which list to send to
6. Fills in subject line and content sections
7. Previews the email using the SendGrid-rendered template
8. Sends a test email to themselves
9. Sends to the full list or saves as draft
10. After sending, views delivery stats: sent, opens, clicks, bounces

After sending, the newsletter is automatically embedded on the school's WordPress website via the existing plugin (no additional action needed by staff).

## Analytics

Community Canopy shows per-campaign analytics pulled from SendGrid webhook events:

- Emails sent
- Delivered
- Open rate
- Click rate
- Bounces
- Unsubscribes

Analytics are visible inside Community Canopy per campaign.

Over time, campaign event data flows into Insights Canopy for cross-product visibility.

## Connection to the Platform

Community Canopy connects to the Canopy platform through the standard model:

- User authenticates through the Canopy portal
- Active workspace determines which Community Canopy account and lists are shown
- Product entitlement for `community_canopy` must be `active` or `pilot` to launch
- SendGrid subuser is provisioned per workspace by Canopy during onboarding

## Canopy Staff Interface

Canopy staff need a way to:
- Create and manage campaigns on behalf of any school (managed service)
- Access any workspace's campaign list and analytics
- Provision a new school's SendGrid subuser and template during onboarding
- Upload or update subscriber lists on a school's behalf

This is addressed through Canopy's operator/platform-staff access, not through a separate admin app.

## MVP Scope

### In Scope

- Campaign creation with content sections
- SendGrid Dynamic Template integration
- List management with CSV upload
- Send and draft save
- Test email before sending
- Campaign analytics: sent, opens, clicks, bounces, unsubscribes
- Automatic site embedding via WordPress plugin (existing)
- Managed service pathway visible in the portal
- Canopy staff can manage campaigns on behalf of any school

### Out of Scope for MVP

- Drag-and-drop template editor inside Canopy (templates managed in SendGrid)
- Self-serve template creation or editing
- A/B testing
- Automated drip campaigns or email sequences
- Advanced subscriber segmentation
- Subscriber growth tools or sign-up forms
- SMS delivery
- Deep analytics beyond per-campaign stats (that is Insights Canopy)
- Billing or plan enforcement logic

## MVP Success Criteria

Community Canopy MVP succeeds if:

1. A school staff member can log in and see their newsletter history
2. They can create a new campaign, select a list, and send it
3. They can view open rate and click rate after sending
4. Canopy staff can do all of the above on behalf of any school
5. The newsletter appears on the school's website automatically after sending
6. The portal dashboard card for Community Canopy shows a meaningful action ("Create Newsletter")

## Relationship to the WordPress Plugin

The existing `SendGrid Newsletter Pro` WordPress plugin continues to run on each school's website.

Its role in the Community Canopy architecture:
- Receives SendGrid webhook events and stores them locally on the school site
- Handles newsletter embedding on the school's public web pages
- Provides a fallback WordPress admin interface if needed

The Community Canopy Canopy app talks to SendGrid's API directly for campaign creation, list management, and sending. The WordPress plugin does not need to be the primary interface for school staff once Community Canopy is live.

This keeps Community Canopy independent of any one school's WordPress installation.

## Summary

Community Canopy is a proven service being turned into a self-serve product. The email infrastructure (SendGrid), the WordPress embedding layer, and the core workflow pattern are all already established. The MVP is about giving schools a clean Canopy-native interface to run their own newsletter program — or to request that Canopy does it for them.
