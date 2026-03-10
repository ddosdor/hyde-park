# Commands Reference

This document lists the important commands for day-to-day maintenance.

## Root Commands

### Install dependencies

```bash
pnpm install
```

Installs dependencies for the entire workspace and updates `pnpm-lock.yaml` if needed.

### Build the whole monorepo

```bash
pnpm build
```

Runs:

```bash
turbo run build
```

### Lint the whole monorepo

```bash
pnpm lint
```

Runs:

```bash
turbo run lint
```

### Typecheck the whole monorepo

```bash
pnpm typecheck
```

Runs:

```bash
turbo run typecheck
```

### Run tests

```bash
pnpm test
```

Runs:

- package unit tests through Turborepo
- tarball smoke tests through `scripts/smoke/consumer-smoke.mjs`

### Run only package unit tests

```bash
pnpm run test:unit
```

### Run tarball smoke tests

```bash
pnpm run test:smoke
```

### Start public docs app

```bash
pnpm dev:docs
```

### Clean task outputs

```bash
pnpm clean
```

### Create a changeset

```bash
pnpm changeset
```

### Apply pending version bumps

```bash
pnpm version-packages
```

### Validate release readiness

```bash
pnpm release:check
```

### Publish changed packages

```bash
pnpm publish-packages
```

### Generate a new package

```bash
pnpm new:package -- --type composable --name use-throttle
pnpm new:package -- --type util --name stable-stringify
```

## Useful pnpm Filter Commands

### Build one package

```bash
pnpm --filter @ddosdor/hyde-park-fun-mini-vue build
```

### Test one package

```bash
pnpm --filter @ddosdor/hyde-park-fun-mini-vue test
```

### Lint one package

```bash
pnpm --filter @ddosdor/hyde-park-fun-mini-vue lint
```

### Typecheck one package

```bash
pnpm --filter @ddosdor/hyde-park-fun-mini-vue typecheck
```

### Run a command by path

```bash
pnpm --filter ./packages/fun/mini-vue build
```

## Useful Turborepo Commands

### Dry-run the build graph

```bash
pnpm exec turbo run build --dry
```

### Force rebuild without cache

```bash
pnpm exec turbo run build --force
```

### Show execution graph

```bash
pnpm exec turbo run build --graph=graph.svg
```

### Filter Turborepo execution

```bash
pnpm exec turbo run build --filter=@ddosdor/hyde-park-fun-mini-vue
```

## Useful Changesets Commands

### Show status

```bash
pnpm exec changeset status --verbose
```

### Snapshot versioning

```bash
pnpm exec changeset version --snapshot
```

### Publish with custom dist-tag

```bash
pnpm exec changeset publish --tag canary
```

### Publish with OTP

```bash
pnpm exec changeset publish --otp=123456
```

## Useful npm/packaging Checks

### Pack one package locally

```bash
pnpm --filter @ddosdor/hyde-park-fun-mini-vue pack
```

### Inspect TypeScript resolution

```bash
pnpm --filter @ddosdor/hyde-park-fun-mini-vue exec tsc --showConfig
```

### Check current npm user

```bash
npm whoami
```

### Check published versions

```bash
npm view @ddosdor/hyde-park-fun-mini-vue versions --json
```
