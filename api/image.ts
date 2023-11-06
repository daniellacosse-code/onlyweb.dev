import { encodeBase64 } from "https://deno.land/std@0.205.0/encoding/base64.ts";
import html from "/libraries/templates/html.ts";

export default async () => {
  const image = await Deno.readFile("/Users/daniellacosse/code/only-web/assets/fixxe.jpg");
  const imageBase64 = encodeBase64(image);

  return new Response(
    html`
      <html>
        <head>
          <title>My Cool Image</title>
          <style>
            html, body, body * {
              all: initial;
            }

            main {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
          </style>
        </head>
        <body>
          <main>
            <img src="data:image/jpg;base64,${imageBase64}" />
          </main>
        </body>
      </html>`,
    {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=UTF-8',
      }
    }
  );
}
