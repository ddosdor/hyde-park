# Release Guide

This document explains how public package releases work in Hyde Park.

## Release Model

Hyde Park uses Changesets for multi-package versioning and publishing.

This means:

- you do not manually bump package versions by editing `package.json`
- you create changesets describing package changes
- Changesets computes version bumps
- Changesets updates internal dependency ranges
- Changesets publishes only changed public packages

## Which Packages Can Be Published

Public packages can be published.

Private packages cannot.

Current public packages include:

- `@ddosdor/hyde-park-util-deep-merge`
- `@ddosdor/hyde-park-composable-use-debounce`
- `@ddosdor/hyde-park-fun-mini-vue`
- `@ddosdor/hyde-park`

Current private workspace packages include:

- `@ddosdor/hyde-park-typescript-config`
- `@ddosdor/hyde-park-eslint-config`
- `@ddosdor/hyde-park-docs`

## Release Preconditions

Before releasing, make sure:

1. the repository is in a git repository
2. the `main` branch exists locally
3. you are authenticated to npm
4. package changes are committed
5. validation passes

## Step 1: create a changeset

When you change a public package, add a changeset:

```bash
pnpm changeset
```

This creates a Markdown file in `.changeset/`.

The file records:

- which packages changed
- what bump type they need
- a short release note

### When a changeset is required

Create a changeset when:

- you change public runtime behavior
- you change package exports
- you add or remove public APIs
- you change peer dependency expectations
- you add a public package

### When a changeset is usually not required

Usually not required when:

- you only change private tooling
- you only change docs
- you only change tests
- you only change internal scripts

If in doubt, prefer adding a changeset for public package changes.

## Step 2: validate the repository

Run:

```bash
pnpm release:check
```

This currently runs:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `node ./scripts/release-check.mjs`

The script `release-check.mjs` skips `changeset status` if:

- the directory is not a git repository
- the `main` branch does not exist

In a real repository clone, `changeset status --verbose` should run successfully.

## Step 3: apply version bumps

Run:

```bash
pnpm version-packages
```

This executes:

```bash
changeset version
```

Effects:

- package versions are updated
- internal dependency ranges are updated
- used changeset files are consumed

## Step 4: inspect generated changes

Before publishing, inspect:

- modified `package.json` versions
- internal dependency range updates
- any generated changelog behavior if enabled in the future

Hyde Park currently has:

- `"changelog": false`

So Changesets will not generate changelog files automatically.

## Step 5: publish packages

Run:

```bash
pnpm publish-packages
```

This currently runs:

1. `pnpm lint`
2. `pnpm typecheck`
3. `pnpm test`
4. `pnpm exec changeset publish`

Effects:

- changed public packages publish to npm
- git tags are created for published package versions

## Step 6: push commits and tags

After publishing, push:

```bash
git push
git push --follow-tags
```

This step is important because Changesets creates git tags during publish.

## Release Example

### Example scenario

You change:

- `@ddosdor/hyde-park-util-deep-merge`

Workflow:

```bash
pnpm changeset
pnpm release:check
pnpm version-packages
pnpm publish-packages
git push
git push --follow-tags
```

If a composable depends on that util and Changesets determines the internal range should update, it will update that dependency range during `changeset version`.

## Adding A Brand New Public Package

When adding a new public package:

1. create the package
2. add docs
3. validate it
4. create a changeset that includes the new package
5. run versioning
6. publish

## How Independent Versioning Works Here

Hyde Park does not use `fixed` or `linked` package groups.

That means:

- package versions do not move in lockstep by default
- unrelated package changes do not force all packages to bump together

This is intentional.

## Snapshot Releases

Changesets supports snapshot versioning, but Hyde Park does not currently wrap it in a root script.

If you need it, the underlying command is:

```bash
pnpm exec changeset version --snapshot
```

Use snapshots only when you intentionally want temporary prerelease-style versions for testing.

## Release Failure Scenarios

### `changeset status` fails because `main` is missing

Cause:

- the repo has not been initialized properly
- or the local clone does not have `main`

Fix:

- initialize git
- create or fetch the `main` branch

### npm publish fails

Possible causes:

- not logged in
- missing permissions for the scope
- version already published
- 2FA / OTP required

Fix:

- verify `npm whoami`
- verify scope access
- retry with appropriate npm auth

### published package has the wrong files

Cause:

- incorrect `files`
- incorrect `exports`
- build output mismatch

Fix:

- inspect the package locally with `pnpm pack`
- inspect generated tarball contents
- update `package.json` and `tsup.config.ts`

## Release Checklist

Use this checklist before every public release:

1. Public API changes are intentional
2. Package docs are updated
3. Tests reflect the change
4. A changeset exists for each changed public package
5. `pnpm release:check` passes
6. `pnpm version-packages` looks correct
7. `pnpm publish-packages` completes successfully
8. Git tags are pushed
