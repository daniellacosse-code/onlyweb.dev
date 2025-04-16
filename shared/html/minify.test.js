import { assertEquals } from "jsr:@std/assert";

import minify from "./minify.ts";

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
    "<html> <head> <title>Test</title> </head> <body> <p>Hello, world!</p> </body> </html>",
  );
});
