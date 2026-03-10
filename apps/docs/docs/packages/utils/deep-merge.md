# Deep Merge

Package: `@ddosdor/hyde-park-util-deep-merge`

## Install

```bash
pnpm add @ddosdor/hyde-park-util-deep-merge@0.1.0
```

## Example

```ts
import { deepMerge } from "@ddosdor/hyde-park-util-deep-merge";

const defaults = {
  delays: {
    primary: 100
  }
};

const overrides = {
  delays: {
    primary: 250
  }
};

const merged = deepMerge(defaults, overrides);
```

## Notes

- Ships as `ESM + CJS + .d.ts`
- Replaces arrays instead of concatenating them
- Exposed through `@ddosdor/hyde-park/utils/deep-merge`
