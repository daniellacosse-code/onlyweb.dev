import { escape, handle, minify, parse } from "../main.ts";

Deno.bench(function benchHandleSmallTemplate() {
  handle({
    template: ["Hello, ", "!"],
    insertions: ["world"],
    handleInsertion: (insertion) => insertion,
  });
});

Deno.bench(function benchHandleLargeTemplate() {
  handle({
    template: Array(1000).fill("Hello, "),
    insertions: Array(1000).fill("world"),
    handleInsertion: (insertion) => insertion,
  });
});

Deno.bench(function escapeSmallString() {
  escape("<script>alert('Hello, world!');</script>");
});

Deno.bench(function escapeLargeString() {
  escape("<script>alert('Hello, world!');</script>".repeat(1000));
});

Deno.bench(function minifySmallString() {
  minify("<div>  <p>Hello, world!</p>  </div>");
});

Deno.bench(function minifyLargeString() {
  minify("<div>  <p>Hello, world!</p>  </div>".repeat(1000));
});

Deno.bench(function parseUserAgent() {
  parse(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  );
});
