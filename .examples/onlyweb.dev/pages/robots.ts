import { registerPage, text } from "@onlyweb/backend";

registerPage(
  "/robots.txt",
  () =>
    text`
  User-agent: *
  Allow: /`,
);
