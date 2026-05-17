# Code Conventions & Guidelines

## 1. File Naming & Organization
- Use `kebab-case` for all filenames (e.g., `spline-loader.tsx`, `dashboard-shell.tsx`).
- Group related feature components in dedicated subdirectories under `/components`.

## 2. Component Architecture
- Prefer React Server Components (RSC) by default for pages and layouts.
- Add `'use client';` explicitly at the very top of files requiring client-side interactivity, hooks, or Spline 3D canvas rendering.
- Maintain strict separation between visual markup and complex business logic.

## 3. Styling & Aesthetics
- Rely on central CSS custom properties (`var(--bg-primary)`, `var(--spring-normal)`) defined in `theme.css` and `motion.css`.
- Avoid hardcoded hex colors or generic utility spam; preserve the cinematic graphite editorial identity.

## 4. Git Workflow
- Enforce atomic commits matching GSD task IDs (e.g., `feat(03-01): implement user stories verification`).
- Keep commit messages descriptive and focused on a single logical change.
