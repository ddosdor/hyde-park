# Troubleshooting

This document collects common issues and how to fix them.

## TypeScript cannot resolve shared config

### Symptom

Your editor shows an error in `tsconfig.json` on the `extends` field.

### Cause

Some editors are less reliable when resolving TypeScript config through package exports inside a workspace.

### Current Hyde Park approach

Workspace packages use relative paths to shared config files instead of package-name-based `extends`.

Example:

```json
{
  "extends": "../../tooling/typescript-config/library.json"
}
```

### Fix

- keep `extends` relative for workspace packages
- restart the TypeScript server in the editor if the error persists

## Changeset status fails

### Symptom

`changeset status` fails with an error related to `main` or git history.

### Cause

Changesets expects:

- a git repository
- a base branch

### Fix

- initialize git if needed
- ensure `main` exists
- fetch the latest remote branches

The root script `release:check` already skips `changeset status` when this repo is not yet a real git repository.

## A package installs locally in the workspace but not from a tarball

### Symptom

Local development works, but tarball install or real npm install fails.

### Cause

Common causes:

- incorrect `exports`
- incorrect `files`
- missing build outputs
- runtime dependencies not packaged correctly

### Fix

- run `pnpm pack` for the package
- inspect the tarball contents
- run the root smoke test
- verify `package.json` `exports`, `main`, `module`, and `types`

## Vitest is loading the wrong files

### Symptom

Tests import `.js` artifacts instead of `.ts` source files.

### Cause

Compiled artifacts were accidentally copied into `src/` or `test/`.

### Fix

- remove stray compiled files from source directories
- keep compiled output only in `dist/`

This happened once when `mini-vue` was copied from another repository with generated `.js` files still present.

## `no-undef` errors on DOM types in TypeScript

### Symptom

ESLint reports `document`, `window`, `HTMLElement`, or `Event` as undefined in TypeScript code.

### Cause

The generic JavaScript `no-undef` rule is not a good fit for TypeScript type positions.

### Current Hyde Park approach

The shared ESLint config disables:

- `no-undef`
- `no-redeclare`

and uses TypeScript-aware linting instead.

## Smoke tests fail on unpublished internal dependencies

### Symptom

Installing a tarball tries to fetch another internal package from npm.

### Cause

The consumer environment does not know where to get unpublished dependent packages.

### Current Hyde Park approach

The smoke test script uses local tarballs and `pnpm` overrides to simulate installation of unpublished packages together.

If you add a package with special dependency behavior, update:

- `scripts/smoke/consumer-smoke.mjs`

## New custom package category does not appear in docs

### Symptom

The docs page exists, but the category is missing in the public docs sidebar.

### Cause

The VitePress sidebar is explicitly configured.

### Fix

Update:

- `apps/docs/docs/.vitepress/config.ts`

## Turborepo does not cache your build

### Symptom

Builds always rerun.

### Cause

Typical causes:

- `outputs` missing in `turbo.json`
- build files written outside declared outputs
- task inputs changed

### Fix

- confirm the task declares outputs
- confirm the package writes artifacts into `dist/`
- avoid writing build artifacts into random directories

## A package should be private but is being prepared like a public package

### Symptom

A package is not supposed to publish, but it looks like a normal public package.

### Fix

For private packages:

- set `"private": true`
- do not add publish metadata
- do not treat them as releaseable public packages

## Generator does not support my category

### Symptom

You want to create `fun`, `meta`, or another custom category with `pnpm new:package`, but it only accepts `composable` or `util`.

### Fix

Use the manual flow in [Creating Packages](./creating-packages.md).

If the category becomes common, extend:

- `scripts/new-package.mjs`

## When to ask for a new docs section

Add or expand documentation when:

- a workflow requires tribal knowledge
- a package category becomes common
- a release failure pattern repeats
- the generator or tooling model changes

If documentation starts lagging behind implementation, update the docs immediately as part of the same change.
