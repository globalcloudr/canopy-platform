# Canopy Auth And Invitations

Date: 2026-03-27

## Auth Today

Canopy uses real Supabase auth.

Current behavior:

- users sign in through `/sign-in`
- server routes establish cookie-backed portal sessions
- authenticated portal routes resolve the current user from those cookies
- sign-out clears the portal auth cookies

## Invite Sending

Provisioning can invite a workspace admin in two different ways:

- existing auth user
  - membership is created or reused directly
- new email
  - an invitation record is created in `workspace_admin_invitations`
  - Canopy attempts to send a Supabase invite email

Current branding direction:

- invite emails should present Canopy as the front door
- the shared Supabase project still handles delivery infrastructure

## Invite Resend

Older pending invites created before send-tracking was implemented are treated as resend candidates.

Current behavior:

- pending unsent rows show as needing resend
- operators can resend from the provisioning page
- resend updates invite delivery tracking on the invitation row

## Invite Acceptance

Current flow:

1. recipient opens the invite email
2. Supabase redirects into Canopy sign-in
3. Canopy detects invite tokens from the URL hash
4. Canopy completes auth and finalizes matching pending invitations
5. Canopy creates membership if needed
6. invitation is marked accepted
7. user is redirected into the invited workspace context

## What Is Still Missing

- fully seamless cross-domain login between Canopy and PhotoVault
- a fully custom Canopy invite-email system independent of shared Supabase auth email infrastructure
