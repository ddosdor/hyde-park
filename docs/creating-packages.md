# Creating Packages

This document explains how to add new packages to Hyde Park.

## Overview

There are two creation flows:

1. generator-based flow for supported package types
2. manual flow for custom package categories

Use the generator whenever possible.

## Generator-Based Flow

The repository currently includes a generator script:

```bash
pnpm new:package -- --type <composable|util> --name <kebab-case-name>
```

Current supported types:

- `composable`
- `util`

### Example: create a composable

```bash
pnpm new:package -- --type composable --name use-throttle
```

This will create:

- `packages/composables/use-throttle`
- `apps/docs/docs/packages/composables/use-throttle.md`

### Example: create a utility

```bash
pnpm new:package -- --type util --name stable-stringify
```

This will create:

- `packages/utils/stable-stringify`
- `apps/docs/docs/packages/utils/stable-stringify.md`

### What the generator creates

The generator scaffolds:

- `package.json`
- `tsconfig.json`
- `tsup.config.ts`
- `src/index.ts`
- `test/index.test.ts`
- a docs page in `apps/docs`

### Generator limitations

The generator does not currently support:

- `fun`
- `meta`
- arbitrary custom categories
- packages with multiple entrypoints such as `jsx-runtime`

For those cases, use the manual flow below.

## Manual Flow For Custom Categories

Use the manual flow when you need to create a package such as:

- `packages/fun/*`
- a new custom category
- a package with subpath exports
- a package that does not fit the default generator templates

## Example: adding a new `fun` package

Suppose you want:

```text
@ddosdor/hyde-park-fun-state-machine
```

Recommended process:

1. Create a new folder:

```bash
mkdir -p packages/fun/state-machine/src packages/fun/state-machine/test
```

2. Copy the closest existing package as a template.

If the package is simple, copy from a leaf package such as `deep-merge`.

If the package needs extra subpath exports, copy from `mini-vue` or the umbrella package.

3. Update `package.json`.

At minimum:

- set the correct package name
- set the initial version
- define scripts
- define `exports`
- define `publishConfig.access`
- add dependencies and peer dependencies

4. Create `tsconfig.json`.

For most packages under `packages/*/*`, the shared config path should be:

```json
{
  "extends": "../../tooling/typescript-config/library.json"
}
```

If you need DOM libs, either:

- extend `../../tooling/typescript-config/base.json` and set `lib` manually
- or adapt the closest existing package that already does this

5. Create `tsup.config.ts`.

Use:

- one entrypoint for a normal package
- named entries for packages with subpath exports

6. Add tests in `test/`.

7. Add a docs page in:

```text
apps/docs/docs/packages/fun/state-machine.md
```

8. If the category is already in the docs sidebar, you are done.

If it is a brand new category, also update:

- `apps/docs/docs/.vitepress/config.ts`

9. Run validation:

```bash
pnpm --filter @ddosdor/hyde-park-fun-state-machine lint
pnpm --filter @ddosdor/hyde-park-fun-state-machine typecheck
pnpm --filter @ddosdor/hyde-park-fun-state-machine test
pnpm --filter @ddosdor/hyde-park-fun-state-machine build
```

## Manual Flow For An Entirely New Category

If the category is not `composables`, `utils`, `fun`, or `meta`, do the following.

### Step 1: choose the folder

Example:

```text
packages/renderers/terminal-ui
```

### Step 2: choose the npm naming rule

Keep the naming predictable.

Example:

```text
@ddosdor/hyde-park-renderer-terminal-ui
```

or:

```text
@ddosdor/hyde-park-renderers-terminal-ui
```

Pick one convention and keep it consistent across the category.

### Step 3: create product docs folder

Example:

```text
apps/docs/docs/packages/renderers/
```

### Step 4: update VitePress sidebar

The current sidebar is explicitly configured by category.

You must update:

- `apps/docs/docs/.vitepress/config.ts`

to make the new category appear in the public docs navigation.

### Step 5: decide whether the smoke test should include the new package type

If the new package type introduces special packaging behavior, update:

- `scripts/smoke/consumer-smoke.mjs`

Examples of packages that deserve smoke coverage:

- packages with custom subpath exports
- packages with tricky peer dependencies
- packages with unusual package.json wiring

### Step 6: update maintainer docs if the new category becomes first-class

At minimum, review:

- `docs/README.md`
- `docs/workspace-structure.md`
- `docs/package-standards.md`

## How To Decide Between Generator And Manual Flow

Use the generator when:

- the package is a standard composable or util
- it only needs `src/index.ts`
- it has one main public entrypoint

Use manual creation when:

- the package belongs to `fun`
- the package needs custom exports
- the package needs special TS config
- the package is in a new category

## Recommended Validation After Creating A Package

Run these commands before opening a PR or preparing a release:

```bash
pnpm --filter <package-name> lint
pnpm --filter <package-name> typecheck
pnpm --filter <package-name> test
pnpm --filter <package-name> build
```

Then run the full repo validation:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

## Optional: extending the generator

If you repeatedly create packages in a new category, extending the generator is preferable to repeating manual steps forever.

The generator lives in:

- `scripts/new-package.mjs`

To extend it, update:

- supported `--type` values
- category-to-folder mapping
- package naming rule
- generated source template
- generated docs location
- generated `tsconfig` shape if the category needs special libs

Do this only when the new category is stable enough to deserve first-class tooling.
