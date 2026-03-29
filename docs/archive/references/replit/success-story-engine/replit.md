# Success Stories Platform

## Overview
Automated content production platform for Akkedis Digital that streamlines success story creation for adult education institutions. The system competes with N&R Publications by automating the entire workflow from form distribution to deliverable packaging.

## Project Architecture

### Purpose
B2B SaaS platform that automates success story production:
1. Send customizable forms to clients (adult education institutions)
2. Client submits source information
3. AI automatically generates multi-channel content (blog, social, newsletter, press release)
4. System creates graphics and visual assets
5. Everything packaged and delivered ready for client use

### Technology Stack
- **Frontend**: React + Vite + Wouter + TailwindCSS
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Neon)
- **AI**: OpenAI GPT-4 for content generation
- **UI Components**: Shadcn/ui + Radix UI
- **State Management**: TanStack Query

### Design System
- Material Design 3 principles
- Inter font family
- Blue primary color (210 85% 45%)
- Automation-first visual language

## Database Schema

### Core Tables
1. **users** - Platform staff authentication
2. **clients** - Adult education institutions using the service
3. **projects** - Campaigns for each client (e.g., "Fall 2025 Stories")
4. **forms** - Customizable source collection forms
5. **submissions** - Client-submitted form data
6. **stories** - Individual success stories in production pipeline
7. **content** - AI-generated content for each story (blog, social, etc.)
8. **assets** - Graphics, videos, and visual materials
9. **packages** - Bundled deliverables for client download

### Story Pipeline Stages
- **form_sent** - Form sent to client, awaiting submission
- **submitted** - Client submitted form data
- **ai_processing** - AI generating content
- **asset_generation** - Creating graphics/videos
- **packaging** - Bundling deliverables
- **delivered** - Package ready for client access

### Story Types
- ESL - English as a Second Language
- HSD/GED - High School Diploma/GED
- CTE - Career Technical Education
- Employer - Employer partnerships
- Staff - Staff success stories
- Partner - Partner organizations
- Overview - Program overviews

## Recent Changes (Jan 2025)

### Architecture Redesign
- **Date**: January 2025
- **Change**: Pivoted from manual workflow tool to automated production pipeline
- **Reason**: Platform must compete with N&R Publications through automation, not just digitizing manual processes
- **Impact**: Complete redesign of database schema, user flows, and components

### Database Schema Update
- Created comprehensive schema supporting automated workflow
- All tables use varchar IDs with UUID generation
- Added proper relationships between clients → projects → forms → submissions → stories → content/assets → packages

## User Personas

### Internal Users (Akkedis Digital Staff)
- Create client projects
- Configure and send forms
- Monitor automation pipeline
- Review AI-generated content (when needed)
- Approve and deliver packages

### External Users (Adult Ed Institution Staff)
- Receive form links via email
- Submit success story source information
- Access client portal to download deliverables
- Use packaged content across channels

## Key Features

### Automation Pipeline
- Form submission triggers AI content generation
- Content approval triggers asset generation  
- Asset completion triggers packaging
- Package completion triggers client notification
- Real-time status tracking throughout

### Content Generation
AI automatically creates:
- Blog posts (500-800 words)
- Social media posts (Facebook, LinkedIn, Twitter/X, Instagram)
- Newsletter features (200-300 words)
- Press releases (400-600 words)
- Email templates
- **15-second video scripts** for automated video generation

### Asset Generation
System creates:
- Platform-specific social graphics (multiple sizes)
- Quote cards with pull quotes
- **Auto-generated 15-second videos** (9:16 vertical format for Instagram/Facebook Stories)
  - Dynamic text overlays with story highlights
  - Automated video editing from form data and photos
  - Background music and voiceover options
  - Client branding integration
- Branded templates using client colors/logos
- Photo optimization and cropping

### Package Delivery
Each package includes:
- Content files by channel (blog, social, newsletter, press release, email)
- Visual assets organized by platform
- Usage guide and best practices
- Posting schedule recommendations
- Original and optimized photos (if provided)

## Development Status (Updated: October 25, 2025)

### Completed  
✅ Database schema design with PostgreSQL (Neon)
✅ Design guidelines (Material Design 3, automation-first)
✅ OpenAI integration (Replit AI Integrations - GPT-5 model)
✅ **PostgreSQL database** - Full DbStorage implementation with Drizzle ORM
✅ **API routes** - RESTful endpoints with Zod validation and error handling
✅ **Project Management** - Create projects with client relationships, tested end-to-end
✅ **Project Deletion** - Delete protection with foreign key validation (prevents deletion if forms/stories/packages exist)
✅ **Form Builder** - 7 N&R Publications templates + custom form creation
✅ **Client Portal** - Public form submission at `/form/:formId`
✅ **Package Download Portal** - Package viewing at `/package/:packageId`
✅ **AI Content Generation** - Blog, 4x social (Facebook/Instagram/Twitter/LinkedIn), newsletter, press release
  - AI includes uploaded photos in generated content as markdown images
  - Content rendered with ReactMarkdown for proper image display
✅ **Automation Pipeline** - Fully tested end-to-end (form → content → package)
✅ **Photo Upload System** - Replit Object Storage integration with Uppy uploader
  - Public forms support photo uploads with drag-and-drop interface
  - Signed URL generation for secure direct-to-GCS uploads
  - Automatic URL normalization to permanent `/objects/` paths
  - Photos stored in submission.photoUrls, inherited by stories
  - Uploaded photos display on story cards in Stories page
  - Photos automatically embedded in AI-generated content
  - Markdown rendering converts image syntax to actual images
  - End-to-end tested: upload → storage → AI integration → display
✅ **Robust Error Handling** - Null-safe content generation, JSON parsing fallbacks, graceful delete failures
✅ **Video Generation** - **FULLY WORKING** JSON2Video integration
  - Automatic 15-second vertical videos (1080x1920, 9:16 aspect ratio)
  - Real-time status polling with detailed error logging
  - Pixel-based dimension system for JSON2Video API compatibility
  - Videos render in ~15 seconds and include story highlights
  - Graceful fallback to placeholders if API fails

### Ready for Production
✅ **End-to-end workflow tested**: Form submission → AI generation → Packaging → Delivery
✅ **Database persistence**: All data stored in PostgreSQL with proper relationships
✅ **Automation verified**: 10-15 minute turnaround achieved

### Next Steps
📋 Email notification system (notify clients when packages ready)
📋 Analytics dashboard (track submissions, generation times, download counts)
📋 Client branding customization (logos, colors in generated content)
📋 Multi-language support

## Competitive Analysis

### N&R Publications Workflow (Manual)
1. Interview scheduling
2. In-person/phone interviews
3. Photography sessions
4. Manual writing and editing
5. Design and layout
6. Print and digital delivery
7. Showcase website publication

### Our Automated Approach
1. Digital form submission (no scheduling needed)
2. AI content generation from form data
3. Automated asset creation
4. Instant package delivery
5. Ready-to-use across all channels
6. Faster, cheaper, more scalable

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Express session secret
- `OPENAI_API_KEY` - OpenAI API access (via Replit Integration)
- `VIDEO_API_KEY` - JSON2Video API key for video generation
- `VIDEO_API_PROVIDER` - Video provider ('json2video' or 'creatomate')
- `DEFAULT_OBJECT_STORAGE_BUCKET_ID` - Replit Object Storage bucket for photo uploads
- `PRIVATE_OBJECT_DIR` - Private directory path in object storage bucket
- `PUBLIC_OBJECT_SEARCH_PATHS` - Search paths for public objects

## Development Commands
- `npm run dev` - Start development server
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

## Notes
- Platform uses PostgreSQL (Neon) for persistent storage
- AI content generation uses Replit AI Integrations (GPT-5, billed to credits)
- Video generation uses JSON2Video API (15-second vertical videos, ~15 seconds render time)
- All timestamps use UTC
- Form templates based on N&R Publications interview format
- Package URLs expire after configurable period (default 90 days)
- Automation achieves 10-15 minute turnaround vs N&R's 1-2 weeks
