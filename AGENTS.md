# Hyde Park Agent Guide

This repository is a TypeScript monorepo for independently versioned npm packages.

Agents working in this repository should treat the maintainer docs in `docs/` as the canonical source of truth for repository architecture, package conventions, and release workflow.

## Read These Docs First

Choose the minimum set required for the current task.

- `docs/project-overview.md`
- `docs/workspace-structure.md`
- `docs/tooling-guide.md`
- `docs/package-standards.md`
- `docs/creating-packages.md`
- `docs/release-guide.md`
- `docs/commands-reference.md`
- `docs/troubleshooting.md`

## Project Model

- Public leaf packages are the primary product.
- `@ddosdor/hyde-park` is a convenience umbrella package.
- Public packages are independently installable and independently versioned.
- Private tooling packages and the docs app must never be published.

## Current Public Categories

- `packages/composables/*`
- `packages/utils/*`
- `packages/fun/*`
- `packages/meta/hyde-park`

## Current Private Categories

- `packages/tooling/*`
- `apps/docs`

## Non-Negotiable Conventions

- Use `pnpm` workspaces, `Turborepo`, `tsup`, and `Changesets` as already configured in the repo.
- Keep package-level scripts aligned with the monorepo task model: `build`, `lint`, `typecheck`, `test`, `clean`.
- Public packages should publish `ESM + CJS + d.ts`.
- Public packages should use explicit `exports`.
- Local package-to-package dependencies should use `workspace:*`.
- Workspace `tsconfig.json` files should extend shared config using relative paths into `packages/tooling/typescript-config/`.
- Public package docs belong in `apps/docs/docs/packages/<category>/`.

## Package Naming Rules

- Composable packages: `@ddosdor/hyde-park-composable-<name>`
- Utility packages: `@ddosdor/hyde-park-util-<name>`
- Fun packages: `@ddosdor/hyde-park-fun-<name>`
- Umbrella package: `@ddosdor/hyde-park`

## Agent Workflow Hints

- Before editing package metadata or package structure, read `docs/package-standards.md`.
- Before creating a package, read `docs/creating-packages.md`.
- Before releasing packages, read `docs/release-guide.md`.
- Before editing maintainer docs, package docs, or `README.md`, read the canonical docs that describe the same area and keep documentation aligned with the actual repository state.
- Before changing rules, skills, or AI-facing repository guidance, read `docs/project-overview.md`, `docs/workspace-structure.md`, and the files under `.cursor/`.

## Cursor Project Context

This repository also includes Cursor project rules and skills under `.cursor/`.

- Rules: `.cursor/rules/*.mdc`
- Skills: `.cursor/skills/*/SKILL.md`

Those files are repository-specific operating context for AI agents. Keep them aligned with the real repo implementation and with the maintainer docs in `docs/`.

## Codex Routing

If you are Codex or another repository-aware coding agent, use `AGENTS.md` as the primary routing file and then load the relevant `.cursor/` files as needed.

### Always read for general repository work

- `.cursor/rules/hyde-park-project-context.mdc`

### Read when creating or adapting a package

- `.cursor/rules/package-workflows.mdc`
- `.cursor/skills/add-package/SKILL.md`
- `docs/package-standards.md`
- `docs/creating-packages.md`

Typical triggers:

- a new package under `packages/*/*`
- adapting imported code into a publishable Hyde Park package
- changing package exports, package metadata, docs pages, or smoke tests

### Read when introducing a new category beyond current defaults

- `.cursor/rules/package-workflows.mdc`
- `.cursor/skills/add-package-category/SKILL.md`
- `docs/workspace-structure.md`
- `docs/creating-packages.md`

Typical triggers:

- adding a new top-level grouping under `packages/`
- defining a new package naming convention
- updating docs navigation or generator support for a new category

### Read when editing AI-facing guidance

- `.cursor/rules/agent-context-maintenance.mdc`
- `docs/project-overview.md`
- `docs/workspace-structure.md`

Typical triggers:

- editing `AGENTS.md`
- editing `.cursor/rules/*`
- editing `.cursor/skills/*`
- changing maintainer docs in `docs/`

### Read when adding or updating documentation

- `.cursor/rules/docs-workflows.mdc`
- `.cursor/skills/update-docs/SKILL.md`
- `docs/project-overview.md`
- `docs/workspace-structure.md`
- `docs/package-standards.md`

Typical triggers:

- editing `README.md`
- editing package docs under `apps/docs/docs/`
- editing maintainer docs under `docs/`
- adding a new docs page, docs section, sidebar entry, or package catalog entry
- updating documentation after a package, category, release flow, or repository convention change

## Priority Rule

If there is overlap:

1. Follow the real repository implementation first.
2. Use `docs/` as the canonical written explanation of that implementation.
3. Use `.cursor/rules/` and `.cursor/skills/` as task-specific AI operating guidance.
4. Keep `AGENTS.md` concise and use it to route into the more detailed files above.
