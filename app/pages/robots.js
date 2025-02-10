import "https://raw.githubusercontent.com/daniellacosse-code/onlyweb.dev/bundles-cleanup/inject-globals/bundles/$Backend.js";

$Backend.Page.Register(
  "/robots.txt",
  () =>
    $Backend.Page.Response.text`
  User-agent: *
  Allow: /`,
);
