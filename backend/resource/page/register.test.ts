import { assertEquals } from "jsr:@std/assert";
import { registerPage } from "./register.ts";

import { resourceRegistry } from "../registry.ts";

const emptyResponse = {
  mimetype: "",
  content: "",
  nativeResponse: new Response(),
};

const emptyRequest = {
  language: "en",
  url: new URL("https://www.example.com"),
  nativeRequest: new Request("https://www.example.com"),
};

Deno.test("registerPage", async () => {
  await registerPage("/", {
    render: () => Promise.resolve(emptyResponse),
    renderServiceWorker: () => Promise.resolve(emptyResponse),
  });

  assertEquals(Boolean(resourceRegistry.get("/")), true);
  assertEquals(
    Boolean(resourceRegistry.get("/")?.(emptyRequest)),
    true,
  );
  assertEquals(
    Boolean(
      resourceRegistry.get("/")?.(emptyRequest),
    ),
    true,
  );
});

Deno.test("registerPage with function", async () => {
  await registerPage("/", () => Promise.resolve(emptyResponse));

  assertEquals(Boolean(resourceRegistry.get("/")), true);
  assertEquals(
    Boolean(resourceRegistry.get("/")?.(emptyRequest)),
    true,
  );
  assertEquals(
    Boolean(
      resourceRegistry.get("/")?.(emptyRequest),
    ),
    true,
  );
});
