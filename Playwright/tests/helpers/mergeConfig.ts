// Utility type to make all sub-objects of a type partial (deep partial)
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Deep merge helper to merge nested objects
export function merge<T extends object>(base: T, extended: DeepPartial<T>): T {
  return (Object.keys(extended) as Array<keyof T>).reduce(
    (result, key) => {
      const baseValue = base[key];
      const extendedValue = extended[key] as T[keyof T];

      if (
        baseValue &&
        extendedValue &&
        typeof baseValue === 'object' &&
        typeof extendedValue === 'object' &&
        !Array.isArray(baseValue) &&
        !Array.isArray(extendedValue)
      ) {
        result[key] = merge(baseValue, extendedValue);
      } else {
        result[key] = extendedValue;
      }
      return result;
    },
    { ...base },
  );
}
