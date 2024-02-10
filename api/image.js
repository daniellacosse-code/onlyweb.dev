import Response from "@backend/response";

export default () =>
  Response.html`<html>
    <head>
      <title>My Cool Image</title>

      <!-- TODO: need some kind of script loader -->
      <script>
        globalThis.Framework = {};
      </script>

      <!-- TODO:  get type=module to work in the browser -->
      <!-- And/or: inject the html.js file into the response -->
      <script src="/frontend/scripts/framework/html.js"></script>
      <script src="/frontend/scripts/framework/cuid.js"></script>
      <script src="/frontend/scripts/framework/define-element.js"></script>

      <script src="/frontend/scripts/elements/custom-image.js"></script>

      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100svh;
        }
      </style>
    </head>
    <body>
      <custom-image src="/frontend/images/test.jpg"></custom-image>
    </body>
  </html>`;
