# Packages

This page is the package catalog for Hyde Park.

Hyde Park is built as a monorepo of independently versioned npm packages. Consumers can install a single package, combine multiple packages, or use the umbrella package when a single dependency is more convenient.

## Categories

### Composables

Vue-focused composables published as standalone packages.

- [useDebounce](/packages/composables/use-debounce)

### Utils

Framework-agnostic TypeScript utilities.

- [deepMerge](/packages/utils/deep-merge)

### Fun

Experimental, educational, or hobby-style packages that still follow Hyde Park packaging standards.

- [miniVue](/packages/fun/mini-vue)

## Umbrella Package

The umbrella package is useful when consumers prefer one dependency with curated subpath exports:

- `@ddosdor/hyde-park`

Leaf packages remain the primary product when consumers want exact per-package version control.

## Installation Paths

Install an individual package:

```bash
pnpm add @ddosdor/hyde-park-composable-use-debounce
pnpm add @ddosdor/hyde-park-util-deep-merge
pnpm add @ddosdor/hyde-park-fun-mini-vue
```

Install the umbrella package:

```bash
pnpm add @ddosdor/hyde-park
```

For more details, see [Installation](/public-api/installation).
