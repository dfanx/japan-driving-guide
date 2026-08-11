import {
  startStaticServer,
  stopStaticServer,
} from "../../scripts/serve-dist.mjs";

export default async function globalSetup() {
  const port = Number(process.env.TEST_PORT ?? "4321");
  const server = await startStaticServer({
    host: "127.0.0.1",
    port,
    basePath: process.env.TEST_BASE_PATH || "/",
  });

  return async () => {
    await stopStaticServer(server);
  };
}
