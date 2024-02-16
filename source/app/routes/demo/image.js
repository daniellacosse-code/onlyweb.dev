import Response from "../../../framework/backend/main.js";

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
    </head>
    <body>
      <custom-image src="/app/assets/images/test.webp"></custom-image>
      
      <script src="/api/app/components/custom-image.js" type="module"></script>
    </body>
  </html>`;
