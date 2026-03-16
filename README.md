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
- For real delivery, set `EMAIL_MODE=resend`, configure `RESEND_API_KEY` and use a verified sender in `EMAIL_FROM`.
- Recommended production setup:
  - verify a dedicated subdomain such as `notify.dutyguild.ru` in Resend
  - set `EMAIL_FROM=noreply@notify.dutyguild.ru`
  - upload the API key with `npx wrangler secret put RESEND_API_KEY`
  - redeploy with `npx wrangler deploy`
- Login code requests now fail explicitly if production email is not configured, instead of pretending the message was sent.

## Recommended next implementation steps

1. Add a proper calendar view that merges cleaning cycles and game events.
2. Add member availability management so the balancer can avoid vacations and days off.
3. Add a feedback form in the UI and cycle completion flow.
4. Add a deploy script for `app.dutyguild.ru`.
