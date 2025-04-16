import { assertEquals } from "jsr:@std/assert";

import check from "./check.ts";

Deno.test("check", () => {
  assertEquals(
    check(
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
