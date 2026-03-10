# Hyde Park

TypeScript monorepo for independently versioned utility packages, Vue composables, and an optional umbrella package.

Maintainer documentation lives in [`docs/`](./docs/README.md).
Published package docs: <https://ddosdor.github.io/hyde-park/>.

## Package model

- Leaf packages are the primary product and publish independently to npm.
- `@ddosdor/hyde-park` is a convenience package with subpath exports.
- Public leaf packages follow these naming rules:
  - `@ddosdor/hyde-park-composable-<name>`
  - `@ddosdor/hyde-park-util-<name>`

## Workspace layout

```text
apps/
  docs/                       VitePress docs and examples
packages/
  composables/               Public Vue composables
  meta/hyde-park/            Public umbrella package
  tooling/                   Private config/tooling packages
  utils/                     Public framework-agnostic utilities
scripts/
  new-package.mjs            Generator for new packages
  smoke/consumer-smoke.mjs   Tarball install smoke test
```

## Commands

```bash
pnpm install
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm dev:docs
pnpm changeset
pnpm version-packages
pnpm publish-packages
pnpm new:package -- --type composable --name use-throttle
```

## Running docs

The package documentation site lives in `apps/docs` and is built with VitePress.

Run the docs locally from the repository root:

```bash
pnpm install
pnpm dev:docs
```

Useful docs-specific commands:

```bash
pnpm --filter @ddosdor/hyde-park-docs build
pnpm --filter @ddosdor/hyde-park-docs preview
```

GitHub Pages deployment is configured in [`.github/workflows/deploy-docs.yml`](./.github/workflows/deploy-docs.yml).
After enabling `Settings > Pages > Build and deployment > Source: GitHub Actions`, pushes to `main` will publish the docs to <https://ddosdor.github.io/hyde-park/>.

## Current public packages

- `@ddosdor/hyde-park-util-deep-merge`
- `@ddosdor/hyde-park-composable-use-debounce`
- `@ddosdor/hyde-park-fun-mini-vue`
- `@ddosdor/hyde-park`
