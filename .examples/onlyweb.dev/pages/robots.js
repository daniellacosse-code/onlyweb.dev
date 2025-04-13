import Backend from "@onlyweb/backend";

Backend.Page.Register(
  "/robots.txt",
  () =>
    $Backend.Page.Response.text`
  User-agent: *
  Allow: /`,
);
