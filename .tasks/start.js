const DENO_LIVERELOAD_PORT = 35729;
const DENO_LIVERELOAD_DELAY = 100;

let serverProcess, reloadInProgress, reloadServer;
startOrReloadAppServer();
startOrReloadLiveReloadServer();

for await (const event of Deno.watchFs([
  `${Deno.cwd()}/app`,
  `${Deno.cwd()}/framework`
])) {
  console.debug("Filesystem event:", event.kind, event.paths.join(", "));

  await startOrReloadAppServer();

  setTimeout(() => {
    try {
      reloadServer?.send("reload");
    } catch (error) {
      console.error("Error sending reload message:", error);
      startOrReloadLiveReloadServer();
    }
  }, DENO_LIVERELOAD_DELAY);
}

async function startOrReloadAppServer() {
  if (reloadInProgress) return;
  reloadInProgress = true;

  try {
    serverProcess?.kill();
    await serverProcess?.output();
  } catch (error) {
    console.error("Error terminating previous process:", error);
  }

  const serverCommand = new Deno.Command("deno", {
    args: ["run", "--allow-net", "--allow-read=.", "app/index.js"]
  });

  try {
    return (serverProcess = serverCommand.spawn());
  } catch (error) {
    console.error("Error spawing new process:", error);
  } finally {
    reloadInProgress = false;
  }
}

function startOrReloadLiveReloadServer() {
  if (reloadServer) reloadServer.close();

  Deno.serve({
    port: DENO_LIVERELOAD_PORT,
    handler: (request) => {
      if (request.headers.get("upgrade") !== "websocket") {
        return new Response("Not a websocket upgrade request", { code: 400 });
      }

      const { socket, response } = Deno.upgradeWebSocket(request);

      reloadServer = socket;

      return response;
    }
  });
}
