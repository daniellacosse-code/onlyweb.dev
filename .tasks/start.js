const DENO_LIVERELOAD_PORT = 35729;
const DENO_LIVERELOAD_DELAY = 100;

let serverProcess, reloadInProgress;
startOrReloadServer();

let reloadSocket;
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

for await (const event of Deno.watchFs(Deno.cwd())) {
  console.debug("Filesystem event:", event.kind, event.paths.join(", "));

  await startOrReloadServer();

  setTimeout(() => reloadSocket?.send("reload"), DENO_LIVERELOAD_DELAY);
}

async function startOrReloadServer() {
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
