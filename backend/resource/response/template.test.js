import { assertEquals } from "jsr:@std/assert";

import { html, js } from "./template.ts";

Deno.test("template html & js response", () => {
  assertEquals(html`<p>test</p>`.content, "<p>test</p>");
  assertEquals(js`console.log("test")`.content, 'console.log("test")');
});
