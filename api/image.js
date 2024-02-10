import Response from "../libraries/backend/response/main.js";

export default () =>
  Response.html`<html>
    <head>
      <title>My Cool Image</title>

      <!-- TODO: need some kind of script loader that injects the file into the response -->
      <script>
        globalThis.Framework = {};
      </script>

      <!-- TODO: get type=module to work so we can reuse code -->
      <script src="/scripts/framework/html.js"></script>
      <script src="/scripts/framework/cuid.js"></script>
      <script src="/scripts/framework/define-element.js"></script>

      <script src="/scripts/components/custom-image.js"></script>

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
      <custom-image src="/images/test.webp"></custom-image>
    </body>
  </html>`;
