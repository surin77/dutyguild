# Duty Guild

Duty Guild is a closed office-only duty roster for cleaning cycles, board-game scheduling and team feedback. The project is now prepared to run on a regular Kubernetes cluster instead of Cloudflare.

## Current stack

- Node.js HTTP server with the existing fetch-style application logic
- PostgreSQL for persistence
- SMTP delivery for login codes and reminders
- Static frontend in a DnD-inspired visual shell
- Kubernetes manifests for `k3s + Traefik`

## Environment

Copy [.env.example](/Users/sa/Documents/dutyguild/.env.example) to `.env` and fill at least:

- `DATABASE_URL`
- `APP_SECRET`
- `ADMIN_BOOTSTRAP_EMAILS`
- `EMAIL_MODE=smtp`
- `SMTP_HOST=smtp.mail.ru`
- `SMTP_PORT=465`
- `SMTP_SECURE=true`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `EMAIL_FROM`

For local development you can also use:

- `EMAIL_MODE=stub`
- `AUTH_DEBUG_CODES=true`

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start PostgreSQL locally and provide `DATABASE_URL`.

3. Apply PostgreSQL migrations:

   ```bash
   npm run migrate:pg
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

5. Run the scheduled daily tasks manually when needed:

   ```bash
   npm run scheduled
   ```

## Container image

Build the application image with:

```bash
docker build -t dutyguild:local .
```

## Kubernetes manifests

The [k8s](/Users/sa/Documents/dutyguild/k8s) directory contains a simple baseline for `k3s + Traefik`:

- `namespace.yaml`
- PostgreSQL `Service` + `StatefulSet`
- app `Deployment` + `Service`
- `Ingress` for `dutyguild.ru`
- one-off migration `Job`
- daily scheduled `CronJob`

Before applying them:

1. Replace the example secrets in:
   - [k8s/app-secret.example.yaml](/Users/sa/Documents/dutyguild/k8s/app-secret.example.yaml)
   - [k8s/postgres-secret.example.yaml](/Users/sa/Documents/dutyguild/k8s/postgres-secret.example.yaml)
2. Replace the image reference `ghcr.io/surin77/dutyguild:latest` with your real image.
3. Create or provision the TLS secret `dutyguild-tls` for `dutyguild.ru`.

Suggested apply order:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres-secret.example.yaml
kubectl apply -f k8s/postgres-service.yaml
kubectl apply -f k8s/postgres-statefulset.yaml
kubectl apply -f k8s/app-configmap.yaml
kubectl apply -f k8s/app-secret.example.yaml
kubectl apply -f k8s/migrate-job.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/cronjob.yaml
```

## What is already implemented

- Invite-only email auth with one-time codes and secure sessions
- Admin bootstrapping through `ADMIN_BOOTSTRAP_EMAILS`
- Admin tools to approve members, add game events and generate the next cleaning cycle
- Fair cycle generation that tries not to repeat the same assignees and avoids game-night dates
- Daily cleanup and same-day reminder flow
- DnD-flavored Russian UI with ranks and guild language
