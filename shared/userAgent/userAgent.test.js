import { assertEquals } from "https://deno.land/std@0.219.0/assert/assert_equals.ts";

import { check, merge, parse } from "./userAgent.js";

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

Deno.test("merge", () => {
  assertEquals(
    merge(
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

Deno.test("parse", () => {
  assertEquals(
    parse(
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
