import html from "./html.js";

export default (route, { handleRequest = () => {} }) => {
  globalThis.customPages ??= new Map();

  if (globalThis.customPages.has(route))
    return console.warn(`Page "${route}" already registered.`);

  globalThis.customPages.set(route, async (request) => {
    Object.defineProperty(request, "url", {
      writable: true,
      value: new URL(request.url)
    });
    request.language =
      request.headers.get("accept-language")?.split(",")[0] ??
      request.url.searchParams.get("lang") ??
      "en";

    try {
      return html`
        <!DOCTYPE html>
        <html lang="${request.language}">
          ${await handleRequest(request)}
        </html>
      `;
    } catch (error) {
      console.error(error);
      return new Response("Internal Server Error", { status: 500 });
    }
  });

  console.debug(`Registered page "${route}".`);
};
