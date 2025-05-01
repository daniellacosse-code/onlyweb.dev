import { registerPage, text } from "@onlyweb/backend";

registerPage(
  "/robots.txt",
  () =>
    Promise.resolve(text`
  User-agent: *
  Allow: /`),
);
