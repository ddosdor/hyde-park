# Package Standards

This document defines what a Hyde Park package should look like.

## Package Categories

A public package normally belongs to one of these categories:

- `composables`
- `utils`
- `fun`
- `meta`

A private package normally belongs to:

- `tooling`
- `apps`

## Public Package Contract

Each public package should have:

- a scoped npm name
- a real version
- `"type": "module"`
- `main`, `module`, and `types`
- explicit `exports`
- `"sideEffects": false` when appropriate
- `"files": ["dist"]`
- `"publishConfig": { "access": "public" }`
- `build`, `lint`, `typecheck`, `test`, `clean` scripts

## Naming Rules

### Composable packages

Pattern:

```text
@ddosdor/hyde-park-composable-<name>
```

Example:

```text
@ddosdor/hyde-park-composable-use-debounce
```

### Utility packages

Pattern:

```text
@ddosdor/hyde-park-util-<name>
```

Example:

```text
@ddosdor/hyde-park-util-deep-merge
```

### Fun packages

Pattern:

```text
@ddosdor/hyde-park-fun-<name>
```

Example:

```text
@ddosdor/hyde-park-fun-mini-vue
```

### Umbrella package

Pattern:

```text
@ddosdor/hyde-park
```

## Expected File Layout

### Typical leaf package

```text
packages/<category>/<name>/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── src/
│   └── index.ts
└── test/
    └── index.test.ts
```

### Package with subpath exports

```text
packages/<category>/<name>/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── src/
│   ├── index.ts
│   ├── jsx-runtime.ts
│   └── jsx-dev-runtime.ts
└── test/
    └── index.test.ts
```

## TypeScript Configuration

Packages should extend shared TypeScript config from:

- `../../tooling/typescript-config/library.json`
- `../../tooling/typescript-config/base.json`
- `../../tooling/typescript-config/app.json`

Use:

- `library.json` for most publishable packages
- `base.json` when you need to define your own `lib`
- `app.json` for app-like packages such as the docs app

## Build Configuration

Most publishable packages use tsup with:

- `clean: true`
- `dts: true`
- `format: ["esm", "cjs"]`
- `sourcemap: true`
- `target: "es2022"`

## Dependency Rules

### Public runtime dependencies

Allowed when needed.

Example:

- a composable can depend on a util

### Workspace dependencies

Always use `workspace:*` for local package dependencies.

Example:

```json
{
  "dependencies": {
    "@ddosdor/hyde-park-util-deep-merge": "workspace:*"
  }
}
```

### Peer dependencies

Use peer dependencies when the consuming application is expected to provide the framework package.

Example:

```json
{
  "peerDependencies": {
    "vue": "^3.5.30"
  }
}
```

## Scripts Contract

Every public package should expose:

```json
{
  "scripts": {
    "build": "tsup",
    "lint": "eslint .",
    "typecheck": "tsc --project tsconfig.json",
    "test": "vitest run",
    "clean": "node -e \"...\""
  }
}
```

These script names matter because Turborepo discovers tasks by script name.

If a package does not expose the expected script, the root workflow becomes inconsistent.

## Exports Contract

Use explicit `exports`.

Do not rely on consumers importing private files.

### Good

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
}
```

### Multiple entry points

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./jsx-runtime": {
      "types": "./dist/jsx-runtime.d.ts",
      "import": "./dist/jsx-runtime.js",
      "require": "./dist/jsx-runtime.cjs"
    }
  }
}
```

## Testing Expectations

At minimum, each public package should have:

- a unit test file
- enough assertions to prove the exported API works

The repository also uses tarball smoke tests at root level to ensure packages install correctly outside the workspace.

## Documentation Expectations

Each public package should have a public docs page in:

```text
apps/docs/docs/packages/<category>/<name>.md
```

The docs page should include:

- package name
- install command
- basic example
- any important notes such as peer dependencies or special exports

## Private Package Rules

Private packages must set:

```json
{
  "private": true
}
```

They should not be published to npm.

Examples:

- `@ddosdor/hyde-park-typescript-config`
- `@ddosdor/hyde-park-eslint-config`
- `@ddosdor/hyde-park-docs`

## When To Create a New Category

Create a new category only if the new packages are materially different from existing ones.

Good reasons:

- a new class of runtime with distinct consumers
- different packaging needs
- different documentation grouping

Bad reasons:

- personal preference
- one-off naming style
- avoiding the word `fun`

If the package is experimental but still fundamentally a util, keep it in `utils`.

If the package is meaningfully different, a new category may be justified.
