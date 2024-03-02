import { encode } from "https://deno.land/std@v0.56.0/encoding/base64.ts";

import Response from "./response.js";
import minify from "/framework/shared/html/minify.js";

export default function Inliner(request) {
  return {
    elements(...filePaths) {
      const { origin } = request.url;
      let result = "";

      for (const filePath of filePaths) {
        const fileContents = Deno.readTextFileSync(`.${filePath}`);
        const sanitizedScript = minify(fileContents)
          .replaceAll(' from "/', ` from "${origin}/`)
          .replaceAll('import "/', `import "${origin}/`);

        result += `<script defer type="module"
          src="data:application/javascript;base64,${encode(sanitizedScript)}"
        ></script>`;
      }

      return Response.html(result);
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
          html`<title>${title}</title>`,
          html`<meta name="og:title" content="${title}" />`
        );
      }

      if (description) {
        tags.push(
          html`<meta name="description" content="${description}" />`,
          html`<meta name="og:description" content="${description}" />`
        );
      }

      if (previewImage) {
        tags.push(html`<meta name="og:image" content="${previewImage}" />`);
      }

      if (url) {
        tags.push(
          html`<link rel="canonical" href="${url}" />`,
          html`<meta name="og:url" content="${url}" />`
        );
      }

      return Response.html(
        tags.reduce((result, { html }) => result + html, "")
      );
    }
  };
}
