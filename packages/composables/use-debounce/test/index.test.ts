import { afterEach, describe, expect, it, vi } from "vitest";
import { effectScope, nextTick, ref } from "vue";

import { useDebounce } from "../src/index";

afterEach(() => {
  vi.useRealTimers();
});

describe("useDebounce", () => {
  it("updates the debounced ref after the configured delay", async () => {
    vi.useFakeTimers();

    const scope = effectScope();
    const state = scope.run(() => {
      const source = ref("alpha");
      const debounced = useDebounce(source, { delay: 50 });
      return { debounced, source };
    });

    if (!state) {
      throw new Error("Failed to create test scope");
    }

    state.source.value = "beta";
    await nextTick();

    expect(state.debounced.value).toBe("alpha");

    vi.advanceTimersByTime(50);
    await nextTick();

    expect(state.debounced.value).toBe("beta");
    scope.stop();
  });

  it("clears pending timers when the scope is disposed", async () => {
    vi.useFakeTimers();

    const scope = effectScope();
    const state = scope.run(() => {
      const source = ref("alpha");
      const debounced = useDebounce(source, { delay: 100 });
      return { debounced, source };
    });

    if (!state) {
      throw new Error("Failed to create test scope");
    }

    state.source.value = "beta";
    await nextTick();

    scope.stop();
    vi.advanceTimersByTime(100);
    await nextTick();

    expect(state.debounced.value).toBe("alpha");
  });
});
