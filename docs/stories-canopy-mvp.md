# Canopy Stories MVP Definition

Date: 2026-03-23

## Purpose

Define `Canopy Stories` as the fourth MVP product inside the Canopy platform so it can be designed and built without ambiguity.

## What Canopy Stories Is

Canopy Stories is the AI-powered success story production product inside Canopy.

It automates the creation of multi-channel content — blog posts, social media posts, newsletter features, press releases, and short videos — from structured input collected directly from students, staff, or partner organizations.

This product directly competes with **N&R Publications**, a traditional success story service that relies on manual interviews, photography sessions, and weeks-long production cycles. Canopy Stories delivers equivalent output in minutes by replacing manual production with an automated AI pipeline.

The core workflow:
1. School sends a prepopulated intake form to a student, staff member, employer, or partner
2. The recipient completes the form and optionally uploads a photo or video
3. AI generates a complete set of publication-ready content across all channels
4. Content and assets are packaged and available for the school to download and publish — or Canopy publishes it for them as a managed service

## Real-World Context

Canopy has been producing success stories for adult education schools as part of its retainer service. The production workflow is time-intensive:
- Schedule an interview or send questions manually
- Gather photos separately
- Write and edit the story
- Format for each channel (blog, social, newsletter, print)
- Deliver to the school for publishing

Canopy Stories turns this into a largely automated process, reducing the time from story submission to finished content from days to minutes.

## Story Types

Canopy Stories supports the content types adult education schools produce:

- **Student success stories** — ESL, HSD/GED, CTE, workforce training graduates
- **Staff highlights** — instructor and program coordinator features
- **Employer partnership stories** — employer outcomes and program endorsements
- **Partner organization features** — community partner spotlights
- **Program overviews** — general awareness and enrollment content

## Intake Form

Schools do not write questions from scratch. Canopy provides a set of pre-built form templates based on established intake patterns — modeled on the existing N&R Publications interview format — with one template per story type.

Each template includes:
- Pre-written questions covering the key story elements
- Optional photo/video upload
- Short consent acknowledgment

Schools can send a form link directly to the subject via email. The subject fills out the form on any device with no login required. The form link is unique to each story request and expires after submission.

## AI Content Generation

When a form is submitted, Canopy Stories automatically generates:

- **Blog post** (500–800 words) — fully written, publication-ready, with photo integrated
- **Social media posts** — platform-specific versions for Facebook, Instagram, LinkedIn, and X
- **Newsletter feature** (200–300 words) — formatted for direct use in Community Canopy newsletters
- **Press release** (400–600 words) — formatted for media distribution
- **Short video script** (15 seconds) — written for automated video production

AI generation uses the submitted form responses and uploaded photos as source material. Content is generated in one pass and available within minutes of form submission.

All AI-generated content is accessible and editable before publishing. Canopy staff can review and adjust any piece before it goes to the school.

## Video Generation

For each story, Canopy Stories automatically generates a 15-second short-form video:

- Vertical format (9:16) for Instagram Reels, Facebook Stories, and TikTok
- Dynamic text overlays with story highlights pulled from the submission
- Automated editing from uploaded photos
- Client branding (colors, logo)

Video generation runs as part of the automation pipeline after content is generated. The video is included in the content package delivered to the school.

Video generation is powered by the **JSON2Video API** at MVP.

## Content Package and Delivery

When all content and assets are generated, Canopy Stories bundles them into a downloadable package for the school:

- All written content files organized by channel (blog, social, newsletter, press release)
- Social graphics in platform-specific sizes
- Quote cards with pull quotes
- Generated video (15-second vertical)
- Original uploaded photo (optimized)
- Usage guide and posting schedule recommendations

The school downloads the package from their Canopy Stories section in the Canopy portal and publishes the content themselves — or Canopy handles publication as part of the managed service.

## Platform Integration

Canopy Stories connects to the rest of the Canopy platform:

- **Community Canopy** — newsletter feature content from a story can be used directly inside Community Canopy when composing a newsletter
- **Reach Canopy** — social posts generated for a story can be scheduled and published directly from Reach Canopy
- **PhotoVault** — uploaded photos from a story submission can be stored in PhotoVault as approved brand assets
- **Canopy Web** — blog posts can be published directly to the school's Canopy-powered website

These integrations make Canopy Stories the content production engine for the Canopy platform. A single story submission can populate content across every channel the school operates.

## Self-Serve vs. Managed Service

Canopy Stories supports two delivery modes from day one.

### Self-Serve

School staff log into the Canopy portal, enter Canopy Stories, and manage their own story production:
- Start a new story request by selecting a story type
- Choose or customize the intake form
- Send the form link to the subject
- Monitor submission status
- Review AI-generated content and edit if needed
- Download the content package
- Publish content themselves or hand it to their team

### Managed Service

School contacts Canopy instead of managing story production themselves. Canopy staff handle:
- Sending the intake form on behalf of the school
- Monitoring submissions
- Reviewing and editing AI-generated content
- Publishing content across channels (blog, social, newsletter)
- Monthly story volume commitments

The managed service is a paid add-on. It is visible in the portal as a service offering.

## Existing Reference Implementation

A working prototype of this product — the `Success Story Engine` — was built in Replit at:

`/references/replit/success-story-engine/`

This prototype includes:
- A complete PostgreSQL schema (Drizzle ORM)
- AI content generation via OpenAI GPT-4 for all channels
- Video generation via JSON2Video API (tested, working)
- Photo upload with Replit Object Storage
- Public intake form with shareable links
- Content packaging and download portal
- End-to-end pipeline tested: form → AI generation → packaging → delivery

The Replit prototype was built as an **internal Canopy tool** (operator-facing). The Canopy product version inverts this: school staff and their story subjects are the primary users, with Canopy operators having backstage access for managed service delivery.

The Replit prototype is a direct build reference for the Canopy Stories implementation.

## Connection to the Platform

Canopy Stories connects to the Canopy platform through the standard model:

- User authenticates through the Canopy portal
- Active workspace determines which story projects, forms, and packages are shown
- Product entitlement for `stories_canopy` must be `active` or `pilot` to launch
- Story content and assets are stored per workspace

## Canopy Staff Interface

Canopy staff need a way to:
- Create and manage story projects on behalf of any school (managed service)
- Access any workspace's story pipeline
- Review and edit AI-generated content before delivery
- Trigger packaging and notify the school when a story package is ready
- Publish content directly to Reach Canopy, Community Canopy, or Canopy Web on the school's behalf

This is addressed through Canopy's operator/platform-staff access, not through a separate admin app.

## MVP Workflow — Step by Step

1. School staff logs into Canopy portal and enters Canopy Stories
2. Starts a new story request: selects story type and enters the subject's name and email
3. System generates a shareable intake form link using the matching template
4. Staff sends the link to the subject (or Canopy Stories emails it automatically)
5. Subject opens the form on any device, answers questions, uploads a photo (optional), and submits
6. Canopy Stories triggers AI content generation automatically
7. All content is generated within minutes: blog, social posts, newsletter feature, press release, video
8. Staff receives a notification that the story is ready for review
9. Staff reviews each content piece, edits if needed, approves
10. Package is assembled and downloadable from the portal
11. Staff publishes content — either manually or by pushing directly to Reach Canopy / Community Canopy / Canopy Web

## MVP Scope

### In Scope

- Story request creation with story type selection
- Pre-built intake form templates (one per story type)
- Shareable form links (no login required for subjects)
- Photo upload in the intake form
- AI-generated content for all channels: blog, social (4 platforms), newsletter, press release
- 15-second short-form video generation (JSON2Video)
- Content review and editing before packaging
- Content package download (all formats)
- Pipeline status tracking (form sent → submitted → generating → ready)
- Notifications when a story is ready for review
- Integration handoffs to Community Canopy and Reach Canopy
- Managed service pathway visible in the portal
- Canopy staff can manage any school's story pipeline

### Out of Scope for MVP

- Self-serve form template creation or editing
- Automated email delivery of form links (staff copies and sends the link at MVP)
- Consent and release management beyond a basic acknowledgment
- Showcase / public-facing story archive (separate from the blog/social publish)
- Multi-language story forms or content generation
- Branded video generation with school logo and colors (plain branding at MVP)
- Analytics dashboard for story performance (that is Insights Canopy)
- Billing or plan enforcement logic

## MVP Success Criteria

Canopy Stories MVP succeeds if:

1. A Canopy staff member can start a story request, send a form link to a student, and receive AI-generated content within minutes of form submission
2. The content package includes a blog post, social posts, newsletter feature, and a 15-second video
3. A school staff member can start their own story request without Canopy's help
4. Generated content can be pushed directly into Community Canopy or Reach Canopy without copy-pasting
5. The portal dashboard card for Canopy Stories shows active story pipeline status and a "New Story" action
6. Canopy staff can manage stories on behalf of any school

## Summary

Canopy Stories automates the full success story production cycle that Canopy currently delivers manually. A student fills out a form, and minutes later the school has a blog post, four social media posts, a newsletter feature, a press release, and a 15-second video — all ready to publish. A working prototype of this pipeline already exists. The MVP is about wrapping it in the Canopy platform model, making it school-facing, and connecting its output to the other Canopy channels.
