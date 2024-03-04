import { encode } from "https://deno.land/std@v0.56.0/encoding/base64.ts";

import Response from "./response.js";
import minify from "/framework/shared/html/minify.js";

export default async function Inliner(request) {
  const origin = request.url.origin;

  const messages = await (
    await fetch(`${origin}/app/assets/messages/${request.language}.json`)
  ).json();

  return {
    elements(...filePaths) {
      const result = [];

      for (const filePath of filePaths) {
        const fileContents = Deno.readTextFileSync(`.${filePath}`);
        const sanitizedScript = minify(fileContents)
          .replaceAll(' from "/', ` from "${origin}/`)
          .replaceAll('import "/', `import "${origin}/`);

        result.push(Response.html`<script defer type="module"
          src="data:application/javascript;base64,${encode(sanitizedScript)}"
        ></script>`);
      }

      return Response.html`${result}`;
    },

    message(key) {
      return messages[key] ?? key;
    },

    metadata({
      title,
      description,
      previewImage,
      url = request.url.toString()
    }) {
      const tags = [];

      if (title) {
        tags.push(
          Response.html`<title>${title}</title>`,
          Response.html`<meta name="og:title" content="${title}" />`
        );
      }

      if (description) {
        tags.push(
          Response.html`<meta name="description" content="${description}" />`,
          Response.html`<meta name="og:description" content="${description}" />`
        );
      }

      if (previewImage) {
        tags.push(
          Response.html`<meta name="og:image" content="${previewImage}" />`
        );
      }

      if (url) {
        tags.push(
          Response.html`<link rel="canonical" href="${url}" />`,
          Response.html`<meta name="og:url" content="${url}" />`
        );
      }

      return Response.html`${tags}`;
    }
  };
}
