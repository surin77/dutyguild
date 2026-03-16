# Duty Guild

Closed office-only duty roster for cleaning cycles, board-game scheduling and team feedback.

## What is already implemented

- Cloudflare Worker backend with D1 persistence
- Static frontend in a DnD-flavored visual shell
- Invite-only email auth with one-time codes and secure sessions
- Admin bootstrapping through `ADMIN_BOOTSTRAP_EMAILS`
- Admin tools to approve members, add board-game events and generate the next cleaning cycle
- Fair cycle generation that tries not to repeat the same assignees and avoids game-night dates
- Daily cron hook for cleanup and same-day reminder emails

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a D1 database:

   ```bash
   npx wrangler d1 create dutyguild
   ```

3. Put the returned `database_id` into [wrangler.jsonc](/Users/sa/Documents/dutyguild/wrangler.jsonc).

4. Copy `.dev.vars.example` to `.dev.vars` and fill at least:

   - `ADMIN_BOOTSTRAP_EMAILS`
   - `APP_SECRET`
   - `AUTH_DEBUG_CODES=true` for local development

5. Apply migrations locally:

   ```bash
   npm run db:apply:local
   ```

6. Start the app:

   ```bash
   npm run dev
   ```

## Email delivery

- Default local mode is `EMAIL_MODE=stub`: emails are logged, and debug codes can be returned in the API response.
- Production delivery now uses `Cloudflare Email Routing + Send Email from Workers`.
- Recommended production setup:
  - enable Email Routing for a dedicated subdomain such as `notify.dutyguild.ru`
  - keep the main domain mailboxes on your existing provider if needed
  - add each teammate email as a verified destination address in Email Routing
  - set `EMAIL_FROM=noreply@notify.dutyguild.ru`
  - redeploy with `npx wrangler deploy`
- Login code requests now fail explicitly if production email is not configured, instead of pretending the message was sent.

## Recommended next implementation steps

1. Add a proper calendar view that merges cleaning cycles and game events.
2. Add member availability management so the balancer can avoid vacations and days off.
3. Add a feedback form in the UI and cycle completion flow.
4. Add a deploy script for `app.dutyguild.ru`.
