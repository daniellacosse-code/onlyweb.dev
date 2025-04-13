import Backend from "../../../backend/main.js";

Backend.Page.Register(
  "/robots.txt",
  () =>
    $Backend.Page.Response.text`
  User-agent: *
  Allow: /`,
);
