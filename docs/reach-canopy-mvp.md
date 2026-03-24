# Reach Canopy MVP Definition

Date: 2026-03-23

## Purpose

Define `Reach Canopy` as the third MVP product inside the Canopy platform so it can be designed and built without ambiguity.

## What Reach Canopy Is

Reach Canopy is the social media posting and scheduling product inside Canopy.

It lets school staff write, schedule, and publish social media posts to their school's accounts — either themselves through the Canopy portal, or through Canopy as a managed service.

This product is grounded in a proven real-world workflow that Canopy already delivers for schools:
- Canopy meets with each school to understand their communication goals and audience
- Canopy creates a set of social media guidelines and branded post templates for the school
- Canopy builds a monthly content calendar with planned topics and posting schedule
- Posts are currently scheduled and published through Hootsuite on the school's behalf

Reach Canopy replaces Hootsuite as the scheduling tool and gives schools a Canopy-native interface to participate in — or take full ownership of — their social media program.

## Social Platforms in Scope

Reach Canopy MVP targets the social platforms adult education schools actively use:

- **Facebook** — primary platform for most schools; highest engagement with adult learners
- **Instagram** — growing platform for visual storytelling and student highlights
- **LinkedIn** — relevant for workforce development and continuing education programs
- **X (Twitter)** — lower priority but commonly present

Platform connections are managed per workspace. Each school connects their own social accounts through OAuth.

## Self-Serve vs. Managed Service

Reach Canopy supports two delivery modes from day one.

### Self-Serve

School staff log into the Canopy portal, enter Reach Canopy, and manage their own social presence:
- Write a new post using their school's guidelines and templates as a reference
- Attach an image or media file
- Select one or more target platforms
- Schedule a publish time or post immediately
- View their content calendar with upcoming and published posts
- Review basic engagement stats per post

### Managed Service

School contacts Canopy instead of managing social posting themselves. Canopy staff handle:
- Monthly content planning based on the school's calendar and program updates
- Post drafting and template application
- Image selection and formatting
- Scheduling and publishing via Reach Canopy on the school's behalf
- Monthly performance summary

The managed service includes the onboarding work that currently happens in the field — social media guidelines, branded templates, and the initial content calendar. These are created by Canopy at the start of the engagement and stored in the workspace for ongoing reference.

The managed service is a paid add-on. It is visible in the portal as a service offering, not a self-serve button.

## Social Media Guidelines and Templates

During onboarding, Canopy creates per-school:
- **Social media guidelines** — tone, topics, posting frequency, what to post vs. what not to post
- **Post templates** — structured content patterns for recurring post types (enrollment open, class spotlight, student story, event, holiday)

These are stored in the workspace and visible inside Reach Canopy. They serve as guardrails and starting points for school staff writing their own posts. For managed service clients, Canopy staff apply these templates when drafting content on the school's behalf.

Template creation and editing is a Canopy-managed setup step at MVP. Self-serve template editing is out of scope.

## PhotoVault Integration

School staff composing a post can open a media browser and select an approved photo directly from their PhotoVault library. The selected image attaches to the post without requiring a separate upload.

This integration is a significant differentiator: schools often struggle to find approved, on-brand images at posting time. Connecting Reach Canopy to PhotoVault solves this friction and makes the workflow faster.

The PhotoVault integration requires the workspace to have both `reach_canopy` and `photovault` entitlements active. If PhotoVault is not enabled, direct upload is the only media option.

## Content Calendar

Reach Canopy shows a content calendar view for the workspace:

- Scheduled posts by date
- Published posts by date
- Draft posts
- Platform filter

The calendar gives school staff a clear view of their upcoming content pipeline. Canopy staff managing multiple schools use the calendar to maintain posting consistency across their client roster.

## Posting Engine: Postiz

Reach Canopy uses **Postiz** as its underlying social scheduling engine for the MVP.

Postiz is an open-source social media management platform that supports multi-platform scheduling, OAuth-based account connections, and a content calendar. It is self-hostable and exposes an API for integration.

The Canopy portal provides the post composition and scheduling interface that school staff see. Canopy's backend passes posts and schedule instructions to Postiz via its API. Postiz handles the OAuth token storage, platform API calls, and delivery timing. Canopy reads back post status and engagement data from Postiz to display in the portal.

School users never see or interact with the Postiz interface. The Canopy portal is the only product surface.

If Postiz proves unsuitable as the platform scales, the integration layer should be designed cleanly enough to replace it without rebuilding the portal-facing features.

## Analytics

Reach Canopy shows basic engagement stats per post pulled from the social platform APIs via Postiz:

- Impressions
- Likes / reactions
- Comments
- Shares / reposts
- Link clicks (where available)

Per-platform breakdowns are shown where a post was published to more than one platform.

Over time, engagement data flows into Insights Canopy for cross-channel visibility alongside newsletter and web analytics.

## Dashboard Integration

The Reach Canopy dashboard card on the portal home shows:
- Next scheduled post date and platform
- Total posts published this month
- Quick action: "New Post"

This gives school staff a live pulse on their social activity without entering Reach Canopy.

## Connection to the Platform

Reach Canopy connects to the Canopy platform through the standard model:

- User authenticates through the Canopy portal
- Active workspace determines which social accounts, calendar, and posts are shown
- Product entitlement for `reach_canopy` must be `active` or `pilot` to launch
- Social account OAuth connections are stored per workspace
- PhotoVault media browser is available if `photovault` entitlement is also active

## Canopy Staff Interface

Canopy staff need a way to:
- Create and schedule posts on behalf of any school (managed service)
- Access any workspace's content calendar and post history
- Connect or reconnect social accounts on a school's behalf
- Create and update social media guidelines and post templates per workspace
- Review post analytics across the schools they manage

This is addressed through Canopy's operator/platform-staff access, not through a separate admin app.

## MVP Workflow — Step by Step

1. School staff logs into Canopy portal
2. Launches Reach Canopy from the dashboard
3. Sees their content calendar and recent post history
4. Clicks "New Post"
5. Writes post copy (optionally references their school's templates)
6. Attaches an image — direct upload or selects from PhotoVault if enabled
7. Selects one or more platforms to post to
8. Schedules a publish time or posts immediately
9. Views post status: scheduled, published, or failed
10. After publishing, views engagement stats per post

## MVP Scope

### In Scope

- Post composition with image attachment
- Multi-platform publishing (Facebook, Instagram, LinkedIn, X)
- Scheduled and immediate publishing
- Draft posts
- Content calendar view
- Basic per-post engagement stats
- OAuth-based social account connections per workspace
- Social media guidelines and post templates stored per workspace (Canopy-managed setup)
- PhotoVault media browser integration (when both products are enabled)
- Postiz as the backend scheduling engine
- Managed service pathway visible in the portal
- Canopy staff can manage posts on behalf of any school
- Dashboard card with activity summary and quick action

### Out of Scope for MVP

- Self-serve social media guidelines or template editing
- AI-assisted post writing or caption generation
- Hashtag research or recommendations
- Instagram Stories or Reels (feed posts only at MVP)
- TikTok or YouTube
- Advanced analytics dashboards (that is Insights Canopy)
- Multi-post campaign sequences
- Team approval workflows before publishing
- Competitor or keyword monitoring
- Billing or plan enforcement logic

## MVP Success Criteria

Reach Canopy MVP succeeds if:

1. A school staff member can log in and see their content calendar
2. They can write a post, attach an image (including from PhotoVault if enabled), and schedule or publish it to at least one platform
3. They can view engagement stats on a published post
4. Canopy staff can do all of the above on behalf of any school
5. The portal dashboard card shows the next scheduled post and a "New Post" action
6. Social account connections survive session resets and do not require re-authentication on every login

## Relationship to Community Canopy

Reach Canopy and Community Canopy are peer products that address different communication channels:

- **Community Canopy** — email newsletters sent to enrolled students and community contacts
- **Reach Canopy** — social media posts published to the school's public accounts

They share the same Canopy portal entry point, the same workspace context, and the same managed service model. Over time, Insights Canopy will unify their analytics into a single cross-channel view.

There is no hard dependency between the two products at MVP. A school can use one without the other.

## Summary

Reach Canopy turns a proven managed social media service into a self-serve Canopy product. It replaces Hootsuite with a clean Canopy-native interface, keeps the managed service path open for schools that prefer it, and connects to PhotoVault to remove the friction of finding approved images at posting time. Postiz provides the scheduling infrastructure at MVP, with the Canopy portal owning the school-facing product surface.
