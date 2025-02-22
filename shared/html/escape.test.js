import { assertEquals } from "https://deno.land/std@0.219.0/assert/mod.ts";

import escape from "/framework/shared/html/escape.js";

Deno.test("escape", () => {
  assertEquals(
    escape("<script>alert('hi')</script>"),
    "&lt;script&gt;alert(&#39;hi&#39;)&lt;/script&gt;"
  );
});
