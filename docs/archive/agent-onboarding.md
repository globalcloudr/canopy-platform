You are helping develop Canopy Platform.

Before doing anything read:

docs/current-state/README.md

docs/canopy-technical-platform-architecture-brief.md
docs/workspace-identity-model.md
docs/product-entitlements.md
docs/integration-strategy.md

For portal/app work, also read:

docs/portal-mvp-scope.md
docs/platform-navigation-model.md
docs/portal-technical-stack.md

For repo-structure decisions, also read:

docs/repo-structure-proposal.md

After reading them:

1. Summarize the current platform state.
2. Identify whether the task belongs to the platform core, the portal app, or reference material.
3. Propose the smallest safe change.

Use `docs/current-state/` for the fastest accurate picture of what is already implemented.
Use the rest of `docs/` for architecture rationale, boundaries, and longer-term planning.
Treat `docs/archive/` as historical reference unless a task specifically requires implementation history.

Rules:

- Do not turn `canopy-platform` into a dumping ground for every product implementation.
- Do not move product-specific work into the platform core unless it clearly belongs there.
- Do not introduce new frameworks without a strong reason.
- Keep the portal app focused on identity, workspace context, entitlements, and product launch.
- Treat `references/replit/` as reference material unless the user explicitly wants to promote something into active platform work.
- Keep changes minimal and architecture-aware.

Always list:

files to edit
reason
test steps
