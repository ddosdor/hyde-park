---
name: update-docs
description: Create or update Hyde Park documentation so README, maintainer docs, and VitePress package docs stay aligned with the actual repository. Use this when adding docs pages, updating package docs, changing docs navigation, or documenting repository workflow changes.
---

# Update Docs

Use this skill when editing written documentation in Hyde Park.

Examples:

- update `README.md`
- add or revise a maintainer guide under `docs/`
- add or revise package docs under `apps/docs/docs/`
- update VitePress navigation or package catalog pages
- document a new package, package category, workflow, or release behavior

## Read First

- `docs/project-overview.md`
- `docs/workspace-structure.md`
- `docs/package-standards.md`
- `docs/release-guide.md`

Read `docs/tooling-guide.md` if the documentation change involves `pnpm`, `Turborepo`, `tsup`, `Changesets`, or VitePress behavior.

## Codex Note

If this skill was reached from `AGENTS.md`, treat it as the standard workflow for non-AI documentation work.

Before editing:

- identify the audience: repository maintainer, package consumer, or repository visitor
- identify the canonical home for the information
- verify commands, package names, and paths against the current repository

Prefer targeted edits to the canonical file over copying the same explanation into multiple places.

## Documentation Areas

### Root README

Use `README.md` for:

- quick project overview
- repository entry points
- high-level commands
- links to deeper documentation

Do not turn `README.md` into a full maintainer manual.

### Root docs

Use `docs/` for:

- monorepo architecture
- tooling explanations
- package standards
- package creation workflows
- release and maintenance procedures
- troubleshooting and command references

### VitePress docs app

Use `apps/docs/docs/` for:

- package discovery
- installation guidance for consumers
- package-specific examples and API notes
- package catalog and navigation pages

## Update Playbook

1. Confirm what changed in the repository and who the documentation is for.
2. Find the canonical file that should own the explanation.
3. Update adjacent docs if the same change affects multiple audiences.
4. Update VitePress navigation in `apps/docs/docs/.vitepress/config.ts` when discoverability changes.
5. Keep terminology, package names, and commands consistent with the repository.
6. Remove or rewrite stale content instead of layering contradictory text on top.

## Common Scenarios

### Package added or changed

- update `apps/docs/docs/packages/<category>/<name>.md`
- update package catalog pages if needed
- update `README.md` only if the package materially changes the repository entry points
- update `docs/` only if the package changes repository conventions or workflows

### New package category

- update `docs/project-overview.md`
- update `docs/workspace-structure.md`
- update `docs/package-standards.md`
- update `docs/creating-packages.md`
- update `apps/docs/docs/.vitepress/config.ts`
- update package catalog pages in `apps/docs/docs/`

### Release workflow or tooling change

- update `docs/release-guide.md`
- update `docs/tooling-guide.md` if needed
- update `README.md` only if the quick-start or top-level commands changed

### Docs site changes

- update `apps/docs/docs/index.md`
- update `apps/docs/docs/packages/index.md` if package discovery changed
- update `.vitepress/config.ts` if nav or sidebar structure changed

## Validation

For root docs only:

```bash
pnpm lint
pnpm typecheck
```

For VitePress docs changes:

```bash
pnpm --filter @ddosdor/hyde-park-docs build
```

Run broader validation when the docs change is coupled to code or package behavior changes.
