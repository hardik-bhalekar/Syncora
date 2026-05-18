# Syncora

Enterprise goal alignment and workflow orchestration portal built with Next.js, Prisma, PostgreSQL, RBAC, real-time workflow telemetry, and automated escalation flows.

Syncora helps organizations replace static annual goal tracking with governed quarterly planning, manager approval workflows, shared goals, check-ins, audit trails, and executive visibility.

## Live Demo

| Resource | Link |
| :--- | :--- |
| Production app | https://syncora-3mmstahnc-hardikbhalekar10-6644s-projects.vercel.app/ |
| Architecture | [docs/architecture/system-architecture.md](docs/architecture/system-architecture.md) |
| Deployment guide | [docs/deployment/vercel.md](docs/deployment/vercel.md) |
| Supporting submission PDF | [docs/submission/syncora-submission.pdf](docs/submission/syncora-submission.pdf) |
| User story coverage | [docs/user-stories/goal-sync-portal.json](docs/user-stories/goal-sync-portal.json) |

## Demo Accounts

The seed data creates a demo tenant named `Syncora Enterprise`.

| Role | Email | Password | Demo state |
| :--- | :--- | :--- | :--- |
| Employee | `employee@syncora.com` | `Demo@123` | Approved goal sheet, completed check-in, assigned shared goal |
| Employee | `employee2@syncora.com` | `Demo@123` | Submitted goal sheet pending manager review |
| Manager | `manager@syncora.com` | `Demo@123` | Team review queue and shared goal ownership |
| Admin | `admin@syncora.com` | `Demo@123` | Tenant administration, audit logs, goal unlocking |

Recommended walkthrough:

1. Sign in as `employee@syncora.com` to inspect approved goals and check-in progress.
2. Sign in as `manager@syncora.com` to review submitted goals and manage team execution.
3. Sign in as `admin@syncora.com` to inspect tenant-level controls and audit visibility.

## Core Capabilities

- Multi-tenant data model with strict tenant scoping across users, goals, check-ins, shared goals, escalations, and audit logs.
- Role-based access control for employee, manager, admin, and super-admin workflows.
- Goal sheet validation for total weightage, per-goal minimums, and maximum goal count.
- Manager approval, rejection, unlock, and comment workflows.
- Quarterly check-ins with planned versus actual achievement tracking.
- Shared goals for cross-team alignment.
- Audit logging for sensitive state transitions.
- Realtime reconciliation and workflow telemetry surfaces.
- Escalation workers for progress and submission threshold monitoring.

## Architecture

The system architecture is maintained in [docs/architecture/system-architecture.md](docs/architecture/system-architecture.md). It covers the presentation layer, API/security boundary, service layer, persistence layer, async workers, and external integrations.

## Tech Stack

| Area | Technology |
| :--- | :--- |
| App framework | Next.js App Router, React |
| UI | Tailwind CSS, Framer Motion, React Three Fiber |
| Auth | NextAuth.js, credentials auth, OAuth/OIDC-ready providers |
| Data | Prisma, PostgreSQL, Supabase-compatible schema |
| Realtime/cache | Supabase Realtime patterns, TanStack Query, Upstash Redis |
| Validation | Zod |
| Workers/integrations | Inngest-style worker functions, Teams/email notification services |
| Tests | Node test runner via `tsx --test` |

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL database

### Setup

```bash
npm install
cp .env.example .env
npx prisma migrate deploy
npm run seed
npm run dev
```

Open http://localhost:3000.

### Useful Commands

```bash
npm run dev
npm run build
npm run lint
npm test
npm run user-stories:verify
```

## Documentation

- [System architecture](docs/architecture/system-architecture.md)
- [Vercel deployment guide](docs/deployment/vercel.md)
- [Supporting submission PDF](docs/submission/syncora-submission.pdf)
- [User story coverage](docs/user-stories/goal-sync-portal.json)
- [Security policy](SECURITY.md)
- [Contributing guide](CONTRIBUTING.md)

## License

See [LICENSE](LICENSE).
