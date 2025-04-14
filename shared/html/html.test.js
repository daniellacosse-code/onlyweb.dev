import { assertEquals } from "https://deno.land/std@0.219.0/assert/mod.ts";

import { escape, minify } from "./html.js";

Deno.test("escape", () => {
  assertEquals(
    escape("<script>alert('hi')</script>"),
    "&lt;script&gt;alert(&#39;hi&#39;)&lt;/script&gt;",
  );
});

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
