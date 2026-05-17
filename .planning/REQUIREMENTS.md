# Scoped Requirements

## 1. Authentication & Onboarding Flow
- Secure email/password login and registration via NextAuth / Prisma Adapter.
- Interactive 3D Spline Auth Scene (`auth-scene.tsx`) with loading state guards.
- Protected route redirection to `/dashboard`.

## 2. Cinematic Dashboard Shell
- Editorial navigation hierarchy with collapsible sidebar and breadcrumb trails.
- Live theme toggle (Dark/Light/System) using `next-themes`.
- High-fidelity telemetry cards for active goals, milestones, and team alignment.

## 3. Spline 3D Integration & Performance Guards
- Dedicated `spline-loader.tsx` wrapper ensuring smooth initialization without runtime canvas crashes.
- Responsive scaling and mobile fallback handling for 3D viewports.

## 4. Automated Verification & Code Review
- Continuous user story verification via Ralph Loop (`npm run user-stories:verify`).
- Autonomous code quality checks and PR reviews using CodeRabbit CLI (`coderabbit review --agent`).
