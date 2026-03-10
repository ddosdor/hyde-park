import { deepMerge, type MergeableRecord } from "@ddosdor/hyde-park-util-deep-merge";
import { onScopeDispose, readonly, ref, watch, type Ref } from "vue";

export interface UseDebounceOptions {
  delay?: number;
}

const DEFAULT_OPTIONS = {
  delay: 200
} satisfies UseDebounceOptions;

export function useDebounce<T>(
  source: Ref<T>,
  options: UseDebounceOptions = {}
): Readonly<Ref<T>> {
  const { delay } = deepMerge(DEFAULT_OPTIONS, options as MergeableRecord);
  const debounced = ref(source.value) as Ref<T>;
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const clearTimeoutHandle = () => {
    if (timeout === undefined) {
      return;
    }

    clearTimeout(timeout);
    timeout = undefined;
  };

  watch(source, (value) => {
    clearTimeoutHandle();
    timeout = setTimeout(() => {
      debounced.value = value;
      timeout = undefined;
    }, delay);
  });

  onScopeDispose(clearTimeoutHandle);

  return readonly(debounced) as Readonly<Ref<T>>;
}
