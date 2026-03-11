# DevOps Setup Guide (Staging + Production)

## 1) Branch Strategy

- `main` → production releases
- `develop` → staging releases
- `feature/*` → development work, merged into `develop` via PR

Recommended merge flow:

1. `feature/*` → PR into `develop`
2. `develop` validated and deployed to staging
3. PR from `develop` → `main`
4. `main` deploys to production

---

## 2) GitHub Environments

Create two environments in GitHub:

- `staging`
- `production`

Repo → Settings → Environments → New environment

For `production`, enable required reviewers for manual approval.

---

## 3) Required Secrets

### Staging environment secrets

- `RENDER_DEPLOY_HOOK_BACKEND_STAGING`
- `VERCEL_DEPLOY_HOOK_STAGING`

### Production environment secrets

- `RENDER_DEPLOY_HOOK_BACKEND_PROD`
- `VERCEL_DEPLOY_HOOK_PROD`

> Add them under the matching GitHub Environment (not only repository-wide secrets).

---

## 4) How to get Render deploy hook URL

1. Open Render Dashboard
2. Select your backend service (create two services: staging + production)
3. Go to **Settings**
4. Find **Deploy Hook** section
5. Click **Create Deploy Hook**
6. Copy the generated webhook URL
7. Save it as:
   - staging: `RENDER_DEPLOY_HOOK_BACKEND_STAGING`
   - production: `RENDER_DEPLOY_HOOK_BACKEND_PROD`

---

## 5) How to get Vercel deploy hook URL

1. Open Vercel Dashboard
2. Open your frontend project
3. Go to **Settings** → **Git** → **Deploy Hooks**
4. Create hook for branch:
   - `develop` for staging
   - `main` for production
5. Copy each URL
6. Save as:
   - staging: `VERCEL_DEPLOY_HOOK_STAGING`
   - production: `VERCEL_DEPLOY_HOOK_PROD`

---

## 6) Environment Variables split

Set separate values for staging and production in both Render and Vercel:

- API URL (`VITE_EASYSHOP_BASE_URL`)
- `JWT_SECRET`
- Paystack keys (`PAYSTACK_SECRET_KEY`)
- Spreadsheet IDs / AWS buckets
- `FRONTEND_URL` for callback URLs

Never share production secrets with staging.

---

## 7) Workflows added

- `.github/workflows/ci.yml`
- `.github/workflows/security.yml`
- `.github/workflows/deploy-staging.yml`
- `.github/workflows/deploy-production.yml`
- `.github/dependabot.yml`

---

## 8) Hiring-grade checklist implemented

- CI for frontend/backend builds and tests
- Dependency/security audit workflow
- Dependabot for dependency updates
- Deploy automation for staging/production
- Health endpoints (`/health`, `/ready`)
- Backend smoke test script

Next recommended additions:

- Add ESLint + Prettier in frontend and backend
- Add unit/integration tests for order/payment controllers
- Add error tracking (Sentry)
- Add uptime checks (UptimeRobot/Better Stack)
- Add branch protection rules requiring CI + reviews
