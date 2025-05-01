import { assertEquals } from "jsr:@std/assert";

import { parseAgent } from "./parse.ts";

Deno.test("parseAgent", () => {
  assertEquals(
    parseAgent(
      "Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.181 Mobile Safari/537.36",
    ),
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
  );
});
