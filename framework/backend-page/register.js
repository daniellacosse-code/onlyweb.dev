import { html } from "./response.js";

export default (
  route,
  { handleRequest = () => {}, handleServiceWorkerRequest = () => {} }
) => {
  globalThis.customPages ??= new Map();

  if (globalThis.customPages.has(route))
    return console.warn(`Page "${route}" already registered.`);

  globalThis.customPages.set(route, async (request) => {
    Object.defineProperty(request, "url", {
      writable: true,
      value: new URL(request.url)
    });

    request.language =
      request.url.searchParams.get("lang") ??
      request.headers.get("accept-language")?.split(",")[0] ??
      "en-US";

    if (request.url.searchParams.has("service")) {
      try {
        const serviceWorker = handleServiceWorkerRequest(request);

        if (!serviceWorker) return new Response("Not Found", { status: 404 });

        return serviceWorker;
      } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 });
      }
    }

    try {
      return html`
        <!DOCTYPE html>
        <html lang="${request.language}">
          ${await handleRequest(request)}
          <script>
            (function () {
              // launch devtools
              if (globalThis.location.href.match(/localhost/)) {
                const reloadSocket = new WebSocket(
                  "ws://localhost:${constants.DENO_LIVERELOAD_PORT}"
                );

                socket.onopen = () => console.log("LiveReload connected~");
                socket.onmessage = ({ data }) =>
                  data === "reload" && location.reload();
              }

              // register service worker
              if ("serviceWorker" in navigator) {
                navigator.serviceWorker.register("${route}?service", {
                  scope: "${route}"
                });
              }

              // TODO: user agent warning
              // TODO: load translations, if any
            })();
          </script>
        </html>
      `;
    } catch (error) {
      console.error(error);
      return new Response("Internal Server Error", { status: 500 });
    }
  });

  console.debug(`Registered page @ route "${route}".`);
};
