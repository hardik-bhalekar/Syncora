# System Architecture

Syncora is structured as a layered Next.js application with clear boundaries between presentation, API validation, authorization, domain services, persistence, and asynchronous workflow processing.

```mermaid
flowchart TD
    subgraph Client["Client and Presentation"]
        App["Next.js App Router"]
        UI["Dashboard workspaces"]
        Galaxy["React Three Fiber goal galaxy"]
        Query["TanStack Query cache"]
        App --> UI
        App --> Galaxy
        UI --> Query
    end

    subgraph Security["API and Security Boundary"]
        Auth["NextAuth.js sessions"]
        Middleware["Route middleware"]
        Validation["Zod validators"]
        RateLimit["Redis-backed rate limits"]
        App --> Auth
        App --> Middleware
        App --> Validation
        Middleware --> RateLimit
    end

    subgraph Domain["Domain Services"]
        Goals["Goal service"]
        SharedGoals["Shared goal service"]
        Checkins["Check-in service"]
        Reports["Report service"]
        Escalations["Escalation service"]
        RBAC["RBAC and tenant context"]
        Validation --> Goals
        Validation --> SharedGoals
        Validation --> Checkins
        Validation --> Reports
        Validation --> Escalations
        Goals --> RBAC
        SharedGoals --> RBAC
        Checkins --> RBAC
        Reports --> RBAC
        Escalations --> RBAC
    end

    subgraph Data["Persistence and Events"]
        Prisma["Prisma ORM"]
        Postgres["PostgreSQL"]
        Audit["Audit log"]
        Events["Event bus"]
        Goals --> Prisma
        SharedGoals --> Prisma
        Checkins --> Prisma
        Reports --> Prisma
        Escalations --> Prisma
        Prisma --> Postgres
        Prisma --> Audit
        Goals --> Events
        Checkins --> Events
        Escalations --> Events
    end

    subgraph Async["Async Workflows and Integrations"]
        Workers["Background workers"]
        Teams["Microsoft Teams webhook"]
        Email["Email provider"]
        Intelligence["AI intelligence service"]
        Events --> Workers
        Workers --> Teams
        Workers --> Email
        Workers --> Intelligence
    end
```

## Notes

- Tenant isolation is enforced in service-layer access patterns and RBAC checks before mutations are committed.
- Goal submission rules are validated server-side: total weightage, minimum per-goal weightage, and maximum goals per sheet.
- Background workflow processing is decoupled from user-facing requests through event dispatch and worker functions.
- Audit logging records sensitive workflow transitions such as approvals, rejections, unlocks, and administrative actions.
