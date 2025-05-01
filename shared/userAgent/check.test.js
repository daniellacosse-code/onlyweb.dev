import { assertEquals } from "jsr:@std/assert";

import { checkAgent } from "./check.ts";

Deno.test("checkAgent", () => {
  assertEquals(
    checkAgent(
      {
        engine: {
          name: "Chrome",
          version: 88,
        },
        renderer: {
          name: "WebKit",
          version: 537.36,
        },
      },
      {
        engine: {
          Chrome: 88,
        },
        renderer: {
          WebKit: 537.36,
        },
      },
    ),
    true,
  );
});
