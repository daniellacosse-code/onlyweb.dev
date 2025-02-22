import { assertEquals } from "https://deno.land/std@0.219.0/assert/assert_equals.ts";

import merge from "/framework/shared/user-agent/merge.js";

Deno.test("merge", () => {
  assertEquals(
    merge(
      {
        engine: {
          Chrome: 88
        },
        renderer: {
          WebKit: 537.36
        }
      },
      {
        engine: {
          Chrome: 67
        },
        renderer: {
          WebKit: 800
        }
      }
    ),
    {
      engine: {
        Chrome: 88
      },
      renderer: {
        WebKit: 800
      }
    }
  );
});
