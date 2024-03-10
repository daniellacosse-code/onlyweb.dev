import { assertEquals } from "https://deno.land/std@0.219.0/assert/mod.ts";

import parse from "/framework/shared/user-agent/parse.js";

Deno.test("parse", () => {
  assertEquals(
    parse(
      "Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.181 Mobile Safari/537.36"
    ),
    {
      browser: {
        name: "Chrome",
        version: 88
      },
      engine: {
        name: "WebKit",
        version: 537.36
      }
    }
  );
});
