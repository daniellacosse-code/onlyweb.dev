import { assertEquals } from "https://deno.land/std@0.219.0/assert/assert_equals.ts";

import check from "/framework/shared/user-agent/check.js";

Deno.test("check", () => {
  assertEquals(
    check(
      {
        engine: {
          name: "Chrome",
          version: 88
        },
        renderer: {
          name: "WebKit",
          version: 537.36
        }
      },
      {
        engine: {
          Chrome: 88
        },
        renderer: {
          WebKit: 537.36
        }
      }
    ),
    true
  );
});
