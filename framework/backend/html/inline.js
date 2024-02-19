import { minify } from "/framework/shared/html/minify.js";

import { response } from "./response.js";
import { encode } from "https://deno.land/std@v0.56.0/encoding/base64.ts";

export function inline(filePath, host = "http://localhost:8000") {
  const fileContents = Deno.readTextFileSync(filePath);
  const sanitizedScript = minify(fileContents)
    .replaceAll(' from "/', ` from "${host}/`)
    .replaceAll('import "/', `import "${host}/`);

  return response`<script type="module" src="data:application/javascript;base64,${encode(
    sanitizedScript
  )}"></script>`;
}
