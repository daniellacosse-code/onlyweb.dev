import { htmlMinify } from "/framework/shared/html/minify.js";

import { response } from "./response.js";
import { encode } from "https://deno.land/std@v0.56.0/encoding/base64.ts";

export function inline(filePath) {
  const payload = encode(
    htmlMinify(Deno.readTextFileSync(filePath)).replace(
      ' from "/',

      // TODO: set host based on environment
      ' from "http://localhost:8000/'
    )
  );

  return response`<script type="module" src="data:application/javascript;base64,${payload}"></script>`;
}
