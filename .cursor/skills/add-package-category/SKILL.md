---
name: add-package-category
description: Add a new top-level Hyde Park package category beyond the current defaults such as composables, utils, fun, or meta. Use this when defining naming for a new category, wiring docs navigation, deciding generator support, or documenting the category as a first-class repository concept.
---

# Add Package Category

Use this skill when introducing a brand new package category to the Hyde Park monorepo.

Examples:

- `packages/renderers/*`
- `packages/state/*`
- `packages/learning/*`

## Read First

- `docs/workspace-structure.md`
- `docs/package-standards.md`
- `docs/creating-packages.md`
- `docs/tooling-guide.md`

## Codex Note

If this skill was reached from `AGENTS.md`, use it as the step-by-step playbook for introducing a new first-class package category.

Before changing scaffolding or conventions, verify whether the category should be:

- public or private
- supported by `scripts/new-package.mjs`
- added to docs navigation
- reflected in `AGENTS.md` and `.cursor/`

When in doubt, preserve the existing repository conventions and extend them with the smallest viable category-specific changes.

## Goal

Introduce a new package category in a way that is structurally consistent, documented, and usable by future agents and maintainers.

## Decision Checklist

Before implementing, decide:

1. Why the new category exists
2. What its naming convention is
3. Whether it is public or private
4. Whether its packages need special `exports`, peer dependencies, or TS config
5. Whether the generator should support it now or later

## Implementation Playbook

1. Create the package folder shape under `packages/<category>/<name>`.
2. Define the npm naming rule and keep it consistent across the category.
3. Create or adapt the first package in that category manually.
4. Add package docs folder under `apps/docs/docs/packages/<category>/`.
5. Update `apps/docs/docs/.vitepress/config.ts` so the category appears in the docs sidebar.
6. Decide whether `scripts/smoke/consumer-smoke.mjs` needs new coverage for that category.
7. Update maintainer docs in `docs/` so the category is documented as part of the repo model.
8. Update `AGENTS.md` and `.cursor/` rules or skills if the category changes how agents should work in the repo.
9. Decide whether to extend `scripts/new-package.mjs` to support the new category.

## Naming Guidance

Prefer a stable, predictable package naming rule.

Good example:

- `@ddosdor/hyde-park-fun-mini-vue`

For a new category, use the same style:

- `@ddosdor/hyde-park-<category>-<name>`

Use one pattern consistently. Do not mix naming schemes inside the same category.

## Generator Policy

Do not extend `scripts/new-package.mjs` automatically for every new category.

Extend the generator only when:

- the category is expected to be reused often
- its package template is stable
- its scaffolding is repetitive enough to justify automation

If the category is still experimental, document the manual flow instead.

## Documentation Requirement

When a category becomes first-class, update:

- `docs/README.md`
- `docs/project-overview.md`
- `docs/workspace-structure.md`
- `docs/package-standards.md`
- `docs/creating-packages.md`

Also update `AGENTS.md` if agents need to know the category exists.

## Validation

Validate the first package in the category with:

```bash
pnpm --filter <package-name> lint
pnpm --filter <package-name> typecheck
pnpm --filter <package-name> test
pnpm --filter <package-name> build
```

Then run repository validation:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

## Release Follow-Up

If the new category introduces public packages:

- add docs for consumers
- add a changeset for the first public package
- confirm publishability before release
