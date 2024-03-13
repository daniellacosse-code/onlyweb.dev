import { assertEquals } from "https://deno.land/std@0.219.0/assert/assert_equals.ts";

import { html, js } from "/framework/backend/page/response.js";

Deno.test("Response", () => {
  assertEquals(html`<p>test</p>`.content, "<p>test</p>");
  assertEquals(js`console.log("test")`.content, 'console.log("test")');
});
