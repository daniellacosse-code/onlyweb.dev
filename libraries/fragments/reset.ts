import html from "/libraries/templates/html.ts";

export default html`
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
`;
