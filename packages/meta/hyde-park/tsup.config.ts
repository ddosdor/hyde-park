import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    index: "src/index.ts",
    "composables/use-debounce": "src/composables/use-debounce.ts",
    "utils/deep-merge": "src/utils/deep-merge.ts"
  },
  external: [
    "@ddosdor/hyde-park-composable-use-debounce",
    "@ddosdor/hyde-park-util-deep-merge",
    "vue"
  ],
  format: ["esm", "cjs"],
  sourcemap: true,
  target: "es2022"
});
