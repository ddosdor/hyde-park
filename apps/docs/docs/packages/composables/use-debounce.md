# Use Debounce

Package: `@ddosdor/hyde-park-composable-use-debounce`

## Install

```bash
pnpm add @ddosdor/hyde-park-composable-use-debounce@0.1.0 vue@^3.5.30
```

## Example

```ts
import { ref } from "vue";
import { useDebounce } from "@ddosdor/hyde-park-composable-use-debounce";

const search = ref("");
const debouncedSearch = useDebounce(search, { delay: 250 });
```

## Notes

- Ships as `ESM + CJS + .d.ts`
- Depends on `@ddosdor/hyde-park-util-deep-merge`
- Exposed through `@ddosdor/hyde-park/composables/use-debounce`
