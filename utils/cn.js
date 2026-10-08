// Minimal className joiner (clsx-style) to avoid another dependency.
export function cn(...args) {
  return args
    .flat()
    .filter(Boolean)
    .join(' ');
}
