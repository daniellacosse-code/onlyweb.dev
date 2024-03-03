const DENO_LIVERELOAD_PORT = 35729;
const DENO_LIVERELOAD_DELAY = 1000;

let server, reloadInProgress, reloadServer, reloadSocket;
startOrReloadAppServer();
startOrReloadLiveReloadServer();

for await (const event of Deno.watchFs([
  `${Deno.cwd()}/app`,
  `${Deno.cwd()}/framework`
])) {
  console.debug("Filesystem event:", event.kind, event.paths.join(", "));

  await startOrReloadAppServer();

  const intervalID = setInterval(async () => {
    try {
      if (reloadSocket?.readyState === WebSocket.OPEN) {
        reloadSocket.send("reload");
        clearInterval(intervalID);
      } else {
        await startOrReloadLiveReloadServer();
      }
    } catch (error) {
      console.error("Error sending reload message:", error);
    }
  }, DENO_LIVERELOAD_DELAY);
}

async function startOrReloadAppServer() {
  if (reloadInProgress) return;
  reloadInProgress = true;

  try {
    server?.kill();
    await server?.output();
  } catch (error) {
    console.error("Error terminating previous process:", error);
  }

  const serverCommand = new Deno.Command("deno", {
    args: ["run", "--allow-net", "--allow-read=.", "--allow-env", "app/main.js"]
  });

  try {
    return (server = serverCommand.spawn());
  } catch (error) {
    console.error("Error spawing new process:", error);
  } finally {
    reloadInProgress = false;
  }
}

async function startOrReloadLiveReloadServer() {
  reloadSocket?.close();
  await reloadServer?.shutdown();

  setTimeout(() => {
    reloadServer = Deno.serve({
      port: DENO_LIVERELOAD_PORT,
      handler: (request) => {
        if (request.headers.get("upgrade") !== "websocket") {
          return new Response("Not a websocket upgrade request", { code: 400 });
        }

        const { socket, response } = Deno.upgradeWebSocket(request);

        reloadSocket = socket;

        return response;
      }
    });
  }, DENO_LIVERELOAD_DELAY);
}
