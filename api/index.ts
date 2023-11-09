import html from "@html";

import resetStyle from "~/fragments/reset.ts";

const pageStyle = html`
  <style>
    main {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1em;
      height: 100svh;
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
