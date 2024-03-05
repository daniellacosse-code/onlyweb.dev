import Backend from "/framework/backend/module.js";

Backend.Page.Register("/robots.txt", {
  handleRequest: () => Backend.Page.Response.text`
    User-agent: *
    Allow: /`
});
