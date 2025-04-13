import { assertEquals } from "https://deno.land/std@0.219.0/assert/assert_equals.ts";

import Response from "./response.js";

Deno.test("Response", () => {
  assertEquals(Response.html`<p>test</p>`.content, "<p>test</p>");
  assertEquals(Response.js`console.log("test")`.content, 'console.log("test")');
});
