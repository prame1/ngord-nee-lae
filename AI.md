# Project AI Instructions (Source of Truth)

This file contains the primary guidelines for all AI agents (Gemini, Claude, Cursor, etc.) working on this project.

## 🛠 Tech Stack (To be updated)
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Package Manager:** npm/pnpm/yarn

## 📂 Architecture & Folder Structure
- **Feature-First:** Group logic by feature under `src/features/`.
- **Modularity:** Keep components small, focused, and reusable.
- **Server vs Client:** Favor Server Components by default. Use `"use client"` only when necessary.

## 📜 Coding Standards
- **Strict TypeScript:** No `any` types. Use proper interfaces/types.
- **Consistency:** Follow existing naming conventions and patterns.
- **Documentation:** Use JSDoc for complex logic. Keep comments meaningful.

## 🤖 AI Interaction Rules
1. **Research First:** Always explore the codebase before suggesting changes.
2. **Plan Mode:** For complex tasks, create a plan and get approval before execution.
3. **Log Progress:** Update `PROGRESS.md` after every significant task.
4. **Test Before Delivery:** Run relevant tests or create new ones for bug fixes and features.
