import { html } from "~/libraries/html/main.js";

export default () =>
  new Response(
    html`<html>
      <head>
        <title>My Cool Image</title>

        <script src="/assets/scripts/framework/cuid.js"></script>
        <script src="/assets/scripts/framework/custom-element.js"></script>

        <script src="/assets/scripts/elements/custom-image.js"></script>

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
        <custom-image src="/assets/images/test.png"></custom-image>
      </body>
    </html>`,
    { headers: { "content-type": "text/html; charset=UTF-8" } }
  );
