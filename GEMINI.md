# Gemini CLI Instructions

All core project rules, architectural decisions, and coding standards are centralized in **AI.md**.

## 🚀 Getting Started
- Read `AI.md` to understand the project guidelines.
- Check `PROGRESS.md` for the latest updates and current tasks.

## 🛠 Tool Usage
- Use `enter_plan_mode` for architectural changes.
- Always run build/lint commands (once configured) before finalizing a task.

## 🚀 Deployment Workflow
- **Local Verification First:** After implementing changes, DO NOT push to GitHub immediately. Allow the user to test and verify the changes in the local environment (`npm run dev`) first.
- **Manual Push:** Only perform `git push` when explicitly directed by the user after successful local verification.
