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

  assertEquals(
    minifyHtml(`
      <!-- outer <!-- inner --> <script>alert('xss')</script> --> <p>content</p>
    `),
    "<p>content</p>",
  );

  assertEquals(
    minifyHtml(`
      <!-- comment 1 --> <p>content</p> <!-- comment 2 -->
    `),
    "<p>content</p>",
  );
});
