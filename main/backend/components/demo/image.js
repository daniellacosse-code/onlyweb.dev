import Response from "../../framework/main.js";

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
      <custom-image src="/images/test.webp"></custom-image>
      
      <script src="/libraries/frontend/components/custom-image.js" type="module"></script>
    </body>
  </html>`;
