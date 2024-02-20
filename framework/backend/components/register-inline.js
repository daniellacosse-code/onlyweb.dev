import { encode } from "https://deno.land/std@v0.56.0/encoding/base64.ts";

import { minify } from "/framework/shared/html/minify.js";
import { response } from "../pages/html.js";

// register components inline ONLY when you're sure all
// their dependencies are also loaded
export function registerInline(filePath, host = "http://localhost:8000") {
  const fileContents = Deno.readTextFileSync(`.${filePath}`);
  const sanitizedScript = minify(fileContents)
    .replaceAll(' from "/', ` from "${host}/`)
    .replaceAll('import "/', `import "${host}/`);

  return response`<script type="module" src="data:application/javascript;base64,${encode(
    sanitizedScript
  )}"></script>`;
}
