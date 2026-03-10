import { describe, expect, it } from "vitest";
import { effectScope, ref } from "vue";

import { deepMerge, useDebounce } from "../src/index";
import { deepMerge as deepMergeSubpath } from "../src/utils/deep-merge";

describe("@ddosdor/hyde-park", () => {
  it("re-exports the utility and composable APIs", () => {
    expect(deepMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });

    const scope = effectScope();
    const debounced = scope.run(() => useDebounce(ref("value")));

    expect(typeof debounced).toBe("object");
    scope.stop();
  });

  it("keeps subpath exports aligned with the root entrypoint", () => {
    expect(deepMergeSubpath({ feature: { enabled: false } }, { feature: { enabled: true } })).toEqual({
      feature: {
        enabled: true
      }
    });
  });
});
