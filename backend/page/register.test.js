import { assertEquals } from "jsr:@std/assert";
import register from "./register.ts";

Deno.test("register", async () => {
  await register("/", {
    handleRequest: () => new Response(),
    handleServiceWorker: () => new Response(),
  });

  assertEquals(Boolean(globalThis.customPages.get("/")), true);
  assertEquals(
    Boolean(globalThis.customPages.get("/")(new Request("localhost:8000"))),
    true,
  );
  assertEquals(
    Boolean(
      globalThis.customPages.get("/")(new Request("localhost:8000/?service")),
    ),
    true,
  );
});

Deno.test("function register", async () => {
  await register("/", () => new Response());

  assertEquals(Boolean(globalThis.customPages.get("/")), true);
  assertEquals(
    Boolean(globalThis.customPages.get("/")(new Request("localhost:8000"))),
    true,
  );
  assertEquals(
    Boolean(
      globalThis.customPages.get("/")(new Request("localhost:8000/?service")),
    ),
    true,
  );
});
