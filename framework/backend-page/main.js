import { elements } from "./inline/elements.js";
import { metadata } from "./inline/metadata.js";
export { html } from "./html.js";

export const Inline = { elements, metadata };

export default (route, { handleRequest = () => {} }) => {
  globalThis.customPages ??= new Map();

  if (globalThis.customPages.has(route))
    return console.warn(`Page "${route}" already registered.`);

  globalThis.customPages.set(route, async (request) => {
    request.url = new URL(request.url);
    request.language =
      request.headers.get("accept-language")?.split(",")[0] ??
      request.url.searchParams.get("lang") ??
      "en";

    const response = html`
      <!DOCTYPE html>
      <html lang="${request.language}">
        ${await handleRequest(request)}
      </html>
    `;

    if (response) {
      return response;
    }

    return new Response("Not found", { status: 404 });
  });
};
