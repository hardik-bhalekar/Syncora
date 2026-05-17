# Testing & Verification Strategy

## 1. Ralph Loop Acceptance Verification
- **Mechanism**: Automated validation of user stories via `npm run user-stories:verify`.
- **Location**: `docs/user-stories/*.json`
- **Standard**: Every new feature must be documented as a testable user story with concrete steps before implementation begins.

## 2. Unit & Integration Testing
- **Runner**: Node.js native test runner executed via `tsx` (`npm test`).
- **Scope**: Core utility functions, Zod validation schemas, and Zustand state selectors.

## 3. Autonomous AI Code Review
- **Tool**: CodeRabbit CLI (`coderabbit review --agent`)
- **Workflow**: Run reviews on all uncommitted or staged changes prior to opening pull requests to catch potential runtime exceptions, security vulnerabilities, or style regressions.
