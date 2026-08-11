import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve("dist");

function readFlag(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function normalizeBasePath(value) {
  const trimmed = (value || "/").trim();
  if (trimmed === "/") return "/";
  return `/${trimmed.replace(/^\/+|\/+$/g, "")}/`;
}

async function resolveAsset(pathname, basePath = "/") {
  const normalizedBase = normalizeBasePath(basePath);
  const decoded = decodeURIComponent(pathname);
  if (normalizedBase !== "/" && !decoded.startsWith(normalizedBase)) {
    return null;
  }
  const localPath = normalizedBase === "/"
    ? decoded
    : `/${decoded.slice(normalizedBase.length)}`;
  const candidate = resolve(root, `.${localPath === "/" ? "/index.html" : localPath}`);

  if (candidate !== root && !candidate.startsWith(`${root}${sep}`)) {
    return null;
  }

  try {
    const details = await stat(candidate);
    return details.isDirectory() ? resolve(candidate, "index.html") : candidate;
  } catch {
    return null;
  }
}

export function startStaticServer({ host = "127.0.0.1", port = 4321, basePath = "/" } = {}) {
  const server = createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", `http://${host}:${port}`);
    const asset = await resolveAsset(url.pathname, basePath);

    if (!asset) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    try {
      const body = await readFile(asset);
      response.writeHead(200, {
        "content-type": contentTypes[extname(asset)] ?? "application/octet-stream",
      });
      response.end(body);
    } catch {
      response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      response.end("Unable to read build output");
    }
  });

  return new Promise((resolveServer, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => resolveServer(server));
  });
}

export function stopStaticServer(server) {
  server.closeAllConnections();
  return new Promise((resolveClose, reject) => {
    server.close((error) => (error ? reject(error) : resolveClose()));
  });
}

const isDirectRun =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const host = readFlag("--host", "127.0.0.1");
  const port = Number(readFlag("--port", "4321"));
  const basePath = readFlag("--base", "/");
  const server = await startStaticServer({ host, port, basePath });

  console.log(`Static preview: http://${host}:${port}${normalizeBasePath(basePath)}`);

  const shutdown = async () => {
    await stopStaticServer(server);
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
