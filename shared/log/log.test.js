import { assertEquals } from "jsr:@std/assert";

import { log, logError } from "./log.ts";

function mockDate(isoTimestamp) {
  const OriginalDate = globalThis.Date;
  const fixedDate = new OriginalDate(isoTimestamp);
  globalThis.Date = class extends OriginalDate {
    constructor(...args) {
      if (args.length > 0) {
        super(...args);
      } else {
        return fixedDate;
      }

      super();
    }

    static now() {
      return fixedDate.getTime();
    }

    toISOString() {
      return fixedDate.toISOString();
    }
  };

  return () => {
    globalThis.Date = OriginalDate;
  };
}

Deno.test("Log", () => {
  const fixedTimestamp = "2024-01-01T10:00:00.000Z";
  const restoreDate = mockDate(fixedTimestamp);

  const _console = {
    info: (message) => {
      assertEquals(
        message,
        JSON.stringify({
          o: fixedTimestamp,
          l: 1,
          m: "Hello, world!",
        }),
      );
    },
  };
  log({ message: "Hello, world!", _console });
  restoreDate();
});

Deno.test("LogError", () => {
  const fixedTimestamp = "2024-01-01T10:00:00.000Z"; // Choose a fixed time
  const restoreDate = mockDate(fixedTimestamp); // Mock Date before the test

  const _console = {
    error: (message) => {
      assertEquals(
        message,
        JSON.stringify({
          o: fixedTimestamp,
          l: 4,
          m: "Something went wrong",
          d: "{}",
        }),
      );
    },
  };
  logError(new Error("Something went wrong"), _console);
  restoreDate();
});
