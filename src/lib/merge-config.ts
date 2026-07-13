function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Merges `partial` (untrusted data from Firestore, possibly missing whole
 * sections) onto `defaults` (the always-complete fallback shape). Nested
 * plain objects are merged key-by-key so a document that only ever had its
 * `footer` saved still gets a valid `theme`/`settings`/etc. Arrays and
 * primitives are replaced wholesale when present, never merged element-wise.
 */
export function mergeWithDefaults<T>(defaults: T, partial: unknown): T {
  if (!isPlainObject(partial)) return defaults;
  if (!isPlainObject(defaults)) return (partial as T) ?? defaults;

  const result: Record<string, unknown> = { ...(defaults as Record<string, unknown>) };
  for (const key of Object.keys(defaults as Record<string, unknown>)) {
    const defaultVal = (defaults as Record<string, unknown>)[key];
    const partialVal = (partial as Record<string, unknown>)[key];
    if (partialVal === undefined) continue;
    result[key] = isPlainObject(defaultVal) && isPlainObject(partialVal)
      ? mergeWithDefaults(defaultVal, partialVal)
      : partialVal;
  }
  return result as T;
}
