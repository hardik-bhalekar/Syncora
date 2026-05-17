# Syncora

Goal Sync Portal built with Next.js (App Router).

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment

Create a local env file before running the app:

```bash
cp .env.example .env.local
```

Required variables:

- `DATABASE_URL` - Postgres connection string for Prisma.
- `NEXTAUTH_SECRET` - auth secret.
- `NEXTAUTH_URL` - base URL for NextAuth.

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - lint

## Notes

- Environment variables are not committed. Copy .env.example if provided and fill in locally.

