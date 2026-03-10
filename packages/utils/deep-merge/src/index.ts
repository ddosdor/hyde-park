export type MergeableRecord = Record<string, unknown>;

function isPlainObject(value: unknown): value is MergeableRecord {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function cloneValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item)) as T;
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, cloneValue(nestedValue)])
    ) as T;
  }

  return value;
}

export function deepMerge<T extends MergeableRecord, U extends MergeableRecord>(
  target: T,
  source: U
): T & U {
  const result = cloneValue(target) as MergeableRecord;

  for (const [key, sourceValue] of Object.entries(source)) {
    const targetValue = result[key];

    if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
      result[key] = deepMerge(targetValue, sourceValue);
      continue;
    }

    result[key] = cloneValue(sourceValue);
  }

  return result as T & U;
}
