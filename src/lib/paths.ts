const buildBase = import.meta.env.BASE_URL;

export function withBase(path: string): string {
  if (!path.startsWith("/")) {
    throw new TypeError(`withBase requires a root-relative path, received ${path}`);
  }
  const normalizedPath = path.replace(/^\/+/, "");
  const normalizedBase = buildBase.endsWith("/") ? buildBase : `${buildBase}/`;
  return `${normalizedBase}${normalizedPath}`;
}
