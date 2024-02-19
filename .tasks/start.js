const DENO_PORT = 8000;
const DENO_LIVERELOAD_PORT = 35729;

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
  console.log("Filesystem event:", event);

  startOrReloadServer();
  reloadSocket.send("reload");
}

let serverProcess;
async function startOrReloadServer() {
  serverProcess?.kill();
  await serverProcess?.output();

  console.info(`Starting server at :${DENO_PORT}`);
  serverProcess = await Deno.Command(Deno.cwd(), {
    args: ["deno", "run", "--allow-net", "--allow-read=.", "app/index.js"]
  });
}
