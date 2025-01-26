import Shared from "../framework/shared/bundle.js";
import { bundle } from "https://deno.land/x/emit@0.40.0/mod.ts";
import * as path from "https://deno.land/std@0.221.0/path/mod.ts";

const FRAMEWORK_BUNDLES = {
  // $Backend: "./framework/backend/bundle.js",
  $Frontend: "./framework/frontend/bundle.js",
  $Shared: "./framework/shared/bundle.js"
};

for (const [bundleName, bundlePath] of Object.entries(FRAMEWORK_BUNDLES)) {
  const source = Shared.HTML.minify(
    (await bundle(path.join(Deno.cwd(), bundlePath))).code
  );

  Deno.writeTextFile(
    path.join(Deno.cwd(), "bundles", `${bundleName}.js`),
    source
  );
}
