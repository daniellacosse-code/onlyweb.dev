import html from "/libraries/templates/html.ts";
import resetStyle from "/libraries/fragments/reset.ts";

const pageStyle = html`
  <style>
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
`;

const pageMessage = "Hello, World! <script>alert('XSS');</script>";

export default () => html`
  <html>
    <head>
      <title>My Cool App</title>
      ${resetStyle}
      ${pageStyle}
    </head>
    <body>
      <main>
        <h1>${pageMessage}</h1>
        <a href="/image">view image</a>
      </main>
    </body>
  </html>`;
