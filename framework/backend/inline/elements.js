import { encode } from "https://deno.land/std@v0.56.0/encoding/base64.ts";

import { minify } from "/framework/shared/html/minify.js";
import * as Page from "/framework/backend/page/html.js";

// register elements inline ONLY when you're sure all
// their dependencies are also registered
export function elements(...filePaths) {
  const host = Deno.env.get("DENO_HOST") ?? "http://localhost:8000";

  let result = "";

  for (const filePath of filePaths) {
    const fileContents = Deno.readTextFileSync(`.${filePath}`);
    const sanitizedScript = minify(fileContents)
      .replaceAll(' from "/', ` from "${host}/`)
      .replaceAll('import "/', `import "${host}/`);

    result += `<script defer type="module"
      src="data:application/javascript;base64,${encode(sanitizedScript)}"
    ></script>`;
  }

  return new Page.HTMLResponse(result);
}