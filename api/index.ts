import html from "/libraries/templates/html.ts";

export default () => {
  const message = "Hello, World! <script>alert('XSS');</script>";

  return new Response(
    html`
      <html>
        <head>
          <title>My Cool App</title>
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
              gap: 1em;
            }

            h1 {
              font-family: sans-serif;
              font-size: 2em;
              font-weight: bold;
              color: blue;
            }

            a {
              font-family: sans-serif;
              font-size: 1.5em;
              color: orange;
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <main>
            <h1>${message}</h1>
            <a href="/image">view image</a>
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
