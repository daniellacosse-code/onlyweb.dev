import dataURL from "/libraries/transformers/dataURL.ts";
import html from "/libraries/templates/html.ts";
import resetStyle from "/libraries/fragments/reset.ts";

export default async () => html`
  <html>
    <head>
      <title>My Cool Image</title>
      ${resetStyle}
      <style>
        main {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100svh;
        }
      </style>
    </head>
    <body>
      <main>
        <img src="${await dataURL("./assets/fixxe.jpg")}" />
      </main>
    </body>
  </html>`;
