import { assertEquals } from "jsr:@std/assert";

import { mergeAgent } from "./merge.ts";

Deno.test("merge", () => {
  assertEquals(
    mergeAgent(
      {
        engine: {
          Chrome: 88,
        },
        renderer: {
          WebKit: 537.36,
        },
      },
      {
        engine: {
          Chrome: 67,
        },
        renderer: {
          WebKit: 800,
        },
      },
    ),
    {
      engine: {
        Chrome: 88,
      },
      renderer: {
        WebKit: 800,
      },
    },
  );
});
