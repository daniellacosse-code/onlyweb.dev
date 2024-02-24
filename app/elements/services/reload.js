import * as Element from "/framework/element/main.js";

import * as constants from "/app/constants.js";

Element.Register("reload-service", {
  handleMount() {
    if (!globalThis.location.host.startsWith("localhost")) return;

    const socket = new WebSocket(
      `ws://localhost:${constants.DENO_LIVERELOAD_PORT}`
    );

    socket.onopen = () => console.log("LiveReload connected~");
    socket.onmessage = (event) => event.data === "reload" && location.reload();
  }
});
