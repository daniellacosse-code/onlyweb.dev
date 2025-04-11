import { assertEquals } from "https://deno.land/std@0.219.0/assert/assert_equals.ts";

import Inliner from "./inliner.js";

Deno.test("Inliner", async () => {
  const inliner = await Inliner({
    url: new URL("https://example.com"),
    language: "en",
  }, {
    messagesFolder: "",
  });

  assertEquals(
    await inliner.elements(() => "register element").content,
    `<script type="module" src="data:application/javascript;base64,KCgpID0+ICJyZWdpc3RlciBlbGVtZW50IikoKTs="></script>`,
  );

  assertEquals(await inliner.message("test"), "test");
  assertEquals(
    (
      await inliner.metadata({
        title: "Test",
        description: "Test",
        previewImagePath: "/assets/images/preview.png",
        splashImagePath: "/assets/images/splash.png",
        iconImagePath: "/assets/images/icon.png",
      })
    ).content,
    '<link rel="canonical" href="https://example.com/" /><meta name="og:url" content="https://example.com/" /><title>Test</title> <meta name="og:title" content="Test" /><meta name="description" content="Test" /> <meta name="og:description" content="Test" /><link rel="icon" href="/assets/images/icon.png" /> <meta name="apple-mobile-web-app-capable" content="yes" /> <link rel="apple-touch-icon" href="/assets/images/icon.png" /><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" /><link rel="apple-touch-startup-image" href="/assets/images/splash.png" /><meta name="og:image" content="/assets/images/preview.png" />',
  );
});
