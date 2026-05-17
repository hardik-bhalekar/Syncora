# Codebase Structure

```
goal-sync-portal/
├── .planning/                  # GSD Project Management System
│   ├── codebase/               # Codebase Mapping Artifacts
│   └── phases/                 # Phase Execution Plans
├── app/                        # Next.js App Router Pages & API Routes
│   ├── dashboard/              # Protected Enterprise Dashboard Shell
│   ├── login/                  # Authentication & Onboarding Viewport
│   └── page.tsx                # Landing Page with Spline 3D Hero Scene
├── components/                 # Reusable UI & Feature Components
│   ├── actions/                # Interactive Buttons & Toggles (Theme, Logout)
│   ├── layout/                 # Dashboard Shell & Navigation Wrappers
│   └── spline/                 # Spline 3D Loaders & Scene Implementations
├── docs/                       # Project Documentation
│   └── user-stories/           # Ralph Loop Acceptance Criteria JSON
├── prisma/                     # Database Schema & Seeding Scripts
├── scripts/                    # Automation & Verification Tooling
│   └── verify-user-stories.ts  # Ralph Loop Verification Runner
├── src/                        # Core Application Logic
│   ├── lib/                    # Design System Tokens & Utility Functions
│   └── styles/                 # Vanilla CSS (Theme Tokens & Motion Curves)
└── tests/                      # Test Suites & Assertions
```
