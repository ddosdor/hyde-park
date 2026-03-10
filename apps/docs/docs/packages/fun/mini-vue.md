# Mini Vue

Package: `@ddosdor/hyde-park-fun-mini-vue`

## Install

```bash
pnpm add @ddosdor/hyde-park-fun-mini-vue@0.1.0
```

## Example

```ts
import { component, h, mount, reactive } from "@ddosdor/hyde-park-fun-mini-vue";

const state = reactive({ count: 0 });

const Counter = component(() => {
  return h("button", { onClick: () => state.count += 1 }, [`Count: ${state.count}`]);
});

mount(() => Counter(), document.getElementById("app"));
```

## JSX Runtime

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@ddosdor/hyde-park-fun-mini-vue"
  }
}
```

This package exposes both `@ddosdor/hyde-park-fun-mini-vue/jsx-runtime` and `@ddosdor/hyde-park-fun-mini-vue/jsx-dev-runtime`.
