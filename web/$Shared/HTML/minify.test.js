import { assertEquals } from "https://deno.land/std@0.219.0/assert/mod.ts";

import minify from "/framework/shared/html/minify.js";

Deno.test("minify", () => {
  assertEquals(
    minify(`
      <html>
        <head>
          <title>Test</title>
        </head>
        <body>
          <p>Hello, world!</p>
        </body>
      </html>
    `),
    "<html> <head> <title>Test</title> </head> <body> <p>Hello, world!</p> </body> </html>"
  );
});
