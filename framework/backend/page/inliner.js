import { encode } from "https://deno.land/std@v0.56.0/encoding/base64.ts";

import Response from "./response.js";
import minify from "/framework/shared/html/minify.js";

export default async function Inliner(request) {
  const origin = request.url.origin;

  let messages;

  try {
    messages = await (
      await fetch(`${origin}/app/assets/messages/${request.language}.json`)
    ).json();
  } catch (error) {
    console.error(error);
    messages = {};
  }

  return {
    elements(...filePaths) {
      const result = [];

      for (const filePath of filePaths) {
        const fileContents = Deno.readTextFileSync(`.${filePath}`);
        const sanitizedScript = minify(fileContents)
          .replaceAll(' from "/', ` from "${origin}/`)
          .replaceAll('import "/', `import "${origin}/`);

        result.push(Response.html`<script async type="module"
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
      splashImage,
      iconImage,
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

      if (iconImage) {
        tags.push(
          Response.html`<link rel="icon" href="${iconImage}" />`,
          Response.html`<meta name="apple-mobile-web-app-capable" content="yes" />`,
          // it's a bit opinionated, but you really only have two options here - black and black-translucent
          // and only the latter allows the web app to be displayed in full screen
          Response.html`<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`,
          Response.html`<link rel="apple-touch-icon" href="${iconImage}" />`
        );
      }

      if (splashImage) {
        tags.push(
          // TODO iterate over all possible splash images
          Response.html`<link rel="apple-touch-startup-image" href="${splashImage}" />`
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
