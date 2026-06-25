type ClassValue = string | number | false | null | undefined;

/** Join truthy class names into a single string. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
