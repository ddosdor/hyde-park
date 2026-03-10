# Workspace Structure

## Top-Level Layout

```text
.
├── .changeset/                Changesets configuration and pending release notes
├── apps/
│   └── docs/                  Private VitePress app for public package docs
├── docs/                      Maintainer documentation for the repository
├── packages/
│   ├── composables/           Public Vue composable packages
│   ├── fun/                   Public experimental or unusual packages
│   ├── meta/                  Public umbrella package(s)
│   ├── tooling/               Private shared config/tooling packages
│   └── utils/                 Public framework-agnostic utility packages
├── scripts/
│   ├── new-package.mjs        Package generator for supported package types
│   ├── release-check.mjs      Release validation guard around Changesets status
│   └── smoke/                 Tarball installation smoke tests
├── package.json               Root scripts and root devDependencies
├── pnpm-workspace.yaml        Workspace package discovery
└── turbo.json                 Turborepo task graph and cache rules
```

## Workspace Discovery

The workspace is defined in `pnpm-workspace.yaml`.

Current configuration:

```yaml
packages:
  - "apps/*"
  - "packages/*/*"
```

This means:

- all apps under `apps/` are workspace packages
- all packages exactly two levels deep under `packages/` are workspace packages

Examples of valid package locations:

- `packages/composables/use-debounce`
- `packages/utils/deep-merge`
- `packages/fun/mini-vue`
- `packages/tooling/typescript-config`

Examples of invalid locations for auto-discovery:

- `packages/use-debounce`
- `packages/fun/renderers/mini-vue`

If you add packages outside the `packages/*/*` pattern, pnpm will not treat them as workspace packages until you update `pnpm-workspace.yaml`.

## Category Meaning

### `packages/composables`

Public Vue-oriented composables.

Examples:

- `use-debounce`

Expected characteristics:

- may have `vue` as a peer dependency
- usually export Vue-friendly runtime APIs

### `packages/utils`

Public framework-agnostic TypeScript utilities.

Examples:

- `deep-merge`

Expected characteristics:

- no framework-specific peer dependencies
- small reusable runtime helpers

### `packages/fun`

Public packages that do not fit the standard composable/util buckets.

Examples:

- `mini-vue`

Expected characteristics:

- more experimental
- potentially broader API surface
- may define extra public exports such as `jsx-runtime`

### `packages/meta`

Public umbrella or meta packages.

Current example:

- `hyde-park`

Expected characteristics:

- re-export APIs from leaf packages
- provide subpath exports
- convenience layer for consumers

### `packages/tooling`

Private packages that exist only to support the repository itself.

Examples:

- TypeScript config package
- ESLint config package

Expected characteristics:

- `"private": true`
- never published to npm
- referenced via `workspace:*`

### `apps/docs`

Private application for public package docs.

Expected characteristics:

- not published
- built with VitePress
- contains end-user package documentation

## Why the Workspace Uses Categories

Category folders exist for maintainability, not just aesthetics.

They help with:

- grouping related packages
- naming consistency
- docs organization
- smoke test coverage
- mental separation between stable utils, framework packages, and experiments

## Root vs Package Responsibilities

### Root responsibilities

- hold shared devDependencies
- define shared scripts
- define workspace membership
- define task orchestration rules
- host maintainer documentation

### Package responsibilities

- define runtime/public API
- define package-specific metadata
- define package-level scripts that Turborepo executes
- define package exports
- define package-specific dependencies and peer dependencies

## Current Shared Packages

### TypeScript config package

Location:

- `packages/tooling/typescript-config`

Purpose:

- centralize base TypeScript settings
- provide `base.json`, `library.json`, and `app.json`

### ESLint config package

Location:

- `packages/tooling/eslint-config`

Purpose:

- centralize flat-config ESLint rules for the monorepo
- avoid repeating lint settings in every package

## How Documentation Is Organized

### Root `docs/`

For maintainers.

Topics:

- architecture
- tooling
- release process
- package creation
- troubleshooting

### `apps/docs/docs`

For package consumers.

Topics:

- installation
- per-package API docs
- examples

## What Must Be Updated When You Add a New Package Category

If you add a new category such as `rendering`, `state`, or `learning`, review all of the following:

1. `packages/<category>/<name>` package location
2. package naming convention
3. product docs pages under `apps/docs/docs/packages/<category>/`
4. `apps/docs/docs/.vitepress/config.ts` sidebar configuration
5. smoke tests, if the new category should be explicitly validated
6. this documentation, if the new category becomes a first-class concept

Adding a package to an existing category is much simpler than adding an entirely new category.
