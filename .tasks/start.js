const DENO_LIVERELOAD_PORT = 35729;
const DENO_LIVERELOAD_DELAY = 1000;

let server, reloadInProgress, reloadSocket;

startOrReloadAppServer();
startLiveReloadServer();

for await (const _ of Deno.watchFs([
  `${Deno.cwd()}/app`,
  `${Deno.cwd()}/framework`
])) {
  await startOrReloadAppServer();

  if (reloadInProgress) continue;

  const intervalID = setInterval(() => {
    try {
      if (reloadSocket?.readyState === WebSocket.OPEN) {
        reloadSocket.send("reload");
        clearInterval(intervalID);
      }
    } catch (_) {
      // do nothing
    }
  }, DENO_LIVERELOAD_DELAY);
}

async function startOrReloadAppServer() {
  if (reloadInProgress) return;
  reloadInProgress = true;

  try {
    server?.kill();
    await server?.output();
  } catch (_) {
    // do nothing
  }

  const serverCommand = new Deno.Command("deno", {
    args: ["run", "--allow-net", "--allow-read=.", "--allow-env", "app/main.js"]
  });

  try {
    return (server = serverCommand.spawn());
  } catch (_) {
    // do nothing
  } finally {
    reloadInProgress = false;
  }
}

function startLiveReloadServer() {
  Deno.serve({
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
}
