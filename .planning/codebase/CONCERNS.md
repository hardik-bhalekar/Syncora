# Technical Concerns & Risks

## 1. Spline 3D Runtime Memory & Canvas Scaling
- **Risk**: High WebGL memory usage or slow loading times on mobile viewports.
- **Mitigation**: Use `spline-loader.tsx` to handle lazy loading, error boundaries, and elegant CSS fallback states.

## 2. Next.js App Router Breaking Changes
- **Risk**: Misconfigured client vs. server boundaries leading to hydration mismatch errors.
- **Mitigation**: Strictly audit `'use client'` directives and maintain clean server-first page wrappers.

## 3. Database Connection Pooling
- **Risk**: Exhausting Supabase connection limits during high concurrency or serverless function scaling.
- **Mitigation**: Utilize Supabase's transaction pooling endpoint (`DIRECT_URL` vs `DATABASE_URL`) in Prisma configuration.
