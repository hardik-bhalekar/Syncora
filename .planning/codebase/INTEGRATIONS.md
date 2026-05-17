# External Integrations

## 1. Supabase PostgreSQL Database
- **Connection**: Managed via Prisma ORM (`DATABASE_URL`, `DIRECT_URL`) and `@supabase/ssr` for server-side client generation.
- **Purpose**: Persistent storage for user profiles, enterprise goals, milestones, and audit logs.

## 2. Spline 3D Runtime
- **Package**: `@splinetool/runtime`
- **Purpose**: Loads interactive, cinematic 3D scenes (Hero and Auth viewports) with programmatic event controls and variables.

## 3. CodeRabbit AI Code Review
- **CLI**: `@coderabbitai/cli` (`coderabbit review --agent`)
- **Purpose**: Automated pull request analysis, bug detection, and security auditing.

## 4. NextAuth (Auth.js) OAuth & Credentials
- **Providers**: Credentials provider (Bcrypt password hashing) + extensible OAuth provider support.
- **Adapter**: `@auth/prisma-adapter` connecting session tokens directly to the Supabase database.
