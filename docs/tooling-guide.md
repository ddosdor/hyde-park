# Tooling Guide

This repository uses several tools together. Each tool has a very specific job.

## Tool Summary

- `pnpm` manages dependencies and workspaces
- `Turborepo` orchestrates tasks across packages
- `tsup` builds TypeScript libraries for npm
- `Changesets` versions and publishes packages
- `Renovate` proposes dependency and workflow update PRs
- `Vitest` runs tests
- `ESLint` enforces code quality
- `VitePress` powers the package docs app

## pnpm

### What pnpm is

`pnpm` is the package manager for this repository.

In this monorepo, pnpm is responsible for:

- installing dependencies
- managing the workspace
- linking local workspace packages
- generating `pnpm-lock.yaml`
- running package scripts
- filtering commands to specific packages

### Why Hyde Park uses pnpm

Hyde Park uses pnpm because it has strong monorepo support and workspace-aware dependency linking.

Important features for this repository:

- `pnpm-workspace.yaml`
- `workspace:*` dependency protocol
- fast local package linking
- package filtering with `--filter`
- one lockfile for the entire monorepo

### Important pnpm concepts in this repo

#### Workspace package discovery

Defined in `pnpm-workspace.yaml`.

#### Workspace protocol

Example:

```json
{
  "dependencies": {
    "@ddosdor/hyde-park-util-deep-merge": "workspace:*"
  }
}
```

This means:

- use the local workspace package during development
- keep dependency wiring explicit

#### Filters

Examples:

```bash
pnpm --filter @ddosdor/hyde-park-fun-mini-vue build
pnpm --filter @ddosdor/hyde-park-fun-mini-vue test
pnpm --filter ./packages/fun/mini-vue lint
```

Use filters when you want to work on one package instead of the whole monorepo.

### Important root pnpm settings

The root `.npmrc` currently enables:

- `shared-workspace-lockfile=true`
- `link-workspace-packages=true`
- `prefer-workspace-packages=true`

These settings make workspace development more predictable.

## Turborepo

### What Turborepo is

`Turborepo` is the task runner and cache layer for the monorepo.

In this repository, Turborepo is responsible for:

- running `build`, `lint`, `typecheck`, and `test` across workspace packages
- ordering tasks according to dependencies
- caching task results
- reusing outputs where possible

### Why Hyde Park uses Turborepo

Without Turborepo, every root script would have to manually run package scripts in the correct order.

Turborepo gives Hyde Park:

- dependency-aware execution
- task graph orchestration
- output caching
- package-level parallelism
- one consistent command surface from the root

### How Turborepo works here

The task graph lives in `turbo.json`.

Important examples:

- `build` depends on `^build`
- `typecheck` depends on `^build`
- `test` depends on `^build`
- `dev` is not cached and is persistent

`^build` means:

- before building a package, build the packages it depends on

### Why `outputs` matter

Turborepo caches outputs only when they are declared.

In Hyde Park:

- library builds cache `dist/**`
- docs builds cache `docs/.vitepress/dist/**`

That is why the `build` task in `turbo.json` declares outputs explicitly.

### Turborepo mental model

Turborepo does not replace package scripts.

Instead:

- each package still owns its own scripts in `package.json`
- Turborepo discovers and runs those scripts in the right order

That is why every public package has its own `build`, `lint`, `typecheck`, `test`, and `clean` scripts.

## tsup

### What tsup is

`tsup` is the library bundler used for publishable packages.

It is built on top of `esbuild` and is particularly well suited for npm libraries.

In Hyde Park, tsup is used to produce:

- ESM output
- CJS output
- TypeScript declaration files
- source maps

### Why Hyde Park uses tsup

Hyde Park publishes libraries, not full frontend applications.

For that reason, the repository needs a build tool that is optimized for:

- package entrypoints
- multi-format output
- declaration file generation
- simple config

That is exactly the job tsup solves here.

### Common tsup patterns in this repo

#### Single entry package

```ts
export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  sourcemap: true,
  target: "es2022"
});
```

Used by most leaf packages.

#### Multiple entry package

```ts
export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    index: "src/index.ts",
    "jsx-runtime": "src/jsx-runtime.ts",
    "jsx-dev-runtime": "src/jsx-dev-runtime.ts"
  },
  format: ["esm", "cjs"],
  sourcemap: true,
  target: "es2022"
});
```

Used when a package needs subpath exports.

### What tsup does not do here

It does not manage release versions.

It does not decide what gets published.

It only builds the package output that npm will later publish.

## Changesets

### What Changesets is

`Changesets` is the release/versioning tool for this monorepo.

In Hyde Park, Changesets is responsible for:

- recording release intent in `.changeset/*.md`
- deciding which packages need a version bump
- updating package versions
- updating internal dependency ranges
- publishing changed public packages to npm
- creating release tags during publish

### Why Hyde Park uses Changesets

Hyde Park publishes multiple packages with independent versions.

That is exactly the use case Changesets is designed for.

It avoids:

- manually editing package versions by hand
- forgetting dependent package range updates
- ad hoc release notes
- inconsistent multi-package publishing

### Important Changesets config in this repo

Current config values:

- `access: "public"`
- `baseBranch: "main"`
- `updateInternalDependencies: "patch"`
- `fixed: []`
- `linked: []`
- `commit: false`

What these mean:

#### `access: "public"`

Scoped packages should publish publicly to npm.

#### `baseBranch: "main"`

Changeset status compares changes against `main`.

#### `updateInternalDependencies: "patch"`

When package A depends on package B and B changes version, Changesets updates A's dependency range using patch-level policy.

#### `fixed: []` and `linked: []`

No package groups are forced to version together.

This preserves independent versioning.

### Important Changesets commands

```bash
pnpm changeset
pnpm version-packages
pnpm publish-packages
```

Detailed release instructions are in [Release Guide](./release-guide.md).

## Renovate

### What Renovate does here

Renovate automates dependency maintenance by opening pull requests for supported updates.

In Hyde Park, that currently means:

- npm package updates across the workspace
- `pnpm-lock.yaml` maintenance
- GitHub Actions version updates in `.github/workflows/`

### Why Hyde Park uses Renovate

This repository has one shared lockfile, shared root tooling, and multiple independently releasable public packages.

Renovate helps keep the shared toolchain current without manually auditing every upstream release.

### Important Renovate behavior in this repo

The configuration lives in:

- `renovate.json`

Current repository-specific choices:

- use `config:recommended` as the baseline
- keep a dependency dashboard enabled
- run weekly lockfile maintenance
- group non-major `devDependencies` updates to reduce PR noise
- group GitHub Actions updates into one PR

Renovate does not replace the release workflow.

If a Renovate PR changes a public package in a way that should ship to npm, the normal Changesets process still applies.

## Vitest

### What it does here

Vitest runs package-level tests.

It is used for:

- unit tests for package runtime behavior
- umbrella export validation
- small API-level correctness checks

Hyde Park also uses a separate tarball smoke test to validate installability outside the workspace.

## ESLint

### What it does here

ESLint enforces repository-wide code quality rules.

The configuration lives in the private package:

- `packages/tooling/eslint-config`

The root `eslint.config.mjs` imports that shared config.

### Why it is centralized

Centralization keeps packages consistent and avoids per-package lint drift.

## VitePress

### What it does here

VitePress powers the public docs app at `apps/docs`.

It is not the maintainer documentation system.

Use VitePress docs when you need:

- consumer-facing installation docs
- usage examples
- package pages

Use root `docs/` when you need:

- contributor-facing instructions
- architectural explanations
- publishing and maintenance workflows

## How The Tools Work Together

The repository workflow is intentionally layered:

1. `pnpm` discovers workspace packages and runs commands
2. `Turborepo` orchestrates package scripts across the workspace
3. `tsup` builds publishable package artifacts
4. `Vitest` validates runtime behavior
5. `Renovate` proposes dependency maintenance updates
6. `Changesets` versions and publishes packages

That layering is important.

Each tool has a narrow responsibility, which keeps the monorepo easier to reason about than a setup where one tool does everything.
