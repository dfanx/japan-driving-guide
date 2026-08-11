import {
  startStaticServer,
  stopStaticServer,
} from "../../scripts/serve-dist.mjs";

export default async function globalSetup() {
  const server = await startStaticServer({
    host: "127.0.0.1",
    port: 4321,
    basePath: process.env.TEST_BASE_PATH || "/",
  });

  return async () => {
    await stopStaticServer(server);
  };
}
