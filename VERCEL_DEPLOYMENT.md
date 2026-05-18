# Vercel Deployment ENV Setup Guide

This guide provides complete, step-by-step instructions for configuring your Vercel environment variables and deploying **Syncora** to production.

---

## Navigation & Setup

Go to your Vercel dashboard:
```text
Vercel Project → Settings → Environment Variables
```
Add the following environment variables one by one.

---

## 1. DATABASE_URL

### Where to get it
From Supabase, Neon, or Railway PostgreSQL.

If using **Supabase**:
```text
Supabase Dashboard → Project Settings → Database → Connection String
```

Copy the connection string and configure your variable:
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

> [!IMPORTANT]
> Make sure to replace `[PASSWORD]` with your actual database password. If your password contains special characters, ensure they are URL-encoded.

---

## 2. NEXTAUTH_SECRET

Generate a random 32-byte secure secret for NextAuth encryption.

Run locally in your terminal:
```bash
openssl rand -base64 32
```

Paste the resulting string into Vercel:
```env
NEXTAUTH_SECRET=your_generated_secret
```

---

## 3. NEXTAUTH_URL

Your canonical production URL.

Example:
```env
NEXTAUTH_URL=https://syncora.vercel.app
```

> [!TIP]
> Use **YOUR** actual deployed domain (e.g., `https://your-custom-domain.vercel.app`). Do not include a trailing slash.

---

## 4. GitHub OAuth (If Using GitHub Login)

Go to: [GitHub Developer Settings](https://github.com/settings/developers)

### Create OAuth App
* **Homepage URL**: `https://your-vercel-url.vercel.app`
* **Callback URL**: `https://your-vercel-url.vercel.app/api/auth/callback/github`

Then copy the generated keys:
```env
GITHUB_ID=your_github_oauth_client_id
GITHUB_SECRET=your_github_oauth_client_secret
```

---

## 5. Azure / Microsoft Entra ID (IMPORTANT FOR BONUS POINTS)

Go to: [Azure Portal](https://portal.azure.com)

Navigate to:
```text
Azure Active Directory → App Registrations → New Registration
```

### Redirect URI
Configure the Web Redirect URI exactly as follows:
```text
https://your-vercel-url.vercel.app/api/auth/callback/azure-ad
```

Then copy your application credentials:
```env
AZURE_AD_CLIENT_ID=your_azure_client_id
AZURE_AD_CLIENT_SECRET=your_azure_client_secret
AZURE_AD_TENANT_ID=your_azure_tenant_id
```

---

## 6. Supabase Client Keys

Go to:
```text
Supabase → Project Settings → API
```

Copy your project URL and Anon public key:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 7. Upstash Redis (If Used)

Go to: [Upstash Console](https://console.upstash.com)

Create a Redis database, then copy the REST configuration:
```env
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token
```

---

## 8. Teams Webhook URL

In Microsoft Teams:
```text
Channel → Connectors → Incoming Webhook
```

Generate a webhook URL and paste it:
```env
TEAMS_WEBHOOK_URL=https://xxxxx.webhook.office.com/webhookb2/...
```

---

## 9. Optional Email Service

If using Resend for automated transactional emails: [Resend Dashboard](https://resend.com)

```env
RESEND_API_KEY=re_your_resend_api_key
```

---

## 10. Prisma Production Step

After deployment completes, open the Vercel terminal (or your local terminal connected to the production database) and run the migration deploy:
```bash
npx prisma migrate deploy
```

Then seed the database with required enterprise roles and baseline demo data:
```bash
npx prisma db seed
```

---

## 11. MOST IMPORTANT: Redeploy

After adding or modifying environment variables in Vercel:
```text
Vercel Dashboard → Deployments → Redeploy Project
```

> [!WARNING]
> Vercel environment variable changes **will not apply** to an already running deployment. You must trigger a redeploy for the new environment variables to take effect in the build and runtime environments.

---

## Minimal Required ENV Variables

If you want the fastest deployment possible for hackathon judging, configure these 5 mandatory variables:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=https://your-vercel-url.vercel.app
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Optional Integrations:**
* GitHub OAuth (`GITHUB_ID`, `GITHUB_SECRET`)
* Azure AD (`AZURE_AD_CLIENT_ID`, `AZURE_AD_CLIENT_SECRET`, `AZURE_AD_TENANT_ID`)
* Microsoft Teams Webhooks (`TEAMS_WEBHOOK_URL`)
* Upstash Redis (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`)
* Resend Email (`RESEND_API_KEY`)

---

## Common Deployment Failures

### “Invalid redirect URI” / OAuth Errors

> [!CAUTION]
> If you encounter OAuth callback or redirect errors during login, verify the following:
> 1. Callback URLs must **exactly match** your deployed Vercel URL.
> 2. Ensure the protocol is `https://`.
> 3. Check for and remove any accidental trailing slashes (e.g., `https://domain.vercel.app/` vs `https://domain.vercel.app`).

---

## Quickest Production Stack

Recommended architecture for the fastest, most stable hackathon deployment:

| Service | Platform | Purpose |
| :--- | :--- | :--- |
| **Frontend & API** | Vercel | Serverless App Router execution & Edge middleware |
| **Database** | Supabase | Scalable PostgreSQL with pgvector & Realtime CDC |
| **Authentication** | NextAuth.js | Secure OIDC / OAuth & Session Management |
| **Caching / Rate Limiting**| Upstash | Serverless Redis for API rate limiting & caching |
| **Transactional Email** | Resend | Reliable email delivery for workflow automations |

This represents the cleanest, most resilient hackathon-ready setup.
