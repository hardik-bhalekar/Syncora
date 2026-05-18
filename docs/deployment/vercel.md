# Vercel Deployment Guide

This guide lists the production environment variables and deployment steps needed to run Syncora on Vercel.

## Required Variables

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="generated-secret"
NEXTAUTH_URL="https://your-production-domain.vercel.app"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
```

## Optional Variables

```env
GITHUB_ID="github-oauth-client-id"
GITHUB_SECRET="github-oauth-client-secret"
AZURE_AD_CLIENT_ID="azure-client-id"
AZURE_AD_CLIENT_SECRET="azure-client-secret"
AZURE_AD_TENANT_ID="azure-tenant-id"
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
TEAMS_WEBHOOK_URL="https://..."
RESEND_API_KEY="re_..."
```

## Setup Steps

1. Create or select the Vercel project.
2. Add the required environment variables under Project Settings > Environment Variables.
3. Configure optional OAuth and notification integrations if they are enabled for the deployment.
4. Redeploy the project after changing environment variables.
5. Run production migrations against the configured database:

```bash
npx prisma migrate deploy
```

6. Seed demo data when needed:

```bash
npm run seed
```

## OAuth Callback URLs

Use the exact production domain with no trailing slash.

```text
https://your-production-domain.vercel.app/api/auth/callback/github
https://your-production-domain.vercel.app/api/auth/callback/azure-ad
```

## Production Stack

| Service | Purpose |
| :--- | :--- |
| Vercel | Next.js hosting and serverless runtime |
| PostgreSQL or Supabase | Primary relational database |
| NextAuth.js | Authentication and session management |
| Upstash Redis | Optional rate limiting and cache support |
| Teams or email provider | Optional workflow notifications |
