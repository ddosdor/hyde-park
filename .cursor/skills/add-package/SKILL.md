---
name: add-package
description: Create or adapt a Hyde Park package so it follows the monorepo standards for publishable packages. Use this when adding a new package, making an imported package publishable, wiring package exports, adding docs pages, or validating package release readiness.
---

# Add Package

Use this skill when working on a package under `packages/*/*`.

## Read First

- `docs/package-standards.md`
- `docs/creating-packages.md`
- `docs/workspace-structure.md`
- `docs/release-guide.md`

Read `docs/tooling-guide.md` if the task involves `pnpm`, `Turborepo`, `tsup`, or `Changesets` changes.

## Codex Note

If this skill was reached from `AGENTS.md`, treat it as the package implementation workflow for all work under `packages/*/*`.

Before editing, confirm the package category, naming scheme, export shape, and docs location against:

- `docs/package-standards.md`
- `docs/creating-packages.md`

If the task includes unusual exports, imported code from another repository, or category-specific packaging constraints, prefer the real package implementation in the repository over generic scaffolding assumptions.

## Goal

Bring a package into Hyde Park's standard publishable shape.

Typical cases:

- add a brand new composable or util package
- adapt copied code from another repo into a Hyde Park package
- rename a package to the Hyde Park naming scheme
- add `exports`, `tsup`, tests, docs, and smoke coverage

## Package Checklist

For a public package, ensure all of the following exist and are coherent:

1. `package.json`
2. `tsconfig.json`
3. `tsup.config.ts`
4. `src/index.ts` or named entry files
5. `test/index.test.ts`
6. docs page under `apps/docs/docs/packages/<category>/`

## Required Public Package Conventions

- scoped name using Hyde Park naming rules
- `"type": "module"`
- `main`, `module`, and `types`
- explicit `exports`
- `"files": ["dist"]`
- `"publishConfig": { "access": "public" }`
- scripts: `build`, `lint`, `typecheck`, `test`, `clean`
- `ESM + CJS + d.ts` build output

## TypeScript Config Rule

Workspace package `tsconfig.json` files should extend shared config using relative paths into `packages/tooling/typescript-config/`.

Examples:

- `../../tooling/typescript-config/library.json`
- `../../tooling/typescript-config/base.json`

## Category Guidance

### Composable

- folder: `packages/composables/<name>`
- name: `@ddosdor/hyde-park-composable-<name>`
- likely `vue` peer dependency

### Util

- folder: `packages/utils/<name>`
- name: `@ddosdor/hyde-park-util-<name>`
- framework-agnostic by default

### Fun

- folder: `packages/fun/<name>`
- name: `@ddosdor/hyde-park-fun-<name>`
- use manual setup when the package has unusual exports or custom runtime requirements

### Meta

- folder: `packages/meta/<name>`
- usually acts as an umbrella or convenience package

## Multi-Entry Packages

If a package needs subpath exports:

- use named `entry` values in `tsup.config.ts`
- add matching `exports` entries in `package.json`
- add tests for the special entrypoints
- consider smoke-test coverage if packaging is non-trivial

## Docs Requirement

Add or update:

- `apps/docs/docs/packages/<category>/<name>.md`

Update `apps/docs/docs/.vitepress/config.ts` only if a new category is involved.

## Validation

Run package-local validation first:

```bash
pnpm --filter <package-name> lint
pnpm --filter <package-name> typecheck
pnpm --filter <package-name> test
pnpm --filter <package-name> build
```

Then run repository validation if the change is broader:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

## Release Follow-Up

If the package is public and changed in a user-visible way:

- add a changeset
- validate with `pnpm release:check`

See `docs/release-guide.md`.
