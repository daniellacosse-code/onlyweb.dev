import { assertEquals } from "jsr:@std/assert";

import { html, js } from "./template.ts";

Deno.test("response html, js", () => {
  assertEquals(html`<p>test</p>`.content, "<p>test</p>");
  assertEquals(js`console.log("test")`.content, 'console.log("test")');
});
