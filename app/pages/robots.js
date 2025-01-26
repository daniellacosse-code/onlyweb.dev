import "../../bundles/$Backend.js";

$Backend.Page.Register(
  "/robots.txt",
  () =>
    $Backend.Page.Response.text`
  User-agent: *
  Allow: /`,
);
