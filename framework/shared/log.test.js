import { assertEquals } from "https://deno.land/std@0.219.0/assert/assert_equals.ts";

import Log, { LogError } from "./log.js";

Deno.test("Log", () => {
  const _console = {
    info: (message) => {
      assertEquals(
        message,
        JSON.stringify({
          o: new Date().toISOString(),
          l: 1,
          m: "Hello, world!"
        })
      );
    }
  };
  Log({ message: "Hello, world!", _console });
});

Deno.test("LogError", () => {
  const _console = {
    error: (message) => {
      assertEquals(
        message,
        JSON.stringify({
          o: new Date().toISOString(),
          l: 4,
          m: "Something went wrong",
          d: "{}"
        })
      );
    }
  };
  LogError(new Error("Something went wrong"), _console);
});
