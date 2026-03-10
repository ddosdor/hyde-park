# Installation

Hyde Park supports two consumption models.

## Install a single leaf package

```bash
pnpm add @ddosdor/hyde-park-composable-use-debounce@0.1.0
pnpm add @ddosdor/hyde-park-util-deep-merge@0.1.0
```

## Install the umbrella package

```bash
pnpm add @ddosdor/hyde-park@0.1.0
```

Then import by subpath:

```ts
import { useDebounce } from "@ddosdor/hyde-park/composables/use-debounce";
import { deepMerge } from "@ddosdor/hyde-park/utils/deep-merge";
```

## Peer dependencies

Vue composables require `vue@^3.5.30`.
