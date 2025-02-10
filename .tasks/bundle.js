import Shared from "../framework/shared/bundle.js";
import { bundle } from "https://deno.land/x/emit@0.40.0/mod.ts";
import * as path from "https://deno.land/std@0.221.0/path/mod.ts";

const FRAMEWORK_BUNDLES = {
  $Backend: "./framework/backend/bundle.js",
  $Frontend: "./framework/frontend/bundle.js",
  $Shared: "./framework/shared/bundle.js",
};

Deno.mkdirSync(path.join(Deno.cwd(), "output/bundles"), { recursive: true });

for (const [bundleName, bundlePath] of Object.entries(FRAMEWORK_BUNDLES)) {
  const bundleWrapperPath = path.join(
    Deno.cwd(),
    "output/bundles",
    `${bundleName}.js`,
  );

  Deno.writeTextFileSync(
    bundleWrapperPath,
    `import Bundle from "${
      path.join(Deno.cwd(), bundlePath)
    }"; globalThis.${bundleName} = Bundle;`,
  );

  let source = (await bundle(bundleWrapperPath)).code;

  if (bundleName !== "$Backend") {
    source = Shared.HTML.minify(source);
  }

  Deno.writeTextFile(
    path.join(Deno.cwd(), "bundles", `${bundleName}.js`),
    source,
  );
}
