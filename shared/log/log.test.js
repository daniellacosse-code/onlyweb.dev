import { assertEquals } from "jsr:@std/assert";

import { log, logError } from "./log.ts";

Deno.test("Log", () => {
  const _console = {
    info: (message) => {
      assertEquals(
        message,
        JSON.stringify({
          o: new Date().toISOString(),
          l: 1,
          m: "Hello, world!",
        }),
      );
    },
  };
  log({ message: "Hello, world!", _console });
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
          d: "{}",
        }),
      );
    },
  };
  logError(new Error("Something went wrong"), _console);
});
