# Project Overview

## What Hyde Park Is

Hyde Park is a monorepo for publishing multiple TypeScript packages from one repository while keeping each public package independently releasable.

The design goal is:

- one repository
- many packages
- one shared toolchain
- independent package versions
- independent npm releases

This is not a single-package repository with subpath exports only.

That distinction matters because subpath exports alone do not give you independent versioning. If everything lived inside a single npm package, every public module would share one version number. Hyde Park avoids that by making each public package its own npm package.

## Product Model

Hyde Park uses a hybrid publishing model:

- leaf packages are the primary product
- `@ddosdor/hyde-park` is a convenience umbrella package

Leaf packages are what consumers should use when they want precise control over installed versions.

The umbrella package is useful when consumers prefer a single dependency with curated subpath exports.

## Repository Goals

- Keep package boundaries explicit
- Keep build, lint, typecheck, and test workflows consistent
- Reuse tooling and conventions across packages
- Support public npm publishing through Changesets
- Make package creation predictable
- Keep internal config packages private

## Current Package Types

### Public packages

- `packages/composables/*`
- `packages/utils/*`
- `packages/fun/*`
- `packages/meta/hyde-park`

### Private packages

- `packages/tooling/typescript-config`
- `packages/tooling/eslint-config`
- `apps/docs`

## Why This Repository Uses a Monorepo

The monorepo approach gives the project:

- a single lockfile
- shared dev tooling
- consistent lint/typecheck/test rules
- easier local linking with `workspace:*`
- fast task orchestration with Turborepo
- coordinated publishing with Changesets

Without a monorepo, every package would need its own duplicated release, lint, build, and test setup.

## Public Naming Strategy

Hyde Park uses scoped npm package names with an explicit project prefix.

Examples:

- `@ddosdor/hyde-park-composable-use-debounce`
- `@ddosdor/hyde-park-util-deep-merge`
- `@ddosdor/hyde-park-fun-mini-vue`
- `@ddosdor/hyde-park`

This pattern makes it immediately obvious which packages belong to Hyde Park.

## Package Independence

Independence in this repository means:

- each public package has its own `package.json`
- each public package has its own `version`
- each public package can be published on its own
- consumers can install exact versions package-by-package

Independence does not necessarily mean zero internal dependencies.

For example, a composable may depend on an internal utility package through `workspace:*`. Hyde Park allows that, but versions remain package-specific and Changesets updates internal dependency ranges as part of versioning.

## What Is in `apps/docs`

`apps/docs` is a private VitePress application that documents the public packages for users.

It is not the same as the root `docs/` folder.

Use:

- `apps/docs` for product/package documentation
- `docs/` for maintainer/monorepo documentation

## What Is in Root `docs/`

The root `docs/` folder explains:

- how the monorepo is structured
- how the tooling works
- how to add packages
- how to release packages
- how to work with custom categories such as `fun`

## High-Level Workflow

The typical workflow in Hyde Park is:

1. Create or update a package
2. Run local validation
3. Add a changeset for public package changes
4. Version packages
5. Publish packages
6. Push release commits and tags

All of those steps are described in detail later in this documentation set.
