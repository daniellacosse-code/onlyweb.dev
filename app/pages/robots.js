import Backend from "/framework/backend/module.js";

Backend.Page.Register("/robots.txt", {
  responses: {
    handleDefault: () => Backend.Page.Response.text`
    User-agent: *
    Allow: /`
  }
});
