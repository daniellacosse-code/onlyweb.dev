import * as path from "https://deno.land/std@0.205.0/path/mod.ts";

import File from "@file";
import html from "@html";

import resetStyle from "~/fragments/reset.ts";

export default () => html`
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
        <img src="${new File(path.resolve("./assets/fixxe.jpg")).toString()}" />
      </main>
    </body>
  </html>`;
