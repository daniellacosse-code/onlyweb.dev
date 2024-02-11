import Response from "../src/libraries/backend/response/main.js";

export default () =>
  Response.html`<html>
    <head>
      <title>My Cool Image</title>

      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100svh;
        }
      </style>

      <script src="/libraries/frontend/components/vercel-image.js" type="module" defer></script>
    </head>
    <body>
      <vercel-image src="/images/test.webp"></vercel-image>
    </body>
  </html>`;
