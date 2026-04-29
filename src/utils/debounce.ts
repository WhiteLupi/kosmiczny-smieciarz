export function debounce<T extends (...args: never[]) => void>(fn: T, ms: number): T {
  let h: ReturnType<typeof setTimeout> | null = null;
  return ((...args: Parameters<T>) => {
    if (h) clearTimeout(h);
    h = setTimeout(() => fn(...args), ms);
  }) as T;
}
