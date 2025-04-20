import { assertEquals } from "jsr:@std/assert";

import * as Response from "./response.ts";

Deno.test("Response", () => {
  assertEquals(Response.html`<p>test</p>`.content, "<p>test</p>");
  assertEquals(Response.js`console.log("test")`.content, 'console.log("test")');
});
