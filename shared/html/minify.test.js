import { assertEquals } from "jsr:@std/assert";

import { minifyHtml } from "./minify.ts";

Deno.test("minifyHtml", () => {
  assertEquals(
    minifyHtml(`
      <html>
        <head>
          <title>Test</title>
        </head>
        <body>
          <p>Hello, world!</p>
        </body>
      </html>
    `),
    "<html> <head> <title>Test</title> </head> <body> <p>Hello, world!</p> </body> </html>",
  );
});
