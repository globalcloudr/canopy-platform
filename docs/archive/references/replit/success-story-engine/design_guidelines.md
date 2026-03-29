# Success Stories Platform - Design Guidelines

## Platform Overview

**Product Type**: B2B SaaS Automated Content Production Pipeline  
**Target Users**: Akkedis Digital staff managing client projects  
**End Clients**: Adult education institutions (adult schools, community colleges)

**Core Value Proposition**: Automate the complete production of success story packages that compete with and exceed N&R Publications' offerings through AI-powered content generation and streamlined workflows.

---

## Design Approach

**Selected System**: Material Design 3 with workflow automation focus

**Rationale**: This is a B2B production automation platform requiring clear project management, automated pipeline visualization, and professional package delivery. The design must support both the internal team managing projects and external clients accessing their deliverables.

**Core Principles**:
- **Automation visibility**: Show the automated process clearly at each stage
- **Client-first packaging**: Everything generated should be ready for client use
- **Production pipeline clarity**: Track multiple projects through automated stages
- **Professional credibility**: Build trust through polished deliverables and reliable automation

---

## User Journey & Key Workflows

### Internal Team (Akkedis Digital Staff)

1. **Project Setup**
   - Create new client project with basic info (institution name, contact, scope)
   - Configure project parameters (number of stories, types needed, deadline)
   - Generate and customize form template for this project

2. **Form Distribution**
   - System generates unique form link for client
   - Send link via email or share directly
   - Track form submission status

3. **Automated Processing**
   - Monitor forms as they're submitted by client
   - Watch automated pipeline progress through stages
   - Review and approve AI-generated content if needed
   - Trigger asset generation (graphics, videos)

4. **Package Delivery**
   - Review complete deliverable package
   - Send package to client with access portal
   - Track client downloads and usage

### External Client (Adult Ed Institution)

1. **Form Submission**
   - Receive unique link to source collection form
   - Fill out form with student/staff/partner information
   - Submit form back to Akkedis Digital

2. **Package Access**
   - Receive notification when package is ready
   - Access client portal with unique link
   - Download all deliverables organized by channel
   - Access usage instructions and best practices

---

## Typography

**Font Families**:
- Primary: Inter (headings, UI elements, body text)
- Monospace: JetBrains Mono (for technical content, form IDs)

**Hierarchy**:
- H1: 32px/40px, Semi-Bold (Dashboard titles, main section headers)
- H2: 24px/32px, Semi-Bold (Project headers, section titles)
- H3: 18px/24px, Medium (Card titles, subsection headers)
- H4: 16px/24px, Medium (Form labels, pipeline stage names)
- Body: 15px/24px, Regular (Primary content, descriptions)
- Small: 13px/20px, Regular (Metadata, helper text, timestamps)
- Tiny: 11px/16px, Medium (Labels, badges, status indicators)

---

## Color System

**Primary (Blue)**: Used for automation indicators, primary actions, links
- Primary: 210 85% 45%
- Primary Hover: 210 85% 40%
- Primary Active: 210 85% 35%

**Success (Green)**: Completed stages, published content, successful automation
- Success: 145 65% 45%

**Warning (Amber)**: Pending reviews, awaiting client input
- Warning: 45 90% 55%

**Error (Red)**: Failed automation, missing required info
- Error: 0 70% 50%

**Pipeline Stages**:
- Planning: Blue 210 85% 45%
- In Progress: Purple 265 70% 50%
- AI Generation: Cyan 190 85% 45%
- Review: Amber 45 90% 55%
- Packaging: Orange 25 90% 50%
- Delivered: Green 145 65% 45%

**Story Types**:
- ESL: Blue 210 70% 50%
- HSD/GED: Green 145 60% 45%
- CTE: Purple 265 65% 50%
- Employer: Orange 25 85% 50%
- Staff: Pink 330 70% 50%
- Partner: Teal 175 70% 45%
- Overview: Gray 220 10% 40%

---

## Layout System

**Spacing Primitives**: Tailwind units of 1, 2, 3, 4, 6, 8, 12, 16, 20, 24

**Common Patterns**:
- Card padding: p-6 (24px)
- Section spacing: space-y-8 (32px between major sections)
- Form field spacing: space-y-4 (16px between fields)
- Page container: max-w-7xl mx-auto px-6

**Grid System**:
- Dashboard: 12-column grid with flexible widths
- Project grid: 1/2/3 column responsive (mobile/tablet/desktop)
- Pipeline board: Horizontal scroll with fixed-width columns

---

## Key Components

### Project Management

**Project Card**:
- Institution name (title)
- Project scope description
- Story count and types
- Status badge (Planning, Active, Packaging, Delivered)
- Deadline date
- Form submission progress (e.g., "8 of 12 forms submitted")
- Quick actions menu (View, Edit, Archive)

**Automation Pipeline Board**:
- Horizontal stages: Form Sent → Submitted → AI Processing → Asset Generation → Packaging → Delivered
- Story cards move through stages automatically
- Each card shows: Story title, subject name, type badge, current status
- Stage completion indicators
- Manual override/retry options for failed automations

**Stats Dashboard Cards**:
- Active Projects
- Forms Submitted This Week
- Stories In Production
- Packages Delivered This Month
- Average Processing Time
- Client Satisfaction Score (if applicable)

### Form System

**Form Template Builder** (Internal):
- Drag-and-drop field builder
- Pre-built templates for each story type (ESL, CTE, etc.)
- Custom questions specific to project
- Conditional logic (show field X if answer to field Y is Z)
- Preview mode to see client-facing view

**Client-Facing Form**:
- Clean, simple single-page or multi-step design
- Progress indicator
- Auto-save to prevent data loss
- Help text and examples for each field
- File upload for photos if client has them
- Submission confirmation with reference number

### Content Generation

**AI Content Generator Panel**:
- Automatic trigger when form is submitted
- Show generation progress for each channel:
  - Blog post (500-800 words)
  - Social media posts (Facebook, LinkedIn, Twitter/X, Instagram)
  - Newsletter feature (200-300 words)
  - Press release (400-600 words)
  - Email template
- Regenerate option if content needs adjustment
- Tone/style presets based on client preferences
- Approval workflow before packaging

**Asset Generator Panel**:
- Social media graphics (multiple sizes for each platform)
- Quote cards with pull quotes from story
- Infographics (if data is available)
- **Auto-generated videos** (15-second social media videos in 9:16 format)
  - Vertical format optimized for Instagram Stories/Reels and Facebook Stories
  - Automated video creation from story content
  - Dynamic text overlays with key quotes
  - Background music/voiceover
  - Client branding and logo integration
- Photo editing/enhancement suggestions
- Branded templates using client's colors/logos

### Package Delivery

**Package Overview**:
- All deliverables organized by channel
- Download all as ZIP
- Individual file downloads
- Preview each asset
- Usage instructions for each channel
- Best practices guide
- Analytics tracking (if client uses platform analytics)

**Client Portal** (External):
- Simple authentication (magic link or project code)
- Project overview
- Package download area
- Support/contact options
- Request revisions option
- Access to previous packages if multiple campaigns

### Status & Notifications

**Status Indicators**:
- Real-time automation status (Processing, Complete, Failed, Pending Review)
- Progress bars for multi-stage processes
- Estimated completion time
- Error messages with clear next steps

**Notification Center**:
- Form submissions received
- Content generation complete
- Packages ready for delivery
- Client accessed package
- Review needed for flagged content

---

## Page-Specific Layouts

### Dashboard (Internal)
- Stats overview cards (6-column grid: Active Projects, Forms Submitted, In Production, Delivered, Avg Time, Satisfaction)
- Automation pipeline board showing all active stories
- Recent activity feed
- Quick create project button

### Projects Page (Internal)
- List/grid of all client projects
- Filter by status, deadline, client
- Search by institution name
- Sort by various criteria
- Bulk actions (archive, export)

### Project Detail Page (Internal)
- Project header (client name, dates, scope)
- Tabs: Overview, Forms, Content, Assets, Package, Settings
- Overview: Pipeline board for this project's stories
- Forms: Track submission status, resend links
- Content: Review AI-generated content
- Assets: Preview all generated graphics/videos
- Package: Final package preview and delivery
- Settings: Edit project parameters, deadlines

### Form Builder (Internal)
- Template selection or start from scratch
- Field library on left (drag to add)
- Form preview in center
- Field settings on right
- Save as template option
- Generate shareable link

### Client Portal (External)
- Simple, clean design
- Institution branding (optional)
- Package list (if multiple campaigns)
- Current package downloads organized by channel
- Help/support contact
- Feedback form

### Story Creator (Internal - Manual Override)
- Used only when automation needs human intervention
- Form data review
- Content editor with AI suggestions
- Asset preview and adjustment
- Manual progression through pipeline

---

## Automation & AI Indicators

**Visual Language for Automation**:
- Sparkle icon for AI-generated content
- Gear/cog icon for automated processes
- Checkmark in circle for completed automation
- Warning triangle for needs human review
- Clock for scheduled/queued processes

**Status Colors**:
- Automating: Blue (pulsing animation)
- Complete: Green (solid)
- Needs Review: Amber (solid)
- Failed: Red (solid)
- Queued: Gray (solid)

---

## Deliverable Package Structure

Each package contains:

**Content Files**:
- `/blog/` - Full blog post in .txt, .docx, .html
- `/social/` - Platform-specific posts in .txt
- `/newsletter/` - Newsletter feature in .txt, .html
- `/press-release/` - Press release in .txt, .docx
- `/email/` - Email template in .html

**Visual Assets**:
- `/graphics/facebook/` - Facebook post graphics (multiple versions)
- `/graphics/linkedin/` - LinkedIn post graphics
- `/graphics/instagram/` - Instagram post graphics
- `/graphics/twitter/` - Twitter/X post graphics
- `/graphics/quotes/` - Quote card graphics
- `/graphics/general/` - Generic social graphics
- `/videos/` - Auto-generated 15-second videos
  - `story-video-vertical.mp4` - 9:16 format for Instagram/Facebook Stories
  - `story-video-thumbnail.jpg` - Video thumbnail preview
  - `story-video-captions.srt` - Subtitle/caption file

**Supporting Materials**:
- `usage-guide.pdf` - How to use each deliverable
- `best-practices.pdf` - Channel-specific tips
- `tracking-links.txt` - Suggested UTM parameters
- `posting-schedule.txt` - Recommended posting timeline

**Photos** (if provided by client or shot by photographer):
- `/photos/originals/` - High-res originals
- `/photos/web/` - Web-optimized versions
- `/photos/social/` - Social-cropped versions

---

## Accessibility & Interaction

- Focus indicators: 2px offset ring on all interactive elements
- Keyboard navigation: Tab order follows visual hierarchy
- Screen reader labels on icon-only buttons
- Minimum touch target: 44x44px for mobile
- Form validation: Inline with clear error messages
- Loading states: Skeleton screens for content, progress indicators for automation
- Success confirmations: Toast notifications for completed actions

---

## Mobile Considerations

**Internal Tool (Akkedis Staff)**:
- Desktop-first design (primary use case)
- Responsive for tablet review/approval on the go
- Mobile: View-only for checking status

**Client Portal (External)**:
- Fully responsive for form submission on any device
- Mobile-optimized download experience
- Simple navigation for package access

---

## Technical Implementation Notes

**Automation Triggers**:
- Form submission triggers AI content generation
- Content approval triggers asset generation
- Asset completion triggers packaging
- Package completion triggers client notification

**AI Integration**:
- OpenAI GPT-4 for content generation
- Template-based prompts for consistency
- Style guides loaded per client
- Review/approval gates before delivery

**Storage & Delivery**:
- Cloud storage for generated packages
- Secure download links with expiration
- Version control for content iterations
- Archive completed projects after 1 year

---

## Brand & Voice

**Internal Tool Voice**: 
- Professional, efficient, action-oriented
- "Project created successfully"
- "Content generation in progress"
- "Ready for delivery"

**Client-Facing Voice**:
- Friendly, supportive, educational
- "Thanks for submitting your story!"
- "Your success story package is ready"
- "Here's how to make the most of your content"

**Content Generation Voice** (for stories):
- Inspirational yet authentic
- Focus on student/staff journey and transformation
- Specific details and quotes
- Positive but not overly promotional
- Accessible to general audience (no jargon)
