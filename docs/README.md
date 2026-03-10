# Hyde Park Maintainer Documentation

This folder contains the internal documentation for the Hyde Park monorepo itself.

Use this documentation if you are maintaining the repository, adding packages, publishing packages, or changing tooling.

Do not confuse this folder with `apps/docs`, which powers the public-facing package documentation site.

## Documentation Map

- [Project Overview](./project-overview.md)
- [Workspace Structure](./workspace-structure.md)
- [Tooling Guide](./tooling-guide.md)
- [Package Standards](./package-standards.md)
- [Creating Packages](./creating-packages.md)
- [Release Guide](./release-guide.md)
- [Commands Reference](./commands-reference.md)
- [Troubleshooting](./troubleshooting.md)

## Recommended Reading Order

1. Start with [Project Overview](./project-overview.md)
2. Continue with [Workspace Structure](./workspace-structure.md)
3. Read [Tooling Guide](./tooling-guide.md)
4. Use [Package Standards](./package-standards.md) and [Creating Packages](./creating-packages.md) when adding new packages
5. Use [Release Guide](./release-guide.md) when preparing npm releases
6. Use [Commands Reference](./commands-reference.md) and [Troubleshooting](./troubleshooting.md) as operational references

## Current Repository Purpose

Hyde Park is a TypeScript monorepo for independently versioned npm packages.

The repository currently supports:

- Public leaf packages such as utilities, Vue composables, and experimental packages
- A public umbrella package, `@ddosdor/hyde-park`
- Private tooling packages for TypeScript and ESLint
- A private VitePress app for public package docs

## Current Public Package Categories

- `composables`
- `utils`
- `fun`
- `meta` for the umbrella package

## Core Rule

Each public leaf package must be independently installable and independently versionable.

Examples:

```bash
pnpm add @ddosdor/hyde-park-composable-use-debounce@0.1.0
pnpm add @ddosdor/hyde-park-util-deep-merge@0.1.0
pnpm add @ddosdor/hyde-park-fun-mini-vue@0.1.0
```

The umbrella package exists for convenience, not as a replacement for leaf packages:

```bash
pnpm add @ddosdor/hyde-park@0.1.0
```
