import { assertEquals } from "jsr:@std/assert";
import { registerPage } from "./register.ts";

Deno.test("register", async () => {
  await registerPage("/", {
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
  await registerPage("/", () => new Response());

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
