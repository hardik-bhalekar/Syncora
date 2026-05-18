# Syncora — Enterprise Goal Alignment & Workflow Orchestration Portal

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)
![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-v9-black?style=for-the-badge&logo=react)
![Prisma](https://img.shields.io/badge/Prisma_ORM-v6-2D3748?style=for-the-badge&logo=prisma)
![Postgres](https://img.shields.io/badge/Postgres_pgvector-336791?style=for-the-badge&logo=postgresql)
![Supabase](https://img.shields.io/badge/Supabase_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel_Deployed-000000?style=for-the-badge&logo=vercel)
![CI/CD Passing](https://img.shields.io/badge/CI%2FCD_Quality_Gates-Passing-brightgreen?style=for-the-badge&logo=githubactions)

---

## 🚀 Hackathon Final Submission Links

| Resource | Direct Link / Details |
| :--- | :--- |
| **Hosted Live Demo URL** | [https://syncora-3mmstahnc-hardikbhalekar10-6644s-projects.vercel.app/](https://syncora-3mmstahnc-hardikbhalekar10-6644s-projects.vercel.app/) |
| **GitHub Repository** | [https://github.com/hardik-bhalekar/Syncora](https://github.com/hardik-bhalekar/Syncora) |
| **Architecture Diagram** | Included below & exported as standalone artifact |
| **Final Submission PDF** | Generated in project root (`final_submission_document.pdf`) |

---

## 🔐 Seeded Demo Accounts (Ready for Judging)

To ensure judges can test all role flows instantly, the database is pre-seeded with active demo accounts across an enterprise organization (`Syncora Enterprise`).

| Role | Email | Password | Pre-seeded State & Data |
| :--- | :--- | :--- | :--- |
| **Employee 1** | `employee@syncora.com` | `Demo@123` | • 1 Approved Goal Sheet<br>• 1 Completed Q3 Check-in<br>• 1 Assigned Shared Goal |
| **Employee 2** | `employee2@syncora.com` | `Demo@123` | • 1 Pending Approval Goal Sheet (Submitted) |
| **Manager** | `manager@syncora.com` | `Demo@123` | • Direct Manager for Employee 1 & 2<br>• Owner of Shared Enterprise Goal |
| **Admin** | `admin@syncora.com` | `Demo@123` | • Full Tenant Admin access<br>• Audit Logs & Goal Unlocking capabilities |

> [!TIP]
> **Judges Demo Sequence:**
> 1. Log in as **Employee 1** (`employee@syncora.com`) to view an approved goal sheet and completed check-in.
> 2. Log in as **Manager** (`manager@syncora.com`) to review, edit, and approve Employee 2's pending goal sheet.
> 3. Log in as **Admin** (`admin@syncora.com`) to view audit logs, organization metrics, or unlock goal sheets.

---

## 🏛 System Architecture

Syncora operates on a fully decoupled, multi-layered enterprise architecture designed for maximum reliability, multi-tenant data isolation, and real-time responsiveness.

```mermaid
graph TD
    %% Client & Presentation Layer
    subgraph Client ["Client & Presentation Layer (Next.js App Router)"]
        UI[Next.js App Router Shells]
        R3F[React Three Fiber 3D Galaxy]
        FM[Framer Motion Spring Engine]
        TQ[TanStack Query Cache]
        UI --> R3F
        UI --> FM
        UI --> TQ
    end

    %% API Gateway & Auth Layer
    subgraph Gateway ["API Gateway & Security Layer"]
        NA[NextAuth.js OIDC / Azure Entra ID SSO]
        GW[API Gateway & HMAC Verifiers]
        RL[Upstash Redis Rate Limiter]
        ZOD[Zod Input Validation]
        
        UI -->|HTTP / REST| NA
        UI -->|Server Actions| ZOD
        GW --> RL
    end

    %% Application & Service Layer
    subgraph Services ["Application & Service Layer"]
        GS[Goal & Shared Goal Services]
        WS[Workflow Orchestration Service]
        CS[Check-In & Progress Service]
        ES[SLA Escalation Service]
        RBAC[RBAC & Tenant Context Resolver]
        CB[Circuit Breaker & Retries]
        
        ZOD --> GS
        ZOD --> WS
        ZOD --> CS
        ZOD --> ES
        GS --> RBAC
        WS --> RBAC
        CS --> RBAC
        ES --> RBAC
        WS --> CB
    end

    %% Data & Worker Layer
    subgraph DataLayer ["Data & Async Worker Layer"]
        PRISMA[Prisma ORM]
        PG[Supabase PostgreSQL + pgvector]
        REDIS[Upstash Redis Cache]
        CDC[Supabase Realtime CDC]
        INN[Inngest Async Background Workers]
        EB[Enterprise EventBus]
        
        GS --> PRISMA
        WS --> PRISMA
        CS --> PRISMA
        ES --> PRISMA
        PRISMA --> PG
        PRISMA --> REDIS
        PG -->|WAL Changes| CDC
        CDC -->|WebSockets| TQ
        WS --> EB
        EB --> INN
    end

    %% External Enterprise Integrations
    subgraph Integrations ["External Enterprise Integrations"]
        TEAMS[Microsoft Teams Webhooks]
        EMAIL[Resend / SendGrid Automation]
        AI[OpenAI / AI Intelligence Mesh]
        SIM[Global Telemetry Inspector]
        
        CB -->|Adaptive Cards v1.4| TEAMS
        CB -->|HTML Notifications| EMAIL
        INN --> AI
        CB -.->|Simulated Fallback| SIM
    end

    %% Styling definitions
    classDef client fill:#1E293B,stroke:#38BDF8,stroke-width:2px,color:#fff;
    classDef gateway fill:#0F172A,stroke:#F59E0B,stroke-width:2px,color:#fff;
    classDef services fill:#1e1b4b,stroke:#818CF8,stroke-width:2px,color:#fff;
    classDef data fill:#052e16,stroke:#34D399,stroke-width:2px,color:#fff;
    classDef integrations fill:#4c0519,stroke:#FB7185,stroke-width:2px,color:#fff;

    class UI,R3F,FM,TQ client;
    class NA,GW,RL,ZOD gateway;
    class GS,WS,CS,ES,RBAC,CB services;
    class PRISMA,PG,REDIS,CDC,INN,EB data;
    class TEAMS,EMAIL,AI,SIM integrations;
```

---

## 🌟 Core Enterprise Capabilities & Validations

### 🏢 1. Multi-Tenant Core & Zero-Trust RBAC
* **Strict Tenant Isolation:** Every database entity (`User`, `GoalSheet`, `Goal`, `SharedGoal`, `CheckIn`, `Escalation`, `AuditLog`) is strictly partitioned by `tenantId`. Database interactions are encapsulated inside tenant-scoped transaction blocks.
* **4-Tier Hierarchical RBAC:** Fine-grained role enforcement (`EMPLOYEE`, `MANAGER`, `ADMIN`, `SUPER_ADMIN`) across UI navigation shells, API route handlers, and database mutations.
* **Enterprise SSO / OIDC:** Seamless authentication via Microsoft Azure Entra ID, Google, and secure credentials, supporting verified automatic account linking.

### 🎯 2. Mandatory Server-Side Validations (BRD Compliant)
* **Total Weightage:** Exact cumulative weightage enforcement ($\sum \text{Weightage} = 100\%$) evaluated server-side at submission time.
* **Max Goals:** Strict cap of $Goals_{max} = 8$ per employee goal sheet.
* **Minimum Goal Weightage:** Every individual goal must satisfy $\text{Weightage}_{goal} \geq 10\%$.

### 🌌 3. Cinematic UI & 3D "Goal Galaxy"
* **Editorial Design System:** Built with layered graphite depth (`#111111`, `#1a1a1a`), modern typography (Inter/Geist), and Fibonacci spacing tokens (`0.5rem`, `1rem`, `1.5rem`, `2.5rem`, `4rem`).
* **React Three Fiber 3D Canvas:** An interactive, cinematic 3D visualization mapping organizational hierarchy and KPI alignment, fortified with WebGL context loss recovery and GPU memory disposal guards.
* **Calm Spring Motion:** Smooth, CPU-optimized Framer Motion spring physics (`stiffness: 100`, `damping: 15`).

### ⚡ 4. Real-Time CDC & SLA Escalation Engine
* **Supabase Realtime CDC:** Subscribes to Postgres Change Data Capture (CDC) to reconcile TanStack Query client caches instantly without expensive full-page refetches.
* **Automated Escalation Workers:** Inngest background workers monitor check-in progress thresholds (<70%) and submission deadlines, triggering multi-level escalations (`MANAGER`, `HR`, `EXECUTIVE`).
* **Circuit Breaker Protected Webhooks:** Dispatches Microsoft Teams Adaptive Cards (v1.4) and automated transactional emails (Resend/SendGrid) wrapped in Circuit Breakers with exponential backoff retries and in-memory simulated fallbacks.

---

## 🎁 High-Impact Bonus Features Implemented

1. **Microsoft Azure Entra ID Login:** Enterprise-grade single sign-on integration configured via NextAuth providers.
2. **Microsoft Teams Webhook Notifications:** Dispatches rich Adaptive Cards (v1.4) directly to Teams channels for critical workflow events (e.g., `"Employee submitted goals"`, `"Manager approval pending"`).
3. **Executive Analytics Dashboard:** Visualizes organization-wide completion percentages, QoQ performance trajectories, and goal distribution across thrust areas.

---

## 🛠 Quick Start & Local Development

### Prerequisites
* Node.js 20.x+
* Supabase PostgreSQL instance

### 1. Installation
```bash
git clone https://github.com/hardik-bhalekar/Syncora.git
cd Syncora
npm install
```

### 2. Environment Configuration
Create a local environment file (`.env`):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/syncora_db?schema=public"
NEXTAUTH_SECRET="enterprise-super-secret-key-2026"
NEXTAUTH_URL="http://localhost:3000"
UPSTASH_REDIS_REST_URL="https://mock-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="mock-token"
```

### 3. Database Setup & Seeding
Deploy Prisma migrations and seed the database with baseline enterprise credentials:
```bash
npx prisma migrate deploy
npm run seed
```

### 4. Running the Application
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Production Deployment (Vercel)

For step-by-step instructions on configuring production environment variables, Supabase connections, NextAuth secrets, Azure AD SSO, and running post-deployment Prisma migrations on Vercel, please see the complete [Vercel Deployment ENV Setup Guide](file:///c:/Users/User/Documents/GitHub/goal-sync-portal/VERCEL_DEPLOYMENT.md).

---

## 📜 License

Syncora is proprietary enterprise software. All rights reserved.
