import { assertEquals } from "jsr:@std/assert";

import { escapeHtml } from "./escape.ts";

Deno.test("escapeHtml", () => {
  assertEquals(
    escapeHtml("<script>alert('hi')</script>"),
    "&lt;script&gt;alert(&#39;hi&#39;)&lt;/script&gt;",
  );
});
